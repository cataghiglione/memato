package model;

import javax.persistence.*;
import java.util.Date;



@Entity
public class Match {
    @Id
    @GeneratedValue(generator = "MatchGen", strategy = GenerationType.SEQUENCE)
    private long id;

    @Column
    private Date date;

    @Column
    private String time;

    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "TEAM1_ID", referencedColumnName = "id")
    private Team team1;

    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "TEAM2_ID", referencedColumnName = "id")
    private Team team2;

    public Match create(Date date, String time, Team team1){
        return new Match(date,time,team1);
    }
    public Match(){}
    private Match(Date date, String time, Team team1){
        this.date=date;
        this.team1=team1;
        this.time=time;
    }
    public Match assignTeam2(Team team2){
        setTeam2(team2);
        return this;
    }
    private void setTeam2(Team team2){
        this.team2=team2;
    }

}
