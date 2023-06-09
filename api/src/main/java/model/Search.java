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

    @Column
    private String latitude;

    @Column
    private String longitude;
    private Date date;


    public Search() {
    }

    private Search(Team team, Date date, String time,String latitude, String longitude) {
        this.team=team;
        this.isSearching=true;
        this.month=date.getMonth();
        this.day=date.getDate();
        this.year=date.getYear();
        this.time=time;
        this.latitude=latitude;
        this.longitude=longitude;
        this.date=date;


    }
    public static Search create(Team team, Date date, String time,String latitude,String longitude){
        return new Search(team, date,time,latitude,longitude);
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

    public String getLatitude() {
        return latitude;
    }

    public String getLongitude() {
        return longitude;
    }

    public Team getTeam() {
        return team;
    }

    public void isSearching() {
        isSearching = true;
    }

    public void isNotSearching(){
        isSearching = false;
    }

    public Date getDate() {
        return date;
    }

    public boolean searching(){
        return isSearching;
    }

    public String getTime() {
        return time;
    }

    public int getMonth() {
        return month;
    }

    public int getDay() {
        return day;
    }

    public int getYear() {
        return year;
    }

    public long getId() {
        return id;
    }
}
