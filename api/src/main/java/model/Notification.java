package model;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

@Entity
public class Notification {
    @Id
    @GeneratedValue(generator = "increment")
    @GenericGenerator(name = "increment", strategy = "increment")
    private Long id;

    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "USER_ID", referencedColumnName = "id")
    private User user;

    @Column
    private String message;

    @Column
    private boolean opened;

    private Notification(User user, String message) {
        this.user = user;
        this.message = message;
        this.opened = false;
    }

    public Notification() {
    }
    public static Notification create(User user, String message){
        return new Notification(user, message);
    }
}
