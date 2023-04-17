package repository;

import model.CreateTeamForm;
import model.Search;
import model.Team;
import model.User;
import java.util.Date;

import java.text.ParseException;
import java.time.LocalDate;


import javax.persistence.EntityManager;
import java.util.List;
import java.util.Optional;

public class Searches {
    private final EntityManager entityManager;

    public Searches(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public Search createSearch(Team team, Date date, String time, String latitude,String longitude) throws ParseException {
        Optional<Search> searchOptional = findSearchByTeam(Long.toString(team.getId()), time,date.getMonth(),date.getDate(), date.getYear() );
        if (searchOptional.isEmpty()) {
            final Search search = Search.create(team, date, time,latitude,longitude);

            entityManager.persist(search);
            return search;

        } else {
            reactivateSearch(team, time, date);
            return searchOptional.get();
        }
    }

    private Optional<Search> findSearchByTeam(String team_id, String time, int month, int day, int year) {
        return entityManager.createQuery("SELECT s FROM Search s WHERE (cast(s.team.id as string) LIKE :team_id AND s.time LIKE :time AND s.day = :day AND s.month = :month AND s.year = :year)", Search.class)
                .setParameter("team_id", team_id)
                .setParameter("month", month)
                .setParameter("year", year)
                .setParameter("day", day)
                .setParameter("time", time)
                .getResultList()
                .stream()
                .findFirst();
    }

    private void reactivateSearch(Team team, String time, Date date) {
        Optional<Search> search = findSearchByTeam(Long.toString(team.getId()), time, date.getMonth(),date.getDay(),date.getYear());
        search.ifPresent(Search::reactivateSearching);
    }
    public boolean exists(String id, String time, Date date){
        return findSearchByTeam(id,time,date.getMonth(),date.getDate(), date.getYear()).isPresent();
    }
    public List<Team> findCandidates(String id, String time, Date date, String sport, String quantity){
        return entityManager.createQuery("SELECT s.team FROM Search s WHERE (s.time like :time AND s.month =: month AND s.day =: day AND s.year=: year AND cast(s.team.user.id as string) not LIKE :id AND s.team.sport LIKE :sport AND s.team.quantity LIKE :quantity)", Team.class)
                .setParameter("time",time)
                .setParameter("month", date.getMonth())
                .setParameter("day",date.getDate())
                .setParameter("year",date.getYear())
                .setParameter("sport",sport )
                .setParameter("id",id)
                .setParameter("quantity",quantity)
                .getResultList();

    }


}
