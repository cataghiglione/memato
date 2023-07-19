package model;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Objects;

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
     * <li>4 --> a team has decline a match</li>
     * <li>5 --> new team search</li>
     */
    @Column
    private int code_id;
    @Column
    private long team_id;

    @Column
    private boolean opened;
    @Column
    private long search_id;
    @Column
    private long other_team_id;


    private Notification(User user, String message, int code_id){
        this.user = user;
        this.message = message;
        this.opened = false;
        this.code_id = code_id;
        this.team_id = 0;
        this.search_id = 0;
    }
    private Notification(User user, String message, int code_id, long team_id){
        this.user = user;
        this.message = message;
        this.opened = false;
        this.code_id = code_id;
        this.team_id = team_id;
        this.search_id = 0;
    }

    public long getSearch_id() {
        return search_id;
    }

    private Notification(User user, String message, int code_id, long team_id, long search_id, String type){
        this.user = user;
        this.message = message;
        this.opened = false;
        this.code_id = code_id;
        this.team_id = team_id;
        if(Objects.equals(type, "Search")){
            this.search_id = search_id;
            this.other_team_id = 0;
        }
        if(Objects.equals(type, "Team")){
            this.other_team_id = search_id;
            this.search_id = 0;
        }
    }

    public Notification() {
    }
    public static Notification create(User user, String message, int code_id){
        return new Notification(user, message, code_id);
    }
    public static Notification createWithTeamIds(User user, String message, int code_id, long team_id, long other_team_id){
        return new Notification(user, message, code_id, team_id, other_team_id, "Team");
    }
    public static Notification createWithTeamSearchId(User user, String message, int code_id, long team_id, long search_id){
        return new Notification(user, message, code_id, team_id, search_id, "Search");
    }

    public long getOther_team_id() {
        return other_team_id;
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
