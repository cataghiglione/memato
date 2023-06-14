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

    /**
     * code_id:
     * <li>0 --> new pending confirmation match</li>
     * <li>1 --> reminder to confirm a match</li>
     * <li>2 --> new message alert</li>
     * <li>3 --> pending match coming soon</li>
     */
    @Column
    private int code_id;
    @Column
    private long team_id;

    @Column
    private boolean opened;

    private Notification(User user, String message, int code_id){
        this.user = user;
        this.message = message;
        this.opened = false;
        this.code_id = code_id;
        this.team_id = 0;
    }
    private Notification(User user, String message, int code_id, long team_id){
        this.user = user;
        this.message = message;
        this.opened = false;
        this.code_id = code_id;
        this.team_id = team_id;
    }

    public Notification() {
    }
    public static Notification create(User user, String message, int code_id){
        return new Notification(user, message, code_id);
    }
    public static Notification createWithTeamId(User user, String message, int code_id, long team_id){
        return new Notification(user, message, code_id, team_id);
    }

    public Long getId() {
        return id;
    }

    public String getMessage() {
        return message;
    }

    public int getCode_id() {
        return code_id;
    }

    public boolean isOpened() {
        return opened;
    }

    public void isOpen() {
        this.opened = true;
    }

    public long getTeam_id() {
        return team_id;
    }
}
