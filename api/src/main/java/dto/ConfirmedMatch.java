package dto;
import java.util.Date;
import java.util.List;

public class ConfirmedMatch {
    public Long id;
    public List<String> time;
    public int day;
    public int month;
    public int year;
    public double latitude;
    public double longitude;
    public Team rival;
}
