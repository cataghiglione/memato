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

    public static CreateSearchForm createFromJson(String body) {
        return fromJson(body, CreateSearchForm.class);
    }

    public CreateSearchForm(Team team, boolean isSearching, Date date, String time) {
        this.team = team;
        this.isSearching = isSearching;
        this.date = date;
        this.time = time;
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

    public String getTime() {
        return time;
    }
//    private Date date_formatter(Date date) throws ParseException {
//        DateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
//        return formatter.parse(formatter.format(date));
//
//    }
}
