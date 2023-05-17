package repository;

import model.*;

import javax.persistence.EntityManager;
import java.util.Optional;

public class Matches {
    private final EntityManager entityManager;

    public Matches(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public Optional<Match> createMatch(CreateMatchForm creationValues, Optional<Search> search1, Optional<Search> search2) {
        if(!(search1.isPresent() && search2.isPresent())) return Optional.empty();
        if (findMatchByTeamId(creationValues.getSearch1(), creationValues.getSearch2()).isPresent())
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
    private Optional<Match> findMatchByTeamId(String search1, String search2) {
        return entityManager
                .createQuery("SELECT m FROM Match m WHERE (((cast(m.search1.id as string) LIKE :id1) AND (cast(m.search2.id as string) LIKE :id2)) " +
                        "OR ((cast(m.search2.id as string) LIKE :id1) AND (cast(m.search1.id as string) LIKE :id2)))", Match.class)
                .setParameter("id1", search1)
                .setParameter("id2", search2)
                .getResultList()
                .stream()
                .findFirst();
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
    public void confirmByTeam(String matchId, String searchId, Match match){
        try {
            if(Long.toString(match.getTeam1().getId()).equals(searchId)){
                entityManager.createQuery("UPDATE Match m set m.confirmed_by_1 = true where (cast (m.id as string)) =:matchId")
                        .setParameter("matchId", matchId)
                        .executeUpdate();
            }
            else{
                entityManager.createQuery("UPDATE Match m set m.confirmed_by_2 = true where (cast (m.id as string)) =:matchId")
                        .setParameter("matchId", matchId)
                        .executeUpdate();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}