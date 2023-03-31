import com.google.common.base.Strings;
import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import com.google.gson.Gson;
import json.JsonParser;
import model.*;
import repository.Teams;
import repository.Users;
import spark.Request;
import spark.Response;
import spark.Route;
import spark.Spark;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicReference;

import static java.util.concurrent.TimeUnit.MINUTES;
import static json.JsonParser.fromJson;
import static json.JsonParser.toJson;
import static spark.Spark.*;

public class Routes {
    public static final String REGISTER_ROUTE = "/register";
    public static final String USERS_ROUTE = "/users";
    public static final String USER_ROUTE = "/user1";
    public static final String AUTH_ROUTE = "/auth";
    public static final String PICK_TEAM_ROUTE = "/pickTeam";
    public static final String NEW_TEAM_ROUTE = "/newTeam";


    private MySystem system;
    private static final Gson gson = new Gson();
    private final EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("rmatch");


    public void create(MySystem system) {
        this.system = system;
        routes();
    }

    private void routes() {
        AtomicReference<User> user_now = new AtomicReference<>(new User());
        before((req, resp) -> {
            resp.header("Access-Control-Allow-Origin", "*");
            resp.header("Access-Control-Allow-Headers", "*");
            resp.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, PATCH, OPTIONS");
        });
        options("/*", (req, resp) -> {
            resp.status(200);
            return "ok";
        });
        post(NEW_TEAM_ROUTE, (req, res) -> {
            final CreateTeamForm form = CreateTeamForm.createFromJson(req.body());

            system.createTeam(form).ifPresentOrElse(
                    (team) -> {
                        res.status(201);
                        res.body("team created");
                    },
                    () -> {
                        res.status(409);
                        res.body("Team name already in use");
                    }
            );
            return res.body();

        });
        storedBasicUser(entityManagerFactory);

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
        post(AUTH_ROUTE, (req, res) -> {
            final AuthRequest authReq = AuthRequest.createFromJson(req.body());

            authenticate(authReq)
                    .ifPresentOrElse(token -> {
                        res.status(201);
                        String j = toJson(Auth.create(token));
                        res.body(j);
                        System.out.println(j);
                    }, () -> {
                        res.status(401);
                        res.body("");
                    });

            return res.body();
        });
        authorizedDelete(AUTH_ROUTE, (req, res) -> {
            getToken(req)
                    .ifPresentOrElse(token -> {
                        emailByToken.invalidate(token);
                        res.status(204);
                    }, () -> {
                        res.status(404);
                    });

            return "";

        });
        authorizedGet(USERS_ROUTE, (req, res) -> {
            final List<User> users = system.listUsers();
            return JsonParser.toJson(users);
        });
        get(PICK_TEAM_ROUTE, (req, res) -> {
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final Teams teams = new Teams(entityManager);
            return gson.toJson(teams.listAll());
        });
        authorizedGet("/home", (req, res) -> {
            getUser(req).ifPresentOrElse(
                    (user) -> {
                        res.status(200);
                        res.body(toJson(user));
                    },
                    () -> {
                        res.status(404);
                        res.body("Invalid Token");
                    }
            );
            return res.body();
        });
        authorizedGet(USER_ROUTE, (req, res) -> getToken(req).map(JsonParser::toJson));
        Spark.get("/getAllUsers", "application/json", (req, resp) -> {
            resp.type("application/json");
            resp.status(200);
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final Users users = new Users(entityManager);
            return gson.toJson(users.listAll());
        });
    }

    private void authorizedGet(final String path, final Route route) {
        get(path, (request, response) -> authorize(route, request, response));
    }

    private void authorizedDelete(final String path, final Route route) {
        delete(path, (request, response) -> authorize(route, request, response));
    }

    private Object authorize(Route route, Request request, Response response) throws Exception {
        if (isAuthorized(request)) {
            return route.handle(request, response);
        } else {
            response.status(401);
            return "Unauthorized";
        }
    }

    private Optional<User> getUser(Request req) {
        return getToken(req)
                .map(emailByToken::getIfPresent)
                .flatMap(email -> system.findUserByEmail(email));
    }

    private final Cache<String, String> emailByToken = CacheBuilder.newBuilder()
            .expireAfterAccess(30, MINUTES)
            .build();

    private Optional<String> authenticate(AuthRequest req) {
        return system.findUserByEmail(req.getEmail()).flatMap(foundUser -> {
            if (system.validPassword(req.getPassword(), foundUser)) {
                final String token = UUID.randomUUID().toString();
                emailByToken.put(token, foundUser.getEmail());
                return Optional.of(token);
            } else {
                return Optional.empty();
            }
        });
    }

    private boolean isAuthorized(Request request) {
        return getToken(request).map(this::isAuthenticated).orElse(false);
    }

    private static Optional<String> getToken(Request request) {
        return Optional.ofNullable(request.headers("Authorization"))
                .map(Routes::getTokenFromHeader);
    }

    private static String getTokenFromHeader(String authorizationHeader) {
        return authorizationHeader.replace("Bearer ", "");
    }

    private boolean isAuthenticated(String token) {
        return emailByToken.getIfPresent(token) != null;
    }

    private static void storedBasicUser(EntityManagerFactory entityManagerFactory) {
        final EntityManager entityManager = entityManagerFactory.createEntityManager();
        final Users users = new Users(entityManager);

        EntityTransaction tx = entityManager.getTransaction();
        tx.begin();
        if (users.listAll().isEmpty()) {
            final User kate =
                    User.create("catuchi22@river.com", "91218", "Catuchi", "Ghi", "cghi");
            final User coke =
                    User.create("cocaL@depo.com", "1234", "Coke", "Lasa", "clasa");

            final User fercho =
                    User.create("ferpalacios@remix.com", "4321", "Fercho", "Palacios", "ferpa");

            users.persist(kate);
            users.persist(coke);
            users.persist(fercho);
        }
        tx.commit();
        entityManager.close();
    }

    private static String capitalized(String name) {
        return Strings.isNullOrEmpty(name) ? name : name.substring(0, 1).toUpperCase() + name.substring(1).toLowerCase();
    }

}







