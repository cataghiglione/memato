package model;

import javax.persistence.*;
import java.util.Objects;

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
    @Column(name = "LATITUDE")
    private String latitude;
    @Column(name = "LONGITUDE")
    private String longitude;

//    @Column(name = "ZONE")
//    private String zone;


    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "USER_ID", referencedColumnName = "id")
    private User user;

    public Team() {
    }

    private Team(String name, String sport, String quantity,  String age_group,  User user, String latitude, String longitude) {
        this.name = name;
        this.sport = sport;
        this.quantity = quantity;
//        this.puntuality = puntuality;
        this.age_group = age_group;
//        this.zone = zone;
        this.user = user;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public static Team create(String name, String sport, String quantity, String group,  User user, String latitude, String longitude) {
        return new Team(name, sport, quantity, group, user, latitude, longitude);
    }

//    public String getZone() {
//        return zone;
//    }

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

    public dto.Team asDto() {
        dto.Team team = new dto.Team();
        team.id = this.id;
        team.name = this.name;
        return team;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Team team = (Team) o;
        return id == team.id;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
