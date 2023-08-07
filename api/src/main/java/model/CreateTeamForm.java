package model;

import javax.persistence.Column;

import static json.JsonParser.fromJson;

public class CreateTeamForm {
    private final String name;

    private final String sport;

    private final String quantity;
    private  final String age_group;

    private final String latitude;
    private final String longitude;
    private final String location;

//    private final String zone;

    public String getName() {
        return name;
    }
//    public String getZone(){return zone;}

    public String getAgeGroup() {
        return age_group;
    }

    public String getSport() {
        return sport;
    }

    public String getQuantity() {
        return quantity;
    }

    public int getPuntuality() {
        return puntuality;
    }
    public String getLatitude(){return latitude;}
    public String getLongitude(){return longitude;}
    public String getLocation(){return location;}

    private final int puntuality;

    public CreateTeamForm(String name, String sport, String quantity, int puntuality, String group, String latitude, String longitude, String location){
        this.name=name;
        this.sport=sport;
        this.quantity=quantity;
        this.puntuality=puntuality;
        this.age_group=group;
        this.latitude = latitude;
        this.longitude = longitude;
        this.location = location;
//        this.zone=zone;
    }

    public static CreateTeamForm createFromJson(String body){
        return fromJson(body,CreateTeamForm.class);
    }
}
