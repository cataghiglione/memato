package repository;

import model.Contact;
import model.Message;

import javax.persistence.EntityManager;
import java.util.Date;
import java.util.Optional;

public class Messages {
    private final EntityManager entityManager;

    public Messages(EntityManager entityManager) {
        this.entityManager = entityManager;
    }
    // get messages by contact, cuando yo toco en el contact agarra el contact en el que team1 soy yo (pq hay 2 cont por cada cont)
    // Entonces lista todos y los de team 1 como sender los mete a la derecha en la ui y team 2 a la izquierda

    public Optional<Message> getMessagesByContact(Long team1, Long team2) {
        return entityManager.createQuery("SELECT m FROM Message m WHERE (m.team1 = :team1 OR m.team1 = :team2) AND (m.team2 = :team1 OR m.team2 = :team2)", Message.class)
                .setParameter("team1", team1)
                .setParameter("team2", team2)
                .getResultList()
                .stream()
                .findAny(); // find any tirará todos?
    }

    // esto debería conectar con websocket, cuando web socket tira un msj también lo almacena acá
    public Message createMessage(long team1, long team2, Date date, String text){ // de nuevo, team 1 soy yo
        final Message newMessage = Message.create(team1, team2, date, text);
        // We create 2 contacts for every contact, don't remember now why, but it made total sense back then
        entityManager.persist(newMessage);
        return newMessage;
    }

}
