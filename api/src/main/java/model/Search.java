package model;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;


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
    private int month;

    @Column
    private int day;

    @Column
    private int year;

    public Search() {
    }

    private Search(Team team, Date date, String time) {
        this.team=team;
        this.isSearching=true;
        this.month=date.getMonth();
        this.day=date.getDate();
        this.year=date.getYear();
        this.time=time;


    }
    public static Search create(Team team, Date date, String time){
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
