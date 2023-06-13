package model;

import javax.persistence.*;
import java.util.Date;

@Entity
public class Message {
    // Teams are the ones that contact each other, not users
    @Id
    @GeneratedValue(generator = "ContactGen", strategy = GenerationType.SEQUENCE)
    private long id;

    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "CONTACT_ID", referencedColumnName = "id")
    private Contact contact; // Sender

    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "TEAM_ID", referencedColumnName = "id")
    private Team team; // Receiver

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

    public static Message create(Contact contact, Team team, Date date, String text){
        return new Message(contact, team, date, text);
    }

    public Message(){}
    private Message(Contact contact, Team team, Date date, String text){
        this.contact = contact;
        this.team = team;
        this.month=date.getMonth();
        this.day=date.getDate();
        this.year=date.getYear();
        this.minute=date.getMinutes();
        this.hour=date.getHours();
        this.text = text;
    }
    public long getTeamID() {
        return this.team.getId();
    }
    public String getTeamName() {
        return this.team.getName();
    }
    public long getIDContact() {
        return contact.getId();
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

    public int getMinute() {
        return minute;
    }

    public int getHour() {
        return hour;
    }
}
