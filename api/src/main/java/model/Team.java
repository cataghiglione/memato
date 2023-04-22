package model;

import javax.persistence.*;

@Table
@Entity
public class Team {
    @Id
    @GeneratedValue(generator = "teamGen", strategy = GenerationType.SEQUENCE)
    private long id;

    @Column(name = "NAME")
    private String name;

    @Column(name = "SPORT")
    private String sport;

    @Column(name = "QUANTITY")
    private String quantity;

    @Column(name = "AGE_GROUP")
    private String age_group;

    @Column(name = "PUNTUALITY")
    private int puntuality;

    @Column(name = "ZONE")
    private String zone;


    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "USER_ID", referencedColumnName = "id")
    private User user;

    public Team() {
    }

    private Team(String name, String sport, String quantity, int puntuality, String age_group, String zone, User user) {
        this.name = name;
        this.sport = sport;
        this.quantity = quantity;
        this.puntuality = puntuality;
        this.age_group = age_group;
        this.zone = zone;
        this.user = user;
    }

    public static Team create(String name, String sport, String quantity, int puntuality, String group, String zone, User user) {
        return new Team(name, sport, quantity, puntuality, group, zone, user);
    }

    public String getZone() {
        return zone;
    }

    public long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getAge_group() {
        return age_group;
    }

    public String getSport() {
        return sport;
    }
    public long getUserId() {
        return user.getId();
    }

    public String getQuantity() {
        return quantity;
    }

    public int getPuntuality() {
        return puntuality;
    }

    public void setPuntuality(int value) {
        this.puntuality = value;
    }
}
