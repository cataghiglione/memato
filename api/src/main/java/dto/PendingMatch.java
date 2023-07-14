package dto;
import java.util.List;

public class PendingMatch {

    public Long id;

    public Team team1;
    public Team team2;

    public List<String> time;
    public String day;

    public Boolean isConfirmed;

    public Boolean team1Confirmed;
    public Boolean team2Confirmed;

}
