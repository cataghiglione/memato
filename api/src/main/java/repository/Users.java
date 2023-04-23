package repository;


import model.RegistrationUserForm;
import model.User;

import javax.persistence.EntityManager;
import java.util.List;
import java.util.Optional;

public class Users {

    private final EntityManager entityManager;

    public Users(EntityManager entityManager) {
        this.entityManager = entityManager;
    }
    public boolean exists(String email,String username) {
        return findByEmail(email).isPresent() || findByUsername(username).isPresent();
    }
    public User createUser(RegistrationUserForm signUpValues) {
        if (findByEmail(signUpValues.getEmail()).isPresent()) throw new IllegalStateException("Email already in use.");
        if (findByEmail(signUpValues.getUsername()).isPresent()) throw new IllegalStateException("Username already in use.");

        final User newUser = User.create(signUpValues.getEmail(), signUpValues.getPassword(),signUpValues.getFirstName(),signUpValues.getLastName(), signUpValues.getUsername());

        entityManager.persist(newUser);

        return newUser;
    }

    public Optional<User> findById(Long id) {
        return Optional.ofNullable(entityManager.find(User.class, id));
    }

    public Optional<User> findByEmail(String email) {
        return entityManager
                .createQuery("SELECT u FROM User u WHERE u.email LIKE :email", User.class)
                .setParameter("email", email).getResultList()
                .stream()
                .findFirst();
    }
    public Optional<User> findByUsername(String username) {
        return entityManager
                .createQuery("SELECT u FROM User u WHERE u.username LIKE :username", User.class)
                .setParameter("username", username).getResultList()
                .stream()
                .findFirst();
    }


    public List<User> list() {
        return entityManager.createQuery("SELECT u FROM User u", User.class)
                .getResultList();
    }

    public List<User> listAll() {
        return entityManager.createQuery("SELECT u FROM User u", User.class).getResultList();
    }

    public User persist(User user) {
        entityManager.persist(user);
        return user;
    }
    public void deleteAccount(Long id){
        entityManager.createQuery("DELETE FROM User WHERE id =: id")
                .setParameter("id", id)
                .executeUpdate();
    }
    public void updateUser(String first_name, String last_name, String email, String password, String username, Long user_id) {
        try {
            entityManager.createQuery("UPDATE User set firstName =:first_name, lastName=:last_name, email =:email, password =:password, username =:username where id =:user_id")
                    .setParameter("first_name", first_name)
                    .setParameter("last_name", last_name)
                    .setParameter("email", email)
                    .setParameter("password", password)
                    .setParameter("username", username)
                    .setParameter("user_id", user_id)
                    .executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}
