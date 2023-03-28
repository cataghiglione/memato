package model;

import javax.persistence.Column;

import static json.JsonParser.fromJson;

public class CreateTeamForm {
    private final String name;

    private final String sport;

    private final String quantity;
    private  final String group;

    public String getName() {
        return name;
    }

    public String getGroup() {
        return group;
    }

    public String getSport() {
        return sport;
    }

    public String getQuantity() {
        return quantity;
    }

    public int getPuntuality() {
        return puntuality;
    }

    private final int puntuality;

    public CreateTeamForm(String name, String sport, String quantity, int puntuality, String group){
        this.name=name;
        this.sport=sport;
        this.quantity=quantity;
        this.puntuality=puntuality;
        this.group=group;
    }

    public static CreateTeamForm createFromJson(String body){
        return fromJson(body,CreateTeamForm.class);
    }
}
