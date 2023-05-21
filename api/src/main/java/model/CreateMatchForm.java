package model;

import static json.JsonParser.fromJson;

public class CreateMatchForm {
    private final String searchId;
    //    private final String teamId;
    private final String candidate_search_id;


    public static CreateMatchForm createFromJson(String body) {
        return fromJson(body, CreateMatchForm.class);
    }

    public CreateMatchForm(String searchId, String can_search_id) {
        this.searchId = searchId;
        this.candidate_search_id = can_search_id;
//        this.teamId = teamId;

    }

    public String getSearchId() {
        return searchId;
    }

    //    public String getTeamId() {
//        return teamId;
//    }
//}
    public String getCandidate_search_id() {
        return candidate_search_id;
    }
}
