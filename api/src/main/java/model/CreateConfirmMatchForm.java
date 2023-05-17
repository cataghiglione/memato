package model;

import static json.JsonParser.fromJson;

public class CreateConfirmMatchForm {
    private final String teamId;
    private final String matchId;

    public CreateConfirmMatchForm(String teamId, String matchId) {
        this.teamId = teamId;
        this.matchId = matchId;
    }

    public String getTeamId() {
        return teamId;
    }

    public String getMatchId() {
        return matchId;
    }
    public static CreateConfirmMatchForm createFromJson(String body) {
        return fromJson(body, CreateConfirmMatchForm.class);
    }
}
