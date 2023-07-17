package model;

import static json.JsonParser.fromJson;

public class CreateNotificationWSForm {
    private String message;
    private String searchId;
    private String candidate_search_id;
    private String team_id;

    public static CreateNotificationWSForm createFromJson(String body) {
        return fromJson(body, CreateNotificationWSForm.class);
    }

    public Long getCandidate_search_id() {
        return Long.parseLong(candidate_search_id);
    }

    public String getMessage() {
        return message;
    }

    public Long getSearch_id() {
        return Long.parseLong(searchId);
    }

    public Long getTeam_id() {
        return Long.parseLong(team_id);
    }
}
