package model;

import java.util.List;

public class NewSearchResponse {
    public List<Team> teams;
    public long searchId;

    public NewSearchResponse(long searchId, List<Team> teams) {
        this.teams = teams;
        this.searchId = searchId;
    }
}
