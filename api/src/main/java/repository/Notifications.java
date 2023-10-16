package repository;

import model.*;

import javax.persistence.EntityManager;
import java.util.List;
import java.util.Optional;

public class Notifications {
    private final EntityManager entityManager;

    public Notifications(EntityManager entityManager) {
        this.entityManager = entityManager;
    }
    public Notification createNotification(User user, String message, int code_id) {
        final Notification newNotification = Notification.create(user, message, code_id);
        entityManager.persist(newNotification);
        return newNotification;
    }
    public Notification createNotificationWithTeamId(User user, String message, int code_id, long team_id, long other_team_id) {
        final Notification newNotification = Notification.createWithTeamIds(user, message, code_id, team_id, other_team_id);
        entityManager.persist(newNotification);
        return newNotification;
    }
    public Notification createNotificationWithSearchId(User user, String message, int code_id, long search_id, long team_id) {
        final Notification newNotification = Notification.createWithTeamSearchId(user, message, code_id, team_id, search_id);
        entityManager.persist(newNotification);
        return newNotification;
    }
    public List<Notification> list(long user_id) {
        return entityManager.createQuery("SELECT n FROM Notification n WHERE cast(n.user.id as string) LIKE :id", Notification.class)
                .setParameter("id", Long.toString(user_id))
                .getResultList();
    }
    public List<Notification> listPending(long user_id) {
        return entityManager.createQuery("SELECT n FROM Notification n WHERE cast(n.user.id as string) LIKE :id AND n.opened = false", Notification.class)
                .setParameter("id", Long.toString(user_id))
                .getResultList();
    }
    public boolean checkUserNotification(String user_id, String notification_id) {
        Optional<Notification> notification = entityManager.createQuery("SELECT t FROM Notification t WHERE (cast(t.user.id as string) LIKE :user_id) AND (cast(t.id as string) LIKE :notification_id)", Notification.class)
                                                .setParameter("user_id", user_id)
                                                .setParameter("notification_id", notification_id)
                                                .getResultList()
                                                .stream()
                                                .findFirst();
        return notification.isPresent();
    }
    public Optional<Notification> changeStatusOpen(String id) {
        Optional<Notification> notification = entityManager.createQuery("SELECT n FROM Notification n WHERE cast(n.id as string) LIKE :notification_id", Notification.class)
                .setParameter("notification_id", id)
                .getResultList()
                .stream()
                .findFirst();
        notification.ifPresent(Notification::isOpen);
        return notification;
    }
}
