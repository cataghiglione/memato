package model;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;


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

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "TIME_ID", referencedColumnName = "id")
    private TimeInterval time;

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
    @Column
    private int averageAge;


    public Search() {
    }

    private Search(Team team, Date date, List<String> time,String latitude, String longitude, int age) {
        this.team=team;
        this.isSearching=true;
        this.month=date.getMonth();
        this.day=date.getDate();
        this.year=date.getYear();
        this.time=new TimeInterval(time);
        this.latitude=latitude;
        this.longitude=longitude;
        this.date=date;
        this.averageAge=age;


    }
    public static Search create(Team team, Date date, List<String> time,String latitude,String longitude,int age){
        return new Search(team, date,time,latitude,longitude,age);
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

    public TimeInterval getTime() {
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

    public int getAverageAge() {
        return averageAge;
    }
}
