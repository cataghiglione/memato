package repository;

import model.Contact;
import model.Message;
import model.Team;

import javax.persistence.EntityManager;
import java.util.Date;
import java.util.List;

public class Messages {
    private final EntityManager entityManager;

    public Messages(EntityManager entityManager) {
        this.entityManager = entityManager;
    }
    // get messages by contact, cuando yo toco en el contact agarra el contact en el que team1 soy yo (pq hay 2 cont por cada cont)
    // Entonces lista todos y los de team 1 como sender los mete a la derecha en la ui y team 2 a la izquierda

    public List<Message> getMessagesByContact(Long contactId) {
        return entityManager.createQuery("SELECT m FROM Message m WHERE (m.contact.id = :contactId)", Message.class)
                .setParameter("contactId", contactId)
                .getResultList();
    }

    // esto debería conectar con websocket, cuando web socket tira un msj también lo almacena acá
    public void createMessage(Contact contact, Team team, Date date, String text){ // de nuevo, team 1 soy yo
        final Message newMessage = Message.create(contact, team, date, text);
        // We create 2 contacts for every contact, don't remember now why, but it made total sense back then
        entityManager.persist(newMessage);
    }

}
