package repository;

import model.Search;
import model.Team;

import java.util.ArrayList;
import java.util.Date;

import java.text.ParseException;


import javax.persistence.EntityManager;
import java.util.List;
import java.util.Optional;

public class Searches {
    private final EntityManager entityManager;

    public Searches(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public Search createSearch(Team team, Date date, String time, String latitude,String longitude) throws ParseException {
        Optional<Search> searchOptional = findSearchByTeam(Long.toString(team.getId()), time,date.getMonth(),date.getDate(), date.getYear(),latitude,longitude );
        if (searchOptional.isEmpty()) {
            final Search search = Search.create(team, date, time,latitude,longitude);

            entityManager.persist(search);
            return search;

        } else {
            reactivateSearch(team, time, date,latitude,longitude);
            return searchOptional.get();
        }
    }

    private Optional<Search> findSearchByTeam(String team_id, String time, int month, int day, int year,String latitude, String longitude) {
        return entityManager.createQuery("SELECT s FROM Search s WHERE (cast(s.team.id as string) LIKE :team_id AND s.time LIKE :time AND s.day = :day AND s.month = :month AND s.year = :year AND s.latitude LIKE :latitude AND s.longitude LIKE :longitude)", Search.class)
                .setParameter("team_id", team_id)
                .setParameter("month", month)
                .setParameter("year", year)
                .setParameter("day", day)
                .setParameter("time", time)
                .setParameter("latitude",latitude)
                .setParameter("longitude",longitude)
                .getResultList()
                .stream()
                .findFirst();
    }
    public List<Search> findActiveSearchesByUserId(Long user_id){
        return entityManager.createQuery("SELECT s FROM Search s WHERE(s.team.user.id =:user_id AND s.isSearching  =true)",Search.class)
                .setParameter("user_id",user_id)
                .getResultList();
    }
    public boolean deactivateSearchBySearchId(Long search_id){
        List<Search> searches = entityManager.createQuery("SELECT s FROM Search s WHERE s.id =:search_id",Search.class)
                .setParameter("search_id",search_id)
                .getResultList();
        if (!searches.isEmpty()){
            Search search = searches.get(0);
            search.cancelSearching();
            return true;
        }
        else return false;
    }

    public Optional<Search> reactivateSearch(Team team, String time, Date date, String latitude, String longitude) {
        Optional<Search> search = findSearchByTeam(Long.toString(team.getId()), time, date.getMonth(),date.getDay(),date.getYear(), latitude,longitude);
        search.ifPresent(Search::reactivateSearching);
        return search;
    }
    public boolean exists(String id, String time, Date date,String latitude, String longitude){
        return findSearchByTeam(id,time,date.getMonth(),date.getDate(), date.getYear(),latitude,longitude).isPresent();
    }
    private static boolean isInA5KmRadius(double lat1, double lon1, double lat2, double lon2) {
        //Haversine formula
        final int earthRadius = 6371; //

        double distLat = Math.toRadians(lat2 - lat1);
        double distLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(distLat/2) * Math.sin(distLat/2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(distLon/2) * Math.sin(distLon/2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        double distance = earthRadius * c;

        return distance <= 5;
    }


    public List<Team> findCandidates(String id, String time, Date date, String sport, String quantity, String latitude, String longitude){
        List<Search> possibleCandidates = entityManager.createQuery("SELECT s FROM Search s WHERE (s.time like :time AND s.month =: month AND s.day =: day AND s.year=: year AND cast(s.team.user.id as string) not LIKE :id AND s.team.sport LIKE :sport AND s.team.quantity LIKE :quantity)", Search.class)
                .setParameter("time",time)
                .setParameter("month", date.getMonth())
                .setParameter("day",date.getDate())
                .setParameter("year",date.getYear())
                .setParameter("sport",sport )
                .setParameter("id",id)
                .setParameter("quantity",quantity)
                .getResultList();
        List<Team> candidates=new ArrayList<>(possibleCandidates.size());
        for (Search possibleCandidate : possibleCandidates) {
            if (isInA5KmRadius(Double.parseDouble(latitude), Double.parseDouble(longitude), Double.parseDouble(possibleCandidate.getLatitude()), Double.parseDouble(possibleCandidate.getLongitude()))) {
                candidates.add(possibleCandidate.getTeam());
            }

        }
        return candidates;

    }

    public Optional<Search> getSearchById(Long searchId){
        return entityManager.createQuery("SELECT S FROM Search S WHERE S.id = :searchId")
                .setParameter("searchId", searchId)
                .getResultList().stream()
                .findFirst();
    }

    public Search persist(Search search) {
        entityManager.persist(search);
        return search;
    }

    public List<Search> listAll() {
        return entityManager.createQuery("SELECT u FROM Search u", Search.class).getResultList();
    }

}
