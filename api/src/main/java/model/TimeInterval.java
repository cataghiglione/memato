package model;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.*;
import java.util.stream.IntStream;
@Table
@Entity
public class TimeInterval {
    @Id
    @GeneratedValue(generator = "increment")
    @GenericGenerator(name = "increment", strategy = "increment")
    private long id;

    @ElementCollection
    private List<String> intervals;

    public TimeInterval(List<String> intervals) {
        this.intervals = (intervals);
    }

    public TimeInterval() {

    }
    public static TimeInterval create(List<String> intervals){
        return new TimeInterval(intervals);
    }

    public List<String> sameIntervals(List<String> intervals_2) {
        List<String> result = new ArrayList<>();

        for (String interval : this.intervals) {
            if (intervals_2.contains(interval)) {
                result.add(interval);
            }
        }
        return result;
    }
    public boolean haveOneCoincidentTime(List<String> intervals_2) {


        for (String interval : this.intervals) {
            if (intervals_2.contains(interval)) {
                return true;
            }
        }
        return false;
    }
    public boolean haveOneCoincidentTimeWithTimeInterval(TimeInterval timeInterval){
        return haveOneCoincidentTime(timeInterval.getIntervals());
    }

    public List<String> getIntervals() {
        return intervals;
    }
    public boolean listEqualsIgnoreOrder(List<String> timeInterval) {
        return new HashSet<>(timeInterval).equals(new HashSet<>(this.intervals));
    }
}
