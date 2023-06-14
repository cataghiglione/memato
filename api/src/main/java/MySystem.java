import model.*;
import repository.*;
import model.Team;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import java.text.ParseException;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;
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

    public Optional<Match> createMatch(Search search1, Search search2) {
        return runInTransaction(datasource -> {
            final Matches matches = datasource.matches();
            return matches.createMatch(search1, search2);
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
    public Notification createNotificationWithSearch(Search search2, String message, int code_id) {
        return runInTransaction(datasource -> {
            final Notifications notifications = datasource.notifications();
            long user_id = search2.getTeam().getUserId();
            final Users users = datasource.users();
            AtomicReference<Notification> notification = new AtomicReference<>();
            users.findById(user_id).ifPresentOrElse(
                    (user) -> {
                         notification.set(notifications.createNotification(users.findById(user_id).get(), message, code_id));
                    },
                    () -> {
                        notification.set(new Notification());
                    }
            );
            return notification.get();
        });
    }
    public Notification createNotificationWithTeam(Team team, String message, int code_id) {
        return runInTransaction(datasource -> {
            final Notifications notifications = datasource.notifications();
            long user_id = team.getUserId();
            final Users users = datasource.users();
            AtomicReference<Notification> notification = new AtomicReference<>();
            users.findById(user_id).ifPresentOrElse(
                    (user) -> {
                        notification.set(notifications.createNotification(users.findById(user_id).get(), message, code_id));
                    },
                    () -> {
                        notification.set(new Notification());
                    }
            );
            return notification.get();
        });
    }
    public Optional<Notification> updateNotification(String id){
        return runInTransaction(datasource -> {
            final Notifications notifications = datasource.notifications();
            return notifications.changeStatusOpen(id);
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
    public boolean declineMatch(Long matchid, Long teamid){
        return runInTransaction(datasource ->{
            final Matches matches = datasource.matches();
            try{
                return matches.declineMatchByTeam(matchid,teamid);
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
    public List<Notification> listNotifications(User user) {
        return runInTransaction(
                ds -> ds.notifications().list(user.getId())
        );
    }
    public List<Notification> listPendingNotifications(User user) {
        return runInTransaction(
                ds -> ds.notifications().listPending(user.getId())
        );
    }



    public boolean validPassword(String password, User foundUser) {
        // Super dummy implementation. Zero security
        return foundUser.getPassword().equals(password);
    }

    public Optional<Contact> findOrCreateContact(Team team1, Team team2) {
        return runInTransaction(datasource -> {
            final Contacts contacts = datasource.contacts();
            return contacts.exists(team1.getId(), team2.getId()) ? contacts.findContactByTeamsId(team1.getId(), team2.getId()) : contacts.createContact(team1, team2) ;
        });
    }

//    public Message sendMessage(CreateMessageForm form) {
//        return runInTransaction(datasource -> {
//            final Messages messages = datasource.messages();
//            return messages.createMessage(Long.parseLong(form.getTeam1_id()), Long.parseLong(form.getTeam2_id()), form.getDate(), form.getText());
//        });
//    }

    public List<Message> getMessages(long contactId) {
        return runInTransaction(datasource -> {
            final Messages messages = datasource.messages();
            return messages.getMessagesByContact(contactId);
        });
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

}
