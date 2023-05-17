package model;

import static json.JsonParser.fromJson;

public class CreateMatchForm {
    private final String search1;
    private final String search2;

    public static CreateMatchForm createFromJson(String body) {
        return fromJson(body, CreateMatchForm.class);
    }

    public CreateMatchForm(String search1, String search2) {
        this.search1 = search1;
        this.search2 = search2;
    }

    public String getSearch1() {
        return search1;
    }

    public String getSearch2() {
        return search2;
    }
}
