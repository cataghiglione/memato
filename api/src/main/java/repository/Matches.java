package repository;

import model.*;

import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class Matches {
    private final EntityManager entityManager;

    public Matches(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public Optional<Match> getMatchById(Long id) {
        return entityManager.createQuery("SELECT m FROM Match m WHERE m.id =:id", Match.class)
                .setParameter("id", id)
                .getResultList()
                .stream()
                .findFirst();
    }

    public Optional<Match> createMatch(Search search1, Search search2) {
        if (findMatchBySearchId(Long.toString(search1.getId()), Long.toString(search2.getId())).isPresent())
            return Optional.empty();
        final Match newMatch = Match.create(search1, search2);
        entityManager.persist(newMatch);
        return Optional.of(newMatch);
    }

    /**
     * It finds the match between the teams in that date
     *
     * @param search1
     * @param search2
     * @return
     */
    private Optional<Match> findMatchBySearchId(String search1, String search2) {
        return entityManager
                .createQuery("SELECT m FROM Match m WHERE (((cast(m.search1.id as string) LIKE :id1) AND (cast(m.search2.id as string) LIKE :id2)) " +
                        "OR ((cast(m.search2.id as string) LIKE :id1) AND (cast(m.search1.id as string) LIKE :id2)))", Match.class)
                .setParameter("id1", search1)
                .setParameter("id2", search2)
                .getResultList()
                .stream()
                .findFirst();
    }

    public List<Match> findMatchesByTeamId(Long teamId) {
        List<Match> pre_matches = entityManager.createQuery("SELECT m FROM Match m WHERE (m.search1.team.id =:teamId OR m.search2.team.id =:teamId)", Match.class)
                .setParameter("teamId", teamId)
                .getResultList();
        return filterMatchesByPossibility(pre_matches);
    }

    public Optional<Match> findMatch(long matchId) {
        return entityManager
                .createQuery("SELECT m FROM Match m WHERE (cast (m.id as string) LIKE :matchId)", Match.class)
                .setParameter("matchId", Long.toString(matchId))
                .getResultList()
                .stream()
                .findFirst();
    }

    public boolean teamOneOrTeam2(Long matchId, Long teamId) {
        List<Match> matches = entityManager.createQuery("select m from Match m where m.id =: matchId", Match.class)
                .setParameter("matchId", matchId)
                .getResultList();
        if (!matches.isEmpty()) {
            return matches.get(0).getTeam1().getId() == teamId;
        }
        throw new RuntimeException();
    }

    //    public void confirmByTeam(String matchId, String searchId, Match match){
//        try {
//            if(Long.toString(match.getTeam1().getId()).equals(searchId)){
//                entityManager.createQuery("UPDATE Match m set m.confirmed_by_1 = true where (cast (m.id as string)) =:matchId")
//                        .setParameter("matchId", matchId)
//                        .executeUpdate();
//            }
//            else{
//                entityManager.createQuery("UPDATE Match m set m.confirmed_by_2 = true where (cast (m.id as string)) =:matchId")
//                        .setParameter("matchId", matchId)
//                        .executeUpdate();
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//    }

    public boolean confirmMatchByTeam(Long matchId, Long teamId) {
        int updatedCount = 0;
        Long searchId;
        boolean foundSearch = findSearchId(matchId, teamId).isPresent();
        if (foundSearch) {
            searchId = findSearchId(matchId, teamId).get();
            if (teamOneOrTeam2(matchId, teamId)) {
                updatedCount = entityManager.createQuery("UPDATE Match SET confirmed_by_1 = true WHERE id = :matchId")
                        .setParameter("matchId", matchId)
                        .executeUpdate();
            } else {
                updatedCount = entityManager.createQuery("UPDATE Match SET confirmed_by_2 = true WHERE id = :matchId")
                        .setParameter("matchId", matchId)
                        .executeUpdate();

            }
            updatedCount += entityManager.createQuery("UPDATE Search SET isSearching = false WHERE id = :searchId")
                    .setParameter("searchId", searchId)
                    .executeUpdate();

        }
        return updatedCount > 1;


    }
    public boolean declineMatchByTeam(Long matchId, Long teamId){
        int updatedCount = 0;
        if (teamOneOrTeam2(matchId,teamId)){
            updatedCount = entityManager.createQuery("UPDATE Match set declined_by_1 = false WHERE id = :matchId")
                    .setParameter("matchId",matchId)
                    .executeUpdate();
        }
        else {
            updatedCount = entityManager.createQuery("UPDATE Match set declined_by_2 = false WHERE id = :matchId")
                    .setParameter("matchId",matchId)
                    .executeUpdate();
        }
        return updatedCount>0;
    }


    private List<Match> filterMatchesByPossibility(List<Match> pre_matches) {
        //        List<Match> possibleMatches = new ArrayList<>();
//        for (Match pre_match : pre_matches) {
//            if (pre_match.isPossible()) {
//                possibleMatches.add(pre_match);
//            }
//        }
//
        return pre_matches.stream().filter(Match::isPossible).toList();
    }

    private Optional<Long> findSearchId(Long matchId, Long teamId) {
        Optional<Search> search;
        if (teamOneOrTeam2(matchId, teamId)) {
            search = entityManager.createQuery("SELECT m.search1 FROM Match m WHERE m.id =: matchId")
                    .setParameter("matchId", matchId)
                    .getResultList()
                    .stream()
                    .findFirst();
        } else {
            search = entityManager.createQuery("SELECT m.search2 FROM Match m WHERE m.id =: matchId")
                    .setParameter("matchId", matchId)
                    .getResultList()
                    .stream()
                    .findFirst();

        }
        if (search.isPresent()) {
            Long searchId = search.get().getId();
            return Optional.of(searchId);
        } else return Optional.empty();
    }

    public List<Match> confirmedMatches(Long teamId){
        List<Match> totalConfirmedMatches = entityManager.createQuery("SELECT m FROM Match m WHERE m.confirmed_by_1 = true AND m.confirmed_by_2 = true",Match.class)
                .getResultList();
        List<Match> confirmedMatchesByTeam = new ArrayList<>();
        for (Match totalConfirmedMatch : totalConfirmedMatches) {
            if (totalConfirmedMatch.getTeam1().getId() == teamId || totalConfirmedMatch.getTeam2().getId() == teamId) {
                confirmedMatchesByTeam.add(totalConfirmedMatch);
            }
        }
        return confirmedMatchesByTeam;


    }


}