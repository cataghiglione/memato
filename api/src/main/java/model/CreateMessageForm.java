package model;

import java.util.Date;

import static json.JsonParser.fromJson;

public class CreateMessageForm {
    private final String team1_id;
    private final String team2_id;
    private final String text;
    private final Date date;

    public static CreateMessageForm createFromJson(String body) {
        return fromJson(body, CreateMessageForm.class);
    }

    public CreateMessageForm(String team1_id, String team2_id, Date date, String text){
        this.team1_id = team1_id;
        this.team2_id = team2_id;
        this.date = date;
        this.text = text;
    }

    public String getTeam1_id(){
        return team1_id;
    }

    public String getTeam2_id(){
        return team2_id;
    }

    public Date getDate() {
        return date;
    }

    public String getText() {
        return text;
    }
}
