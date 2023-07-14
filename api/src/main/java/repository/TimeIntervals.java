package repository;

import model.Team;
import model.TimeInterval;

import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;

public class TimeIntervals {
    private final EntityManager entityManager;
    public TimeIntervals(EntityManager entityManager) {
        this.entityManager = entityManager;
    }
    public TimeInterval createTimeInterval(List<String> times){
        final TimeInterval newTimeInterval = TimeInterval.create(times);
        entityManager.persist(newTimeInterval);
        return newTimeInterval;
    }
    public List<String> sameIntervals(List<String> intervals,List<String> intervals_2) {
        List<String> result = new ArrayList<>();

        for (String interval : intervals) {
            if (intervals_2.contains(interval)) {
                result.add(interval);
            }
        }
        return result;
    }


}
