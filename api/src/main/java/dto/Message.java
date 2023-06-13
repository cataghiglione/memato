package dto;

import javax.persistence.*;

public class Message {
    public long id;

    public long team_id; // Sender
    public String team_name;
    public long contact_id; // Receiver

    public int minute;

    public int hour;
    public String text;
}
