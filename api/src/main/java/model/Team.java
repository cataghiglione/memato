package model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Team {
    @Id
    @GeneratedValue (generator = "teamGen", strategy = GenerationType.SEQUENCE)
    private long id;

}
