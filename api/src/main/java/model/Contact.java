package model;

import javax.persistence.*;

@Entity
public class Contact {
    // Teams are the ones that contact each other, not users
    private long id1;
    private long id2;
    @Id
    @GeneratedValue(generator = "ContactGen", strategy = GenerationType.SEQUENCE)
    private long id;

    @JoinColumn(name = "TEAM1_ID", referencedColumnName = "id")
    private long team1;

    @JoinColumn(name = "TEAM2_ID", referencedColumnName = "id")
    private long team2;

    public static Contact create(long team1, long team2){
        return new Contact(team1, team2);
    }

    public Contact(){}
    private Contact(long team1, long team2){
        this.team1=team1;
        this.team2=team2;

    }
    public long getID1() {
        return team1;
    }

    public long getID2() {
        return team2;
    }

    public long getId() {
        return id;
    }


}
