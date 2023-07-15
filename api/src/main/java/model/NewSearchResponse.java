package model;

import javax.persistence.EntityManager;
import java.util.List;

public class NewSearchResponse {


    public List<CommonTimeSearch> searches;
    public long searchId;



    public NewSearchResponse(long searchId, List<CommonTimeSearch> searches) {
        this.searches = searches;
        this.searchId = searchId;
    }

}
