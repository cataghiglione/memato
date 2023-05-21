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

    public Optional<Match> createMatch(CreateMatchForm creationValues, Optional<Search> search1, Optional<Search> search2) {
        if(!(search1.isPresent() && search2.isPresent())) return Optional.empty();
        if (findMatchBySearchId(creationValues.getSearch1(), creationValues.getSearch2()).isPresent())
            return Optional.empty();
        final Match newMatch = Match.create(search1.get(), search2.get());
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
    public List<Match> findMatchesByTeamId(Long teamId){
        List<Match> pre_matches= entityManager.createQuery("SELECT m FROM Match m WHERE (m.search1.team.id =:teamId OR m.search2.team.id =:teamId)", Match.class)
                .setParameter("teamId",teamId)
                .getResultList();
        return filterMatchesByPossibility(pre_matches);
    }

    public Optional<Match> findMatch(String matchId, String searchId) {
        return entityManager
                .createQuery("SELECT m FROM Match m WHERE ((cast (m.id as string) LIKE :matchId and ((cast (m.search1.id as string) LIKE :searchId) OR (cast (m.search2.id as string) LIKE :searchId))))", Match.class)
                .setParameter("matchId", matchId)
                .setParameter("searchId", searchId)
                .getResultList()
                .stream()
                .findFirst();
    }
    private boolean teamOneOrTeam2(Long matchId, Long teamId){
        List<Match> matches =entityManager.createQuery("select m from Match m where m.id =: matchId",Match.class)
                .setParameter("matchId",matchId)
                .getResultList();
        if (!matches.isEmpty()){
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
    public boolean confirmMatchByTeam(Long matchId, Long teamId){
        int updated_count = 0;
        if (teamOneOrTeam2(matchId,teamId)){
             updated_count = entityManager.createQuery("UPDATE Match set confirmed_by_1 =true, search1.isSearching =false WHERE id = :matchId")
                    .setParameter("matchId",matchId)
                    .executeUpdate();

        }
        else {
             updated_count = entityManager.createQuery("UPDATE Match set confirmed_by_2 =true, search2.isSearching =false WHERE id = :matchId")
                    .setParameter("matchId",matchId)
                    .executeUpdate();
        }
        return updated_count>1;

    }

    private List<Match> filterMatchesByPossibility(List<Match> pre_matches){
        List<Match> final_matches_list = new ArrayList<>();
        for (Match pre_match : pre_matches) {
            if (pre_match.isPossible()) {
                final_matches_list.add(pre_match);
            }
        }
        return final_matches_list;
    }


}