package model;

import java.util.List;

public class NewSearchResponse {
    public List<Search> searches;
    public long searchId;

    public NewSearchResponse(long searchId, List<Search> searches) {
        this.searches = searches;
        this.searchId = searchId;
    }
}
