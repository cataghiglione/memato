package repository;

import model.CreateTeamForm;
import model.User;
import model.Team;

import javax.persistence.EntityManager;
import java.util.List;
import java.util.Optional;

public class Teams {
    private final EntityManager entityManager;

    public Teams(EntityManager entityManager) {
        this.entityManager = entityManager;
    }
    public Optional<Team> findTeamByName(String name) {
        return entityManager
                .createQuery("SELECT t FROM Team t WHERE t.name LIKE :name", Team.class)
                .setParameter("name", name)
                .getResultList()
                .stream()
                .findFirst();
    }
    public Team createTeam(CreateTeamForm creationValues){
        final Team newTeam = Team.create(creationValues.getName(),creationValues.getSport(),creationValues.getQuantity(),0, creationValues.getGroup());
        if (findTeamByName(creationValues.getName()).isPresent()) throw new IllegalStateException("A team with that name already exists");
        entityManager.persist(newTeam);
        return newTeam;
    }
    public boolean exists(String name){
        return findTeamByName(name).isPresent();
    }

    public List<Team> listAll() {
        return entityManager.createQuery("SELECT u FROM Team u", Team.class).getResultList();
    }
}
