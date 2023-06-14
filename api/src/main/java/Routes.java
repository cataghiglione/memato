
import com.google.common.base.Strings;
import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import com.google.gson.Gson;
import dto.ConfirmedMatch;
import dto.PendingMatch;
import json.JsonParser;
import model.*;
import repository.*;
import spark.Request;
import spark.Response;
import spark.Route;
import spark.Spark;

import javax.persistence.*;
import java.awt.geom.Point2D;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Stream;

import static java.util.concurrent.TimeUnit.MINUTES;
import static json.JsonParser.fromJson;
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
    public static final String GET_COMPATIBLE_SEARCHES_ROUTE = "/compatibleSearches";
    public static final String UPDATE_TEAM_ROUTE = "/updateTeam";
    public static final String DELETE_TEAM_ROUTE = "/deleteTeam";
    public static final String DELETE_ACCOUNT_ROUTE = "/deleteAccount";
    public static final String UPDATE_USER_ROUTE = "/updateUser";
    public static final String GET_TEAM_BY_TEAMID_ROUTE = "/getTeamByOwnId";
    public static final String DEACTIVATE_SEARCH_ROUTE = "/deactivateSearch";
    public static final String NEW_MATCH_ROUTE = "/newMatch";
    public static final String CONFIRM_MATCH_ROUTE = "/confirmMatch";
    public static final String GET_MATCHES_BY_TEAMID_ROUTE = "/getMatchesByTeamId";
    public static final String IS_TEAM_1_OR_2_ROUTE = "/isTeamOneOrTwo";
    public static final String DECLINE_MATCH_ROUTE = "/declineMatch";
    public static final String GET_CONFIRMED_MATCHES_BY_TEAM_ROUTE = "/getConfirmedMatches";
    public static final String GET_NOTIFICATIONS_ROUTE = "/getNotifications";
    public static final String NEW_CONTACT_ROUTE = "/newContact";
    public static final String CONFIRM_CONTACT_ROUTE = "/confirmContact";
    // en el momento que uno manda un mensaje se crea un contacto, quiera o no el destinatario.
    public static final String GET_CONTACTS_BY_TEAMID_ROUTE = "/getContactsByTeamId"; // imitar GET_MATCHES_BY_TEAMID_ROUTE
    public static final String GET_5_PENDING_NOTIFICATIONS_ROUTE = "/getPendingNotifications";
    public static final String UPDATE_NOTIFICATION_STATUS = "/updateNotification";
    public static final String SEND_MESSAGE_ROUTE = "/sendMessage";
    public static final String GET_MESSAGES_ROUTE = "/getMessages";
    public static final String GET_OTHER_TEAM_NAME = "/getOtherTeamName";


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

        post(NEW_MATCH_ROUTE, (req, res) -> {
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final Searches searches = new Searches(entityManager);
            final CreateMatchForm form = CreateMatchForm.createFromJson(req.body());
            getUser(req).ifPresentOrElse(
                    (user) -> {
                        searches.getSearchById(Long.parseLong(form.getSearchId())).ifPresent(
                                (search1) -> {
                                    //searches.getSearchBySearchAndTeam(search1, form.getTeamId()).ifPresent(
                                    searches.getSearchById(Long.parseLong(form.getCandidate_search_id())).ifPresent(
                                            (search2) -> {
                                                system.createMatch(search1, search2).ifPresentOrElse(
                                                        (match) -> {
                                                            res.status(201);
                                                            res.body("match created");
                                                            system.createNotificationWithSearch(search2, String.format("Good news! %s wants to play with %s on %d/%d", search1.getTeam().getName(), search2.getTeam().getName(), search2.getDay(), search2.getMonth() + 1), 0, search1.getTeam().getId());
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

        // Copie en NEW_MATCH_ROUTE casi completamente, así que desde ahí debería andar
        authorizedPost(NEW_CONTACT_ROUTE, (req, res) -> {
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final Teams teams = new Teams(entityManager);
            final CreateContactForm form = CreateContactForm.createFromJson(req.body());
            getUser(req).ifPresentOrElse(
                    (user) -> {
                        teams.getTeamByTeamId(Long.parseLong(form.getTeam1_id())).ifPresent(
                                (team1) -> {
                                    //searches.getSearchBySearchAndTeam(search1, form.getTeamId()).ifPresent(
                                    teams.getTeamByTeamId(Long.parseLong(form.getTeam2_id())).ifPresent(
                                            (team2) -> {
                                                system.findOrCreateContact(team1, team2).ifPresentOrElse(
                                                        (contact) -> {
                                                            res.status(201);
                                                            res.body(Long.toString(contact.getId()));
                                                        },
                                                        () -> {
                                                            res.status(409);
                                                            res.body("An error occurred when creating or finding the contact");
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
        post(SEND_MESSAGE_ROUTE, (req, res) -> {
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final EntityManager entityManager2 = entityManagerFactory.createEntityManager();
            final EntityManager entityManager3 = entityManagerFactory.createEntityManager();
            final Teams teams = new Teams(entityManager);
            final Messages messages = new Messages(entityManager2);
            final Contacts contacts = new Contacts(entityManager3);
            final CreateMessageForm form = CreateMessageForm.createFromJson(req.body());
            getUser(req).ifPresentOrElse(
                    (user) -> {
                        //searches.getSearchBySearchAndTeam(search1, form.getTeamId()).ifPresent(
                        teams.getTeamByTeamId(Long.parseLong(form.getTeam_id())).ifPresent(
                                (team) -> {
                                    contacts.getContactByContactId(Long.parseLong(form.getContact_id())).ifPresent(
                                        (contact) -> {
                                            entityManager2.getTransaction().begin();
                                            messages.createMessage(contact, team, form.getDate(), form.getText());
                                            entityManager2.getTransaction().commit();
                                            entityManager2.close();
                                            system.createNotificationWithTeam(contact.getTeam1().equals(team) ? contact.getTeam2() : contact.getTeam1(),
                                                    String.format("%s has send %s a message", team.getName(), contact.getTeam1().equals(team) ? contact.getTeam2().getName() : contact.getTeam1().getName()),
                                                    2, team.getId());
                                            res.status(200);
                                            res.body("new message");
                                    });
                        });
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
        delete(DELETE_ACCOUNT_ROUTE, (req, res) -> {
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
            return toJson(users);
        });
        authorizedGet(GET_NOTIFICATIONS_ROUTE, (req, res) -> {
            getUser(req).ifPresentOrElse(
                    (user) -> {
                        final List<Notification> notificationsList = system.listNotifications(user);
                        transformNotifications(res, notificationsList);
                    },
                    () -> {
                        res.status(404);
                        res.body("Invalid Token");
                    }
            );
            return res.body();
        });

//        get the last 5 pending notifications
        authorizedGet(GET_5_PENDING_NOTIFICATIONS_ROUTE, (req, res) -> {
            getUser(req).ifPresentOrElse(
                    (user) -> {
                        final List<Notification> notificationsList = system.listPendingNotifications(user);
                        if(notificationsList.size() > 5){
                            transformNotifications(res, notificationsList.subList(0, 5));
                        }
                        transformNotifications(res, notificationsList);
                    },
                    () -> {
                        res.status(404);
                        res.body("Invalid Token");
                    }
            );
            return res.body();
        });
        authorizedPost(UPDATE_NOTIFICATION_STATUS, (req, res)-> {
            final String id = (req.queryParams("id"));
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final Notifications notifications = new Notifications(entityManager);
            getUser(req).ifPresentOrElse(
                (user) -> {
                    if(notifications.checkUserNotification(Long.toString(user.getId()), id)){
                        system.updateNotification(id);
                        res.status(200);
                        res.body("All turn great!");
                    }
                    else {
                        res.status(404);
                        res.body("Invalid user permission");
                    }
                },
                () -> {
                    res.status(404);
                    res.body("Invalid Token");
                });
            return res.body();
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
        authorizedGet(GET_MESSAGES_ROUTE, (req, res) -> {
            final Long contactId = Long.valueOf(req.queryParams("contactId"));
            getUser(req).ifPresentOrElse(
                    (user) -> {
                        final List<Message> messageList = system.getMessages(contactId);
                        transformMessages(res, messageList);
                    },
                    () -> {
                        res.status(404);
                        res.body("Invalid Token");
                    }
            );
            return res.body();
        });
        authorizedGet(GET_OTHER_TEAM_NAME, (req, res) -> {
            final Long contactId = Long.valueOf(req.queryParams("contactId"));
            final Long teamId = Long.valueOf(req.queryParams("teamId"));
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final Contacts contacts = new Contacts(entityManager);
            getUser(req).ifPresentOrElse(
                    (user) -> {
                        contacts.findContactByTeamIdAndContactId(teamId, contactId).ifPresent(
                                (contact) -> {
                                    res.body(toJson(contact.getTeam1().getId() == teamId ? contact.getTeam2().getName() : contact.getTeam1().getName()));
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
        authorizedGet(GET_TEAM_BY_ID_ROUTE, (req, res) -> {
            final String id = (req.queryParams("id"));
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final Teams teams = new Teams(entityManager);
            teams.findTeamsById(id).ifPresentOrElse(
                    (team) -> {
                        res.status(200);
                        res.body(toJson(team));
                    },
                    () -> {
                        res.status(404);
                        res.body("Invalid Token");
                    }
            );
            return toJson(res.body());
        });
        get("/getAllUsers", "application/json", (req, resp) -> {
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
                            List<Search> candidates = searches.findCandidates(user_id, searchForm.getTime(), searchForm.getDate(), team.getSport(), team.getQuantity(), searchForm.getLatitude(), searchForm.getLongitude());
                            NewSearchResponse newSearchResponse = new NewSearchResponse(searchId.get(), candidates);
                            res.body(toJson(newSearchResponse));
                        }

                    }
            );
            return res.body();
        });
        get(GET_ACTIVE_SEARCHES_ROUTE, (req, res) -> {
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final Searches searches = new Searches(entityManager);
            final Long team_id = Long.valueOf(req.queryParams("teamid"));
            List<Search> active_searches = searches.findActiveSearchesByTeamId(team_id);
            res.body(toJson(active_searches));
            res.status(200);
            return res.body();
        });
        authorizedGet(GET_COMPATIBLE_SEARCHES_ROUTE, (req, res) -> {
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final EntityManager entityManager2 = entityManagerFactory.createEntityManager();
            final Matches matches = new Matches(entityManager2);
            final Searches searches = new Searches(entityManager);
            final Long search_id = Long.valueOf(req.queryParams("search_id"));
            List<Search> compatible_searches = searches.findCompatibleSearches(search_id);
            res.body(toJson(matches.findNoMatch(Long.toString(search_id), compatible_searches)));
            res.status(200);
            return res.body();
        });

        post(UPDATE_TEAM_ROUTE, (req, res) -> {
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final Teams teams = new Teams(entityManager);
            final Searches searches = new Searches(entityManager);
            final Matches matches = new Matches(entityManager);
            final String id = (req.queryParams("id"));
            teams.findTeamsById(id).ifPresentOrElse(
                    (team) -> {
                        final String prev_sport = team.getSport();
                        final String prev_quantity = team.getQuantity();
                        final CreateTeamForm teamForm = CreateTeamForm.createFromJson(req.body());
                        EntityTransaction transaction = entityManager.getTransaction();
                        transaction.begin();
                        //por las dudas, aca en el form habia un teamForm.getTeam en la query
                        teams.updateTeam(teamForm.getName(), teamForm.getSport(), teamForm.getQuantity(), teamForm.getAgeGroup(), Long.valueOf(id));
                        if (!Objects.equals(teamForm.getQuantity(), prev_quantity) || !Objects.equals(teamForm.getSport(), prev_sport)){
                            searches.deactivateSearchesByTeam(Long.parseLong(id));
                            matches.cancelMatchesByTeam(Long.parseLong(id));
                        }
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
        authorizedPost(CONFIRM_MATCH_ROUTE, (req, res) -> {
            //supongo que el team id y el match id estan en el query params
            //`${restApiEndpoint}/updateTeam?teamid=${teamid}&matchid=${matchid}`
            final Long team_id = Long.valueOf(req.queryParams("teamid"));
            final Long match_id = Long.valueOf(req.queryParams("matchid"));
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final EntityManager entityManager1 = entityManagerFactory.createEntityManager();
            final Matches matches = new Matches(entityManager);
            final Teams teams = new Teams(entityManager1);
            boolean state = system.confirmMatch(match_id, team_id);
            if (state) {
                res.status(200);
                matches.findMatch(match_id).ifPresent(
                    (match) -> {
                        teams.getTeamByTeamId(team_id).ifPresent(
                            (team) -> {
                                system.createNotificationWithSearch(match.getTeam1().equals(team) ? match.getSearch2() : match.getSearch1(),
                                        String.format("%s has confirmed the match for %d/%d", team.getName(), match.getDay(), match.getMonth() + 1),
                                        match.isConfirmed() ? 3 : 1, team.getId());
                            }
                        );
                    }
                );
            } else res.status(400);
            return res.status();
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
        get(GET_TEAM_BY_TEAMID_ROUTE, (req, res) -> {
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final Teams teams = new Teams(entityManager);
            final String id = (req.queryParams("teamId"));
            Optional<Team> team = teams.findTeamsById(id);
            if (team.isPresent()) {
                res.body(toJson(team));
                res.status(200);
            } else {
                res.status(400);
            }
            return res.body();
        });
        authorizedPost(DEACTIVATE_SEARCH_ROUTE, (req, res) -> {
            final Long id = Long.valueOf(req.queryParams("id"));
            boolean state = system.deactivateSearch(id);
            if (state){
                res.status(200);
            }
            else res.status(400);
            return res.status();

        });
        authorizedGet(GET_MATCHES_BY_TEAMID_ROUTE, (req, res) -> {
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final Long team_id = Long.valueOf(req.queryParams("teamid"));
            final Matches matches = new Matches(entityManager);
            List<Match> matchesList = matches.findMatchesByTeamId(team_id);
            List<PendingMatch> pendingMatches = matchesList.stream().map(match -> {
                final PendingMatch pendingMatch = new PendingMatch();


                pendingMatch.day = match.getDay() + "/" + (match.getMonth()+1);
                pendingMatch.time = match.getTime();
                pendingMatch.id = match.getId();

                pendingMatch.isConfirmed = match.isConfirmed();

                if (team_id == match.getTeam1().getId()) {
                    pendingMatch.team1 = match.getTeam1().asDto();
                    pendingMatch.team2 = match.getTeam2().asDto();

                    pendingMatch.team1Confirmed = match.isConfirmed_by_1();
                    pendingMatch.team2Confirmed = match.isConfirmed_by_2();
                } else {
                    pendingMatch.team1 = match.getTeam2().asDto();
                    pendingMatch.team2 = match.getTeam1().asDto();

                    pendingMatch.team1Confirmed = match.isConfirmed_by_2();
                    pendingMatch.team2Confirmed = match.isConfirmed_by_1();
                }

                return pendingMatch;
            }).toList();

            res.body(toJson(pendingMatches));

            return res.body();
        });


        authorizedGet(GET_CONTACTS_BY_TEAMID_ROUTE, (req, res) -> {
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final Long team_id = Long.valueOf(req.queryParams("teamid"));
            final Contacts contacts = new Contacts(entityManager);
            List<Contact> contactsList = contacts.findContactsByTeamId(team_id);
            List<dto.Contact> contactListDto = contactsList.stream().map(contact -> {
                final dto.Contact DTOcontact = new dto.Contact();

                DTOcontact.id = contact.getId();

                if (team_id == contact.getTeam1().getId()) {
                    DTOcontact.team1 = contact.getTeam1().asDto();
                    DTOcontact.team2 = contact.getTeam2().asDto();
                } else {
                    DTOcontact.team1 = contact.getTeam2().asDto();
                    DTOcontact.team2 = contact.getTeam1().asDto();
                }

                return DTOcontact;
            }).toList();
            res.body(toJson(contactListDto));
            return res.body();
        });

//        authorizedGet(IS_TEAM_1_OR_2_ROUTE, (req, res) -> {
//            final EntityManager entityManager = entityManagerFactory.createEntityManager();
//            final Long matchId = Long.valueOf(req.queryParams("matchid"));
//            final Long teamId = Long.valueOf(req.queryParams("teamid"));
//            final Matches matches = new Matches(entityManager);
//            final Optional<Match> match = matches.getMatchById(matchId);
//            if (match.isPresent()) {
//                if (matches.teamOneOrTeam2(matchId, teamId)) {
//                    res.body(toJson(match.get().getTeam2().getName()));
//                } else res.body(toJson(match.get().getTeam1().getName()));
//                res.status(200);
//
//            } else res.status(404);
//            return res.body();
//
//
//        });
        authorizedPost(DECLINE_MATCH_ROUTE, (req, res) -> {
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final EntityManager entityManager1 = entityManagerFactory.createEntityManager();
            final Teams teams = new Teams(entityManager);
            final Matches matches = new Matches(entityManager1);
            final Long matchId = Long.valueOf(req.queryParams("matchid"));
            final Long teamId = Long.valueOf(req.queryParams("teamid"));
            matches.getMatchById(matchId).ifPresent(
                    (match) -> {
                        teams.getTeamByTeamId(teamId).ifPresent(
                                (team) -> {
                                    final boolean status = system.declineMatch(matchId, teamId);
                                    if (status) {
                                        res.status(200);
                                        if(match.getTeam1().equals(team))
                                            system.createNotificationWithTeam(match.getTeam2(),
                                                String.format("%s has decline the match with %s for %d/%d", team.getName(),
                                                        match.getTeam2().getName(), match.getDay(), match.getMonth()),
                                                4, team.getId());
                                        else
                                            system.createNotificationWithTeam(match.getTeam1(),
                                                    String.format("%s has decline the match with %s for %d/%d", team.getName(),
                                                            match.getTeam1().getName(), match.getDay(), match.getMonth()),
                                                    4, team.getId());

                                    } else res.status(404);
                                }
                        );
                    }
            );

            return res.status();


        });
        authorizedGet(GET_CONFIRMED_MATCHES_BY_TEAM_ROUTE, (req, res) -> {
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final Long teamId = Long.valueOf(req.queryParams("teamid"));
            final Matches matches = new Matches(entityManager);
            final Searches searches = new Searches(entityManager);
            List<Match> matchesList = matches.confirmedMatches(teamId);
            List<ConfirmedMatch> confirmedMatches = matchesList.stream().map(match -> {
                        final ConfirmedMatch confirmedMatch = new ConfirmedMatch();
                        confirmedMatch.time = match.getTime();
                        confirmedMatch.day = match.getSearch1().getDay();
                        confirmedMatch.month=match.getSearch1().getMonth();
                        confirmedMatch.year = match.getSearch1().getYear();

                        Point2D.Double coordinates = searches.getMiddlePoint(match.getSearch1().getLatitude(), match.getSearch1().getLongitude(), match.getSearch2().getLatitude(), match.getSearch2().getLongitude());
                        confirmedMatch.latitude = coordinates.x;
                        confirmedMatch.longitude = coordinates.y;
                        confirmedMatch.id = match.getId();
                        if (teamId == match.getTeam1().getId()) {
                            confirmedMatch.rival = match.getTeam2().asDto();
                        } else {
                            confirmedMatch.rival = match.getTeam1().asDto();
                        }

                    return confirmedMatch;
            }
            ).toList();
            res.status(200);

            res.body(toJson(confirmedMatches));
            return res.body();

        });
//        authorizedPost(DECLINE_MATCH_ROUTE, (req,res) ->{
//            final EntityManager entityManager = entityManagerFactory.createEntityManager();
//            final Long team_id = Long.valueOf(req.queryParams("teamid"));
//            final Long match_id = Long.valueOf(req.queryParams("matchid"));
//            final Matches matches = new Matches(entityManager);
//
//
//        });


    }

    private void transformNotifications(Response res, List<Notification> notificationsList) {
        List<dto.Notification> dtoNotifications = notificationsList.stream().map(notification -> {
            final dto.Notification dtoNotification = new dto.Notification();
            dtoNotification.code_id = notification.getCode_id();
            dtoNotification.message = notification.getMessage();
            dtoNotification.opened = notification.isOpened();
            dtoNotification.id = notification.getId();
            dtoNotification.team_id = notification.getTeam_id();
            return dtoNotification;
        }).toList();

        res.status(200);
        res.body(toJson(dtoNotifications));
    }
    private void transformMessages(Response res, List<Message> messageList) {
        List<dto.Message> dtoMessages = messageList.stream().map(message -> {
            final dto.Message dtoMessage = new dto.Message();
            dtoMessage.team_id = message.getTeamID();
            dtoMessage.team_name = message.getTeamName();
            dtoMessage.contact_id = message.getIDContact();
            dtoMessage.text = message.getText();
            dtoMessage.minute = message.getMinute();
            dtoMessage.hour = message.getHour();
            dtoMessage.id = message.getId();
            return dtoMessage;
        }).toList();

        res.status(200);
        res.body(toJson(dtoMessages));
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
                    Team.create("river", "Football", "11", "Young", userList.get(0));
            final Team cocaTeam =
                    Team.create("depo", "Football", "11", "Young", userList.get(1));
            final Team ferpaTeam =
                    Team.create("pincha", "Football", "11", "Young", userList.get(2));
            teams.persist(kateTeam);
            teams.persist(cocaTeam);
            teams.persist(ferpaTeam);
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
            final Search ferpaSearch =
                    Search.create(teamList.get(2), Date.from(Instant.now()), "Afternoon", "-35.456884", "-58.858952");
            searches.persist(kateSearch);
            searches.persist(cocaSearch);
            searches.persist(ferpaSearch);
        }
        tx.commit();
        entityManager.close();
    }

    private static String capitalized(String name) {
        return Strings.isNullOrEmpty(name) ? name : name.substring(0, 1).toUpperCase() + name.substring(1).toLowerCase();
    }

}







