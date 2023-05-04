package repository;

import model.CreateTeamForm;
import model.User;
import model.Team;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.util.List;
import java.util.Optional;

public class Teams {
    private final EntityManager entityManager;

    public Teams(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public Team createTeam(CreateTeamForm creationValues, User user) {
        if (findTeamByName(creationValues.getName(), user).isPresent())
            throw new IllegalStateException("A team with that name already exists");
        final Team newTeam = Team.create(creationValues.getName(), creationValues.getSport(), creationValues.getQuantity(), 0, creationValues.getAgeGroup(), user);
        entityManager.persist(newTeam);
        return newTeam;
    }

    public boolean exists(String name, User user) {
        return findTeamByName(name, user).isPresent();
    }

    public List<Team> listAll() {
        return entityManager.createQuery("SELECT u FROM Team u", Team.class).getResultList();
    }

    public List<Team> findTeamsByUserId(String user_id) {
        return entityManager
                .createQuery("SELECT t FROM Team t WHERE cast(t.user.id as string )  LIKE :user_id", Team.class)
                .setParameter("user_id", user_id).getResultList();
    }

    public Optional<Team> findTeamsById(String id) {
        return entityManager
                .createQuery("SELECT t FROM Team t WHERE cast(t.id as string) LIKE :id", Team.class)
                .setParameter("id", id)
                .getResultList()
                .stream()
                .findFirst();
    }

    public Team persist(Team team) {
        entityManager.persist(team);
        return team;
    }

    public List<Team> findRival(String sport, String group, String quantity) {
        return entityManager
                .createQuery("SELECT t FROM Team t WHERE (t.sport LIKE :sport AND t.age_group LIKE :group AND t.quantity LIKE :quantity)", Team.class)
                .setParameter("sport", sport)
                .setParameter("group", group)
                .setParameter("quantity", quantity)
                .getResultList();
    }

    private Optional<Team> findTeamByName(String name, User user) {
        Optional<Team> team = entityManager
                .createQuery("SELECT t FROM Team t WHERE (t.name LIKE :name)", Team.class)
                .setParameter("name", name)
                .getResultList()
                .stream()
                .findFirst();
        if (team.isPresent())
            return team.get().getUserId() == user.getId() ? team : Optional.empty();
        return team;
    }

    public void updateTeam(String t_name, String t_sport, String t_quantity, String t_age,  Long t_id) {
        try {
            entityManager.createQuery("UPDATE Team set name =:t_name, sport=:t_sport, quantity =:t_quantity, age_group =:t_age where id =:t_id")
                    .setParameter("t_name", t_name)
                    .setParameter("t_sport", t_sport)
                    .setParameter("t_quantity", t_quantity)
                    .setParameter("t_age", t_age)
//                    .setParameter("t_zone", t_zone)
                    .setParameter("t_id", t_id)
                    .executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    public void deleteTeam(Long t_id) {
        entityManager.createQuery("DELETE FROM Team WHERE id =:t_id")
                .setParameter("t_id", t_id)
                .executeUpdate();
    }

    public void deleteAllTeams(Long user_id) {
        entityManager.createQuery("DELETE FROM Team WHERE user.id = :user_id")
                .setParameter("user_id", user_id)
                .executeUpdate();
    }

    public int getNumberOfTeamsForUser(Long userId) {
        Query query = entityManager.createQuery("SELECT COUNT(t) FROM Team t WHERE t.user.id = :userId");
        query.setParameter("userId", userId);
        int result = ((Number) query.getSingleResult()).intValue();
        entityManager.close();
        return result;
    }
    public Optional<Team> getTeamByTeamId(Long teamId){
        return entityManager.createQuery("SELECT t FROM Team T WHERE t.id = :teamId")
                .setParameter("teamId",teamId)
                .getResultList().stream()
                .findFirst();
    }

}
