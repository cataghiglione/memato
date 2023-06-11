package model;

import javax.persistence.*;
import java.util.Date;

@Entity
public class Message {
    // Teams are the ones that contact each other, not users
    @Id
    @GeneratedValue(generator = "ContactGen", strategy = GenerationType.SEQUENCE)
    private long id;

    @JoinColumn(name = "TEAM1_ID", referencedColumnName = "id")
    private long team1; // Sender

    @JoinColumn(name = "TEAM2_ID", referencedColumnName = "id")
    private long team2; // Receiver

    @Column
    private int minute;

    @Column
    private int hour;

    @Column
    private int month;

    @Column
    private int day;

    @Column
    private int year;

    @Column
    private String text;

    public static Message create(long team1, long team2, Date date, String text){
        return new Message(team1, team2, date, text);
    }

    public Message(){}
    private Message(long team1, long team2, Date date, String text){
        this.team1=team1;
        this.team2=team2;
        this.month=date.getMonth();
        this.day=date.getDate();
        this.year=date.getYear();
        this.minute=date.getMinutes();
        this.hour=date.getHours();
        this.text = text;
    }
    public long getID1() {
        return team1;
    }

    public long getID2() {
        return team2;
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

    public String getText(){return text;}

    public long getId() {
        return id;
    }


}
