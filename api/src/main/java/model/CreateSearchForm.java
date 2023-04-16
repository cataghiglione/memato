package model;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import static json.JsonParser.fromJson;



public class CreateSearchForm {
    private final Team team;
    private final boolean isSearching;
    private final String time;
    private final Date date;
    private final double latitude;
    private final double longitude;

    public static CreateSearchForm createFromJson(String body) {
        return fromJson(body, CreateSearchForm.class);
    }

    public CreateSearchForm(Team team, boolean isSearching, Date date, String time,double latitude,double longitude) {
        this.team = team;
        this.isSearching = isSearching;
        this.date = date;
        this.time = time;
        this.latitude=latitude;
        this.longitude=longitude;
    }

    public Team getTeam() {
        return team;
    }

    public boolean isSearching() {
        return isSearching;
    }

    public Date getDate()  {
        return date;
    }

    public double getLatitude() {
        return latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public String getTime() {
        return time;
    }

}
