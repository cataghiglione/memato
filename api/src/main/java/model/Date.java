package model;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

@Entity
@Table
public class Date {
    @Id
    @GeneratedValue(generator = "increment")
    @GenericGenerator(name = "increment", strategy = "increment")    private long id;

    @Column
    private int day;
    @Column
    private int month;
    @Column
    private int year;
    @Column
    private int weekDay;

    public Date (int day, int month, int year, int weekDay){
        this.day=day;
        this.month=month;
        this.year=year;
        this.weekDay=weekDay;
    }

    public Date() {

    }

    public static Date create(int day, int month, int year, int weekDay){
        return new Date(day,month,year,weekDay);
    }

    public long getId() {
        return id;
    }

    public int getDate() {
        return day;
    }

    public int getMonth() {
        return month;
    }

    public int getYear() {
        return year;
    }

    public int getWeekDay() {
        return weekDay;
    }
    public java.util.Date createJavaDate(){
        java.util.Date newDate = new java.util.Date();
        newDate.setDate(this.day);
        newDate.setMonth(this.month);
        newDate.setYear(this.year);
        return newDate;
    }
}
