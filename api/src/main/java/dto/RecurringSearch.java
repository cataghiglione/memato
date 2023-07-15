package dto;

import java.util.List;

public class RecurringSearch {
    public List<String> times;
    private String weekDay;
    public Long id;

    public void setWeekDay(int number){
        String[] daysOfTheWeek= new String[]{"Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"};
        weekDay=daysOfTheWeek[number];
    }

}
