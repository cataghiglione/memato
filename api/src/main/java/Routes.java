
import com.google.common.base.Strings;
import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import com.google.gson.Gson;
import json.JsonParser;
import model.*;
import repository.Searches;
import repository.Teams;
import repository.Users;
import spark.Request;
import spark.Response;
import spark.Route;
import spark.Spark;

import javax.persistence.*;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

import static java.util.concurrent.TimeUnit.MINUTES;
import static json.JsonParser.toJson;
import static spark.Spark.*;

public class Routes {
    public static final String REGISTER_ROUTE = "/register";
    public static final String USERS_ROUTE = "/users";
    public static final String USER_ROUTE = "/user";
    public static final String AUTH_ROUTE = "/auth";
    public static final String PICK_TEAM_ROUTE = "/pickTeam";
    public static final String NEW_TEAM_ROUTE = "/newTeam";
    public static final String HOME_ROUTE = "/home";
    public static final String FIND_RIVAL_ROUTE = "/findRival";
    public static final String GET_TEAM_BY_ID_ROUTE = "/getTeamById";
    public static final String NEW_SEARCH_ROUTE = "/newSearch";
    public static final String GET_ACTIVE_SEARCHES_ROUTE = "/currentSearches";
    public static final String UPDATE_TEAM_ROUTE = "/updateTeam";
    public static final String DELETE_TEAM_ROUTE = "/deleteTeam";
    public static final String DELETE_ACCOUNT = "/deleteAccount";
    public static final String UPDATE_USER_ROUTE = "/updateUser";
    public static final String GET_TEAM_BY_TEAMID = "/getTeamByOwnId";
    public static final String DEACTIVATE_SEARCH_ROUTE="/deactivateSearch";
    public static final String NEW_MATCH ="/newMatch";
    public static final String CONFIRM_MATCH = "/confirmMatch";


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
        storedBasicUser(entityManagerFactory);
        storedBasicTeam(entityManagerFactory);
        storedBasicSearch(entityManagerFactory);
        options("/*", (req, resp) -> {
            resp.status(200);
            return "ok";
        });
        post(NEW_TEAM_ROUTE, (req, res) -> {

            getUser(req).ifPresentOrElse(
                    (user) -> {
                        final CreateTeamForm form = CreateTeamForm.createFromJson(req.body());

                        system.createTeam(form, user).ifPresentOrElse(
                                (team) -> {
                                    res.status(201);
                                    res.body("team created");
                                },
                                () -> {
                                    res.status(409);
                                    res.body("Team name already in use");
                                }
                        );
                    },
                    () -> {
                        res.status(409);
                    }
            );
            return res.body();

        });

        authorizedPost(NEW_MATCH, (req, res) -> {
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final Searches searches = new Searches(entityManager);
            final CreateMatchForm form = CreateMatchForm.createFromJson(req.body());
            getUser(req).ifPresentOrElse(
                    (user) -> {
                        searches.getSearchById(Long.parseLong(form.getSearchId())).ifPresent(
                                (search1) -> {
                                    searches.getSearchBySearchAndTeam(search1, form.getTeamId()).ifPresent(
                                            (search2) -> {
                                                system.createMatch(search1, search2).ifPresentOrElse(
                                                        (match) -> {
                                                            res.status(201);
                                                            res.body("match created");
                                                        },
                                                        () -> {
                                                            res.status(409);
                                                            res.body("A match with this searches already exists");
                                                        }
                                                );
                                            }
                                    );
                                }
                        );
                    },
                    () -> {
                        res.status(404);
                        res.body("Invalid Token");
                    }
            );
            return res.body();
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
        delete(DELETE_ACCOUNT, (req, res) -> {
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final Users users = new Users(entityManager);
            final EntityManager entityManager2 = entityManagerFactory.createEntityManager();
            final Teams teams = new Teams(entityManager2);
            EntityTransaction transaction_user = entityManager.getTransaction();
            EntityTransaction transaction_team = entityManager2.getTransaction();
            AtomicInteger i = new AtomicInteger();
            getUser(req).ifPresentOrElse(
                    (user) -> {
                        res.status(200);
                        getToken(req)
                                .ifPresentOrElse(token -> {
                                    emailByToken.invalidate(token);
                                    res.status(204);
                                }, () -> {
                                    res.status(404);
                                    res.body("Invalid token");
                                });
                        try {
                            transaction_team.begin();
                            teams.deleteAllTeams(user.getId());
                            i.set(teams.getNumberOfTeamsForUser(user.getId()));
                            transaction_team.commit();
                        } catch (Exception e) {
                            transaction_team.rollback();
                            res.status(400);
                            res.body("no se pudo hacer el delete all teams");
                        } finally {
                            entityManager2.close();
                        }
                        try {
                            transaction_user.begin();
                            users.deleteAccount(user.getId());
                            transaction_user.commit();
                            res.status(200);
                            res.body(String.valueOf(i));
                        } catch (Exception e) {
                            transaction_user.rollback();
                            res.status(400);
                            res.body("no se pudo hacer el delete account");
                        } finally {
                            entityManager.close();
                        }
                    },
                    () -> {
                        res.status(404);
                        res.body("Invalid Token");
                    }
            );
            return res.body();

        });
        authorizedGet(USERS_ROUTE, (req, res) -> {
            final List<User> users = system.listUsers();
            return JsonParser.toJson(users);
        });
        get(PICK_TEAM_ROUTE, (req, res) -> {
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final Teams teams = new Teams(entityManager);
            Optional<User> user = getUser(req);
            if (user.isPresent()) {
                String id = user.get().getId().toString();
                List<Team> teamList = teams.findTeamsByUserId(id);
                if (teamList.isEmpty()) {
                    res.status(404);
                    res.body("no teams yet");
                    return res.body();
                } else return gson.toJson(teamList);
            } else {
                return "";
            }
        });
        authorizedGet(USER_ROUTE, (req, res) -> {
            getUser(req).ifPresentOrElse(
                    (user) -> {
                        res.status(200);
                        res.body(user.asJson());
                    },
                    () -> {
                        res.status(404);
                        res.body("Invalid Token");
                    }
            );
            return toJson(res.body());
        });
        authorizedGet(GET_TEAM_BY_ID_ROUTE, (req, res) -> {
            final String id = (req.queryParams("id"));
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final Teams teams = new Teams(entityManager);
            teams.findTeamsById(id).ifPresentOrElse(
                    (team) -> {
                        res.status(200);
                        res.body(JsonParser.toJson(team));
                    },
                    () -> {
                        res.status(404);
                        res.body("Invalid Token");
                    }
            );
            return toJson(res.body());
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
//        authorizedGet(FIND_RIVAL_ROUTE, (req, res) -> {
//            final String id = (req.queryParams("id"));
//            final EntityManager entityManager = entityManagerFactory.createEntityManager();
//            final Searches searches=new Searches(entityManager);
//            final CreateSearchForm searchForm = CreateSearchForm.createFromJson(req.body());
//            List<Team> candidates = searches.findCandidates(id,searchForm.getTime(),searchForm.getDate().toString());
//            return gson.toJson(candidates);
//        });
        post(NEW_SEARCH_ROUTE, (req, res) -> {
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final Searches searches = new Searches(entityManager);
            final Teams teams = new Teams(entityManager);
            final String id = (req.queryParams("id"));
            Optional<User> user = getUser(req);
            AtomicLong searchId = new AtomicLong();

            teams.findTeamsById(id).ifPresent(
                    (team) -> {
                        final CreateSearchForm searchForm = CreateSearchForm.createFromJson(req.body());
                        system.findOrCreateSearch(searchForm, team).ifPresentOrElse(
                                (search) -> {
                                    searchId.set(search.getId());
                                    res.status(201);
                                },
                                () -> {
                                    res.status(200);
                                }

                        );
                        if (user.isPresent()) {
                            String user_id = user.get().getId().toString();
                            List<Team> candidates = searches.findCandidates(user_id, searchForm.getTime(), searchForm.getDate(), team.getSport(), team.getQuantity(), searchForm.getLatitude(), searchForm.getLongitude());
                            NewSearchResponse newSearchResponse = new NewSearchResponse(searchId.get(), candidates);
                            res.body(JsonParser.toJson(newSearchResponse));
                        }

                    }
            );
            return res.body();
        });
        get(GET_ACTIVE_SEARCHES_ROUTE, (req, res) -> {
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final Searches searches = new Searches(entityManager);
            getUser(req).ifPresentOrElse(
                    (user) -> {
                        try{
                        Long user_id = user.getId();
                        List<Search> active_searches = searches.findActiveSearchesByUserId(user_id);
                        res.body(JsonParser.toJson(active_searches));
                        res.status(200);}
                        catch (Exception e) {
                            res.status(400);
                        }

                    },
                    () -> {
                        res.status(400);
                    }
            );
            return res.body();


        });
        post(UPDATE_TEAM_ROUTE, (req, res) -> {
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final Teams teams = new Teams(entityManager);
            final String id = (req.queryParams("id"));
            teams.findTeamsById(id).ifPresentOrElse(
                    (team) -> {
                        final CreateTeamForm teamForm = CreateTeamForm.createFromJson(req.body());
                        EntityTransaction transaction = entityManager.getTransaction();
                        transaction.begin();
                        //por las dudas, aca en el form habia un teamForm.getTeam en la query
                        teams.updateTeam(teamForm.getName(), teamForm.getSport(), teamForm.getQuantity(), teamForm.getAgeGroup(), Long.valueOf(id));
                        transaction.commit();
                        res.status(200);
                    },
                    () -> {
                        res.status(400);
                    }
            );
            return res.status();


        });
        post(UPDATE_USER_ROUTE, (req, res) -> {
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final Users users = new Users(entityManager);
            getUser(req).ifPresentOrElse(
                    (user) -> {
                        final CreateUserForm userForm = CreateUserForm.createFromJson(req.body());
                        EntityTransaction transaction = entityManager.getTransaction();
                        transaction.begin();
                        users.updateUser(userForm.getFirst_name(), userForm.getLast_name(), userForm.getEmail(), userForm.getPassword(), userForm.getUsername(), user.getId());
                        transaction.commit();
                        res.status(200);
                    },
                    () -> {
                        res.status(400);
                    }
            );
            return res.status();


        });
        // The idea is that req has the MatchId and the TeamId of the team that want to confirm
        post(CONFIRM_MATCH, (req, res) -> {
            return req.body();
            //to doo
//            final EntityManager entityManager = entityManagerFactory.createEntityManager();
//            final Matches matches = new Matches(entityManager);
//            final EntityManager entityManager1 = entityManagerFactory.createEntityManager();
//            final Teams teams = new Teams(entityManager1);
//            final CreateConfirmMatchForm form = CreateConfirmMatchForm.createFromJson(req.body());
//            teams.findTeamsById(form.getTeamId()).ifPresentOrElse(
//                    (team) -> {
//                        matches.findMatch(form.getMatchId(), form.getTeamId()).ifPresentOrElse(
//                                (match) -> {
//                                    EntityTransaction transaction = entityManager.getTransaction();
//                                    transaction.begin();
//                                    matches.confirmByTeam(form.getMatchId(), form.getTeamId(), match);
//                                    transaction.commit();
//                                    res.body("The match is confirmed by one team");
//                                    res.status(200);
//                                },
//                                () -> {
//                                    res.body("The match doesn't exist or the team is not one of the teams of the match");
//                                    res.status(400);
//                                }
//                        );
//                    },
//                    () -> {
//                        res.body("The team doesn't exist");
//                        res.status(404);
//                    }
//            );
//            return res.body();
        });
        delete(DELETE_TEAM_ROUTE, (req, res) -> {
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final Teams teams = new Teams(entityManager);
            final String id = (req.queryParams("id"));
            Optional<User> user = getUser(req);
            EntityTransaction transaction = entityManager.getTransaction();
            if (user.isPresent()) {
                Long user_id = user.get().getId();
                try {
                    transaction.begin();
                    teams.deleteTeam(Long.valueOf(id));
                    transaction.commit();
                    if (teams.getNumberOfTeamsForUser(user_id) == 0) {
                        res.status(200);
                    } else {
                        res.status(203);
                    }
                } catch (Exception e) {
                    transaction.rollback();
                    res.status(400);
                } finally {
                    entityManager.close();
                }


            } else res.status(400);
            return res.status();
        });
        get(GET_TEAM_BY_TEAMID, (req, res) -> {
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final Teams teams = new Teams(entityManager);
            final String id = (req.queryParams("teamId"));
            Optional<Team> team = teams.findTeamsById(id);
            if (team.isPresent()) {
                res.body(JsonParser.toJson(team));
                res.status(200);
            } else {
                res.status(400);
            }
            return res.body();


        });
        post(DEACTIVATE_SEARCH_ROUTE,(req,res)->{
            final Long id = Long.valueOf(req.body());
            boolean state = system.deactivateSearch(id);
            if (state){
                res.status(200);
            }
            else res.status(400);
            return res.status();

        });


    }

    private void authorizedGet(final String path, final Route route) {
        get(path, (request, response) -> authorize(route, request, response));
    }

    private void authorizedDelete(final String path, final Route route) {
        delete(path, (request, response) -> authorize(route, request, response));
    }

    private void authorizedPost(final String path, final Route route) {
        post(path, (request, response) -> authorize(route, request, response));
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

    private static void storedBasicTeam(EntityManagerFactory entityManagerFactory) {
        final EntityManager entityManager = entityManagerFactory.createEntityManager();
        final Teams teams = new Teams(entityManager);
        final Users users = new Users(entityManager);
        List<User> userList = users.listAll();
        EntityTransaction tx = entityManager.getTransaction();
        tx.begin();
        if (teams.listAll().isEmpty()) {
            final Team kateTeam =
                    Team.create("river", "Football", "11",  "Young", userList.get(0));
            final Team cocaTeam =
                    Team.create("depo", "Football", "11",  "Young", userList.get(1));
            teams.persist(kateTeam);
            teams.persist(cocaTeam);
        }
        tx.commit();
        entityManager.close();
    }

    private static void storedBasicSearch(EntityManagerFactory entityManagerFactory) {
        final EntityManager entityManager = entityManagerFactory.createEntityManager();
        final Teams teams = new Teams(entityManager);
        final Searches searches = new Searches(entityManager);
        List<Team> teamList = teams.listAll();
        EntityTransaction tx = entityManager.getTransaction();
        tx.begin();
        if (searches.listAll().isEmpty()) {
            final Search kateSearch =
                    Search.create(teamList.get(0), Date.from(Instant.now()), "Afternoon", "-34.456884", "-58.858952");
            final Search cocaSearch =
                    Search.create(teamList.get(1), Date.from(Instant.now()), "Afternoon", "-36.456884", "-58.858952");
            searches.persist(kateSearch);
            searches.persist(cocaSearch);
        }
        tx.commit();
        entityManager.close();
    }

    private static String capitalized(String name) {
        return Strings.isNullOrEmpty(name) ? name : name.substring(0, 1).toUpperCase() + name.substring(1).toLowerCase();
    }

}







