package model;

import static json.JsonParser.fromJson;

public class CreateMatchForm {
    private final String searchId;
    private final String teamId;

    public static CreateMatchForm createFromJson(String body) {
        return fromJson(body, CreateMatchForm.class);
    }

    public CreateMatchForm(String searchId, String teamId) {
        this.searchId = searchId;
        this.teamId = teamId;
    }

    public String getSearchId() {
        return searchId;
    }

    public String getTeamId() {
        return teamId;
    }
}
