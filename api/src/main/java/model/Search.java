package model;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;


@Entity
public class Search {
    @Id
    @GeneratedValue(generator = "increment")
    @GenericGenerator(name = "increment", strategy = "increment")
    private Long id;

    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "TEAM_ID", referencedColumnName = "id")
    private Team team;

    @Column
    private boolean isSearching;

    @Column
    private String time;

    @Column
    private Date date;

    public Search() {
    }

    private Search(Team team, Date date, String time) {
        this.team=team;
        this.isSearching=true;
        this.date=date;
        this.time=time;


    }
    public Search create(Team team, Date date, String time){
        return new Search(team, date,time);
    }
    private void setSearching(boolean value){
        this.isSearching=value;
    }
    public void cancelSearching(){
        setSearching(false);
    }
    public void reactivateSearching(){
        setSearching(true);
    }


}
