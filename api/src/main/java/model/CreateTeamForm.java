package model;

import javax.persistence.Column;

import static json.JsonParser.fromJson;

public class CreateTeamForm {
    private final String name;

    private final String sport;

    private final int quantity;

    public String getName() {
        return name;
    }

    public String getSport() {
        return sport;
    }

    public int getQuantity() {
        return quantity;
    }

    public int getPuntuality() {
        return puntuality;
    }

    private final int puntuality;

    public CreateTeamForm(String name, String sport, int quantity, int puntuality){
        this.name=name;
        this.sport=sport;
        this.quantity=quantity;
        this.puntuality=puntuality;
    }

    public static CreateTeamForm createFromJson(String body){
        return fromJson(body,CreateTeamForm.class);
    }
}
