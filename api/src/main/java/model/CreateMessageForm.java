package model;

import java.util.Date;

import static json.JsonParser.fromJson;

public class CreateMessageForm {
    private final String team_id;
    private final String contact_id;
    private final String text;
    private final Date date;

    public static CreateMessageForm createFromJson(String body) {
        return fromJson(body, CreateMessageForm.class);
    }

    public CreateMessageForm(String team_id, String contact_id, Date date, String text){
        this.contact_id = contact_id;
        this.team_id = team_id;
        this.date = date;
        this.text = text;
    }

    public String getTeam_id() {
        return team_id;
    }

    public String getContact_id() {
        return contact_id;
    }

    public Date getDate() {
        return date;
    }

    public String getText() {
        return text;
    }
}
