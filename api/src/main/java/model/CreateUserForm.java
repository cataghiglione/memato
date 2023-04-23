package model;

import static json.JsonParser.fromJson;

public class CreateUserForm {
    private final String first_name;

    private final String last_name;

    private final String email;
    private  final String password;
    private final String username;

    public String getFirst_name() {
        return first_name;
    }

    public String getLast_name() {
        return last_name;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getUsername() {
        return username;
    }

    public CreateUserForm(String firstName, String lastName, String email, String password, String username) {
        first_name = firstName;
        last_name = lastName;
        this.email = email;
        this.password = password;
        this.username = username;
    }


    public static CreateUserForm createFromJson(String body){
        return fromJson(body,CreateUserForm.class);
    }
}
