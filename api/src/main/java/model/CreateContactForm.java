package model;

import static json.JsonParser.fromJson;

public class CreateContactForm {
    private final String team1_id;
    private final String team2_id;

    public static CreateContactForm createFromJson(String body) {
        return fromJson(body, CreateContactForm.class);
    }

    public CreateContactForm(String team1_id, String team2_id){
        this.team1_id = team1_id;
        this.team2_id = team2_id;
    }
    public String getTeam1_id(){
        return team1_id;
    }
    public String getTeam2_id(){
        return team2_id;
    }
}
