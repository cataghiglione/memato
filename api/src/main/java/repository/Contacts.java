package repository;

import model.Contact;
import model.CreateContactForm;
import model.Match;
import model.Team;

import javax.persistence.EntityManager;
import java.util.List;
import java.util.Optional;

public class Contacts {
    private final EntityManager entityManager;

    public Contacts(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    // Todavía no se si team_id lo debo poner como int o como string, para mi es long
    public boolean exists(long team1_id, long team2_id){
        return findContactByTeamsId(team1_id, team2_id).isPresent();
    }

    // actually it should be getContactByIds (but it exists in findContactByTeamsId) so I dunno why I did this method.
    public Optional<Contact> getContactByTeamId(Long id) {
        return entityManager.createQuery("SELECT c FROM Contact c WHERE c.team1 =:id OR c.team2 =:id", Contact.class)
                .setParameter("id", id)
                .getResultList()
                .stream()
                .findFirst();
    }
    public Optional<Contact> getContactByContactId(Long id) {
        return entityManager.createQuery("SELECT c FROM Contact c WHERE c.id =: id", Contact.class)
                .setParameter("id", id)
                .getResultList()
                .stream()
                .findFirst();
    }
    public Optional<Contact> createContact(Team team1, Team team2){
        if (findContactByTeamsId(team1.getId(), team2.getId()).isPresent())
            return Optional.empty();
        final Contact newContact = Contact.create(team1, team2);
//        final Contact newContactSideways = Contact.create(team2, team1);
        // We create 2 contacts for every contact, don't remember now why, but it made total sense back then
        entityManager.persist(newContact);
//        entityManager.persist(newContactSideways);
        return Optional.of(newContact);
    }
    public Optional<Contact> findContactByTeamsId(long team1, long team2){
        return entityManager
                .createQuery("SELECT c FROM Contact c WHERE (((cast(c.team1.id as string) LIKE :id1) AND (cast(c.team2.id as string) LIKE :id2)) " +
                        "OR ((cast(c.team2.id as string) LIKE :id1) AND (cast(c.team1.id as string) LIKE :id2)))", Contact.class)
                .setParameter("id1", Long.toString(team1))
                .setParameter("id2", Long.toString(team2))
                .getResultList()
                .stream()
                .findFirst();
    }

    public List<Contact>  findContactsByTeamId(Long teamId) {
        // if one contact has two, then it will display 2 contacts every one, check how to solve that each is displayed only once
        List<Contact> contacts = entityManager.createQuery("SELECT c FROM Contact c WHERE (c.team1.id =:teamId) or (c.team2.id =:teamId)", Contact.class)
                .setParameter("teamId", teamId)
                .getResultList();
        return contacts;
    }


}
