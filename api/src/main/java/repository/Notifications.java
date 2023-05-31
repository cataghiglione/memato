package repository;

import model.Match;
import model.Notification;
import model.Search;
import model.User;

import javax.persistence.EntityManager;
import java.util.Optional;

public class Notifications {
    private final EntityManager entityManager;

    public Notifications(EntityManager entityManager) {
        this.entityManager = entityManager;
    }
    public Notification createNotification(User user, String message) {
        final Notification newNotification = Notification.create(user, message);
        entityManager.persist(newNotification);
        return newNotification;
    }
}
