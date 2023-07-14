package model;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAccessor;
import java.util.Date;
import java.util.List;

import static json.JsonParser.fromJson;



public class CreateSearchForm {
    private final Team team;
    private final boolean isSearching;

    private final Date date;
    private final String latitude;
    private final String longitude;
    private final int age;

    public static CreateSearchForm createFromJson(String body) {
        return fromJson(body, CreateSearchForm.class);
    }

    public CreateSearchForm(Team team, boolean isSearching, Date date,  String latitude,String longitude,int age) {
        this.team = team;
        this.isSearching = isSearching;
//        LocalDate localDate = LocalDate.parse(date, DateTimeFormatter.ofPattern("dd/MM/yyyy"));
        this.date = date;
        this.latitude=latitude;
        this.longitude=longitude;
        this.age=age;
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

    public String getLatitude() {
        return latitude;
    }

    public String getLongitude() {
        return longitude;
    }

    public int getAge() {
        return age;
    }
    //    public List<String> getTime() {
//        return time;
//    }
//    private Date date_formatter(Date date) throws ParseException {
//        DateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
//        return formatter.parse(formatter.format(date));
//
//    }
}
