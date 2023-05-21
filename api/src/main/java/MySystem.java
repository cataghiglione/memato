import model.*;
import repository.Matches;
import repository.Searches;
import repository.Teams;
import repository.Users;
import model.Team;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import java.text.ParseException;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;

public class MySystem {

    private final EntityManagerFactory factory;

    private MySystem(EntityManagerFactory factory) {
        this.factory = factory;
    }

    public static MySystem create(String persistenceUnitName) {
        final EntityManagerFactory factory = Persistence.createEntityManagerFactory(persistenceUnitName);
        return new MySystem(factory);
    }

    public Optional<User> registerUser(RegistrationUserForm form) {
        return runInTransaction(datasource -> {
            final Users users = datasource.users();
            return users.exists(form.getEmail(), form.getUsername()) ? Optional.empty() : Optional.of(users.createUser(form));
        });
    }

    public Optional<Team> createTeam(CreateTeamForm form, User user) {
        return runInTransaction(datasource -> {
            final Teams teams = datasource.teams();
            return teams.exists(form.getName(), user) ? Optional.empty() : Optional.of(teams.createTeam(form, user));
        });

    }

    public Optional<Match> createMatch(CreateMatchForm form, Optional<Search> search1, Optional<Search> search2) {
        return runInTransaction(datasource -> {
            final Matches matches = datasource.matches();
            return matches.createMatch(form, search1, search2);
        });
    }

    public Optional<Search> findOrCreateSearch(CreateSearchForm form, Team team) {
        return runInTransaction(datasource -> {
            final Searches searches = datasource.searches();
            try {
                return searches.exists(Long.toString(team.getId()), form.getTime(), form.getDate(), form.getLatitude(), form.getLongitude()) ? searches.reactivateSearch(team, form.getTime(), form.getDate(), form.getLatitude(), form.getLongitude()) : Optional.of(searches.createSearch(team, form.getDate(), form.getTime(), form.getLatitude(), form.getLongitude()));
            } catch (ParseException e) {
                throw new RuntimeException(e);
            }
        });

    }
    public boolean deactivateSearch(Long id){
        return runInTransaction(datasource ->{
            final Searches searches = datasource.searches();
            try{
                return searches.deactivateSearchBySearchId(id);
            }
            catch (Exception e){
                throw new RuntimeException(e);
            }
        });
    }
    public boolean confirmMatch(Long matchid, Long teamId){
        return runInTransaction(datasource ->{
            final Matches matches = datasource.matches();
            try{
                return matches.confirmMatchByTeam(matchid,teamId);
            }
            catch (Exception e){
                throw new RuntimeException(e);
            }
        });
    }


    public Optional<User> findUserByEmail(String email) {
        return runInTransaction(
                ds -> ds.users().findByEmail(email)
        );
    }


    public List<User> listUsers() {
        return runInTransaction(
                ds -> ds.users().list()
        );
    }


    private <E> E runInTransaction(Function<MySystemRepository, E> closure) {
        final EntityManager entityManager = factory.createEntityManager();
        final MySystemRepository ds = MySystemRepository.create(entityManager);

        try {
            entityManager.getTransaction().begin();
            final E result = closure.apply(ds);
            entityManager.getTransaction().commit();
            return result;
        } catch (Throwable e) {
            e.printStackTrace();
            entityManager.getTransaction().rollback();
            throw e;
        } finally {
            entityManager.close();
        }
    }

    public boolean validPassword(String password, User foundUser) {
        // Super dummy implementation. Zero security
        return foundUser.getPassword().equals(password);
    }
}
