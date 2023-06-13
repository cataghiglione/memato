package model;

import javax.persistence.*;

@Entity
public class Contact {
    // Teams are the ones that contact each other, not users
//    private long id1;
//    private long id2;
    @Id
    @GeneratedValue(generator = "ContactGen", strategy = GenerationType.SEQUENCE)
    private long id;

    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "TEAM1_ID", referencedColumnName = "id")
    private Team team1;

    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "TEAM2_ID", referencedColumnName = "id")
    private Team team2;

    public static Contact create(Team team1, Team team2){
        return new Contact(team1, team2);
    }

    public Contact(){}
    private Contact(Team team1, Team team2){
        this.team1=team1;
        this.team2=team2;

    }
    public Team getTeam1() {
        return team1;
    }

    public Team getTeam2() {
        return team2;
    }

    public long getId() {
        return id;
    }


}
