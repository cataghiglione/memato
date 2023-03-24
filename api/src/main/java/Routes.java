import com.google.gson.Gson;
import model.RegistrationUserForm;
import repository.Users;
import spark.Spark;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;

import static spark.Spark.*;

public class Routes {
    public static final String REGISTER_ROUTE = "/register";
    public static final String USERS_ROUTE = "/users";


    private MySystem system;
    private static final Gson gson = new Gson();
    private final EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("rmatch");


    public void create(MySystem system) {
        this.system = system;
        routes();
    }

    private void routes() {
        before((req, resp) -> {
            resp.header("Access-Control-Allow-Origin", "*");
            resp.header("Access-Control-Allow-Headers", "*");
            resp.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, PATCH, OPTIONS");
        });
        options("/*", (req, resp) -> {
            resp.status(200);
            return "ok";
        });

        post(REGISTER_ROUTE, (req, res) -> {
            final RegistrationUserForm form = RegistrationUserForm.createFromJson(req.body());

            system.registerUser(form).ifPresentOrElse(
                    (user) -> {
                        res.status(201);
                        res.body("user created");
                    },
                    () -> {
                        res.status(409);
                        res.body("username or email already exists");
                    }
            );

            return res.body();
        });
        Spark.get("/getAllUsers", "application/json", (req, resp) -> {
            resp.type("application/json");
            resp.status(200);
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final Users users = new Users(entityManager);

//            try {
//
//            }catch (SQL) {
//                resp.status(409);
//                resp.body("ee");
//            }
            return gson.toJson(users.listAll());
        });

    }

}
