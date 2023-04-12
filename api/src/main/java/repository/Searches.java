package repository;

import model.CreateTeamForm;
import model.Search;
import model.Team;
import model.User;
import java.util.Date;


import javax.persistence.EntityManager;
import java.util.Optional;

public class Searches {
    private final EntityManager entityManager;

    public Searches(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public Search createSearch(Team team, Date date, String time) {
        Optional<Search> searchOptional = findSearchByTeam(Long.toString(team.getId()), time, date.toString());
        if (searchOptional.isEmpty()) {
            final Search search = createSearch(team,date,time);
            entityManager.persist(search);
            return search;

        } else {
            reactivateSearch(team, time, date.toString());
            return searchOptional.get();
        }
    }

    private Optional<Search> findSearchByTeam(String team_id, String time, String date) {
        return entityManager.createQuery("SELECT s FROM Search s WHERE (cast( s.team.id as string) LIKE :team_id AND s.time LIKE :time AND cast(s.date as string) LIKE :date)").setParameter("team_id", team_id).setParameter("date",date).setParameter("time",time).getResultList().stream().findFirst();

    }

    private void reactivateSearch(Team team, String time, String date) {
        Optional<Search> search = findSearchByTeam(Long.toString(team.getId()),time,date);
        search.ifPresent(Search::reactivateSearching);
    }

}
