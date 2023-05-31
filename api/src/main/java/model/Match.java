package model;

import javax.persistence.*;
import java.util.Date;


@Entity
public class Match {
    @Id
    @GeneratedValue(generator = "MatchGen", strategy = GenerationType.SEQUENCE)
    private long id;

//    @Column
//    private String latitude;
//
//    @Column
//    private String longitude;


    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "SEARCH1_ID", referencedColumnName = "id")
    private Search search1;

    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "SEARCH2_ID", referencedColumnName = "id")
    private Search search2;

    @Column
    private boolean confirmed_by_1;
    @Column
    private boolean confirmed_by_2;

    @Column
    private boolean declined_by_1;
    @Column
    private boolean declined_by_2;

    public static Match create(Search search1, Search search2){
        return new Match(search1, search2);
    }
    public Match(){}
    private Match(Search search1, Search search2){
        this.search1=search1;
        this.search2=search2;
        this.confirmed_by_2 = false;
        this.confirmed_by_1 = false;
        this.declined_by_1 = true;
        this.declined_by_2 = true;

    }
//    public Match assignTeam2(Team team2){
//        setTeam2(team2);
//        return this;
//    }
//    private void setTeam2(Team team2){
//        this.team2=team2;
//    }

    public int getMonth() {
        return search1.getMonth();
    }

    public int getDay() {
        return search1.getDay();
    }

    public int getYear() {
        return search1.getYear();
    }

    public String getTime() {
        return search1.getTime();
    }

    public Team getTeam1() {
        return search1.getTeam();
    }

    public Team getTeam2() {
        return search2.getTeam();
    }

    public boolean isConfirmed_by_1() {
        return confirmed_by_1;
    }

    public boolean isConfirmed_by_2() {
        return confirmed_by_2;
    }

    public boolean isConfirmed() {
        return confirmed_by_1 && confirmed_by_2;
    }

    public Long getId(){
        return id;
    }

    public boolean isPossible(){
        return ((search1.searching() && search2.searching()) || (confirmed_by_1 && search2.searching()) || (confirmed_by_2 && search1.searching())) && declined_by_1 && declined_by_2;
    }
}
