package model;

import javax.persistence.*;

@Entity
public class Team {
    @Id
    @GeneratedValue (generator = "teamGen", strategy = GenerationType.SEQUENCE)
    private long id;

    @Column(name="NAME")
    private String name;

    @Column(name = "SPORT")
    private String sport;

    @Column(name = "QUANTITY")
    private int quantity;

    @Column (name = "PUNTUALITY")
    private int puntuality;

    public Team(){}

    private Team(String name, String sport, int quantity, int puntuality){
        this.name=name;
        this.sport=sport;
        this.quantity=quantity;
        this.puntuality=puntuality;
    }
    public static Team create(String name, String sport, int quantity, int puntuality){
        return new Team(name,sport,quantity,puntuality);
    }

    public long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getSport() {
        return sport;
    }

    public int getQuantity() {
        return quantity;
    }

    public int getPuntuality() {
        return puntuality;
    }
    public void setPuntuality(int value){
        this.puntuality=value;
    }
}
