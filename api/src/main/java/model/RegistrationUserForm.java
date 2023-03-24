package model;

import static json.JsonParser.fromJson;

public class RegistrationUserForm {

    private final String email;
    private final String password;

    private final String firstName;

    private final String lastName;

    private final String username;




    public RegistrationUserForm(String email, String password, String firstName, String lastName, String username) {
        this.email = email;
        this.password = password;
        this.firstName=firstName;
        this.lastName=lastName;
        this.username = username;
    }

    public static RegistrationUserForm createFromJson(String body) {
        return fromJson(body, RegistrationUserForm.class);
    }

    public String getPassword() {
        return password;
    }

    public String getEmail() {
        return email;
    }


    public String getLastName() {
        return lastName;
    }
    public String getFirstName() {
        return firstName;
    }
    public String getUsername() {
        return username;
    }
}
