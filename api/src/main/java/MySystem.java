import model.*;
import repository.*;
import model.Team;

import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import java.text.ParseException;
import java.util.List;
import java.util.Optional;
import java.util.Properties;
import java.util.concurrent.atomic.AtomicReference;
import java.util.function.Function;


public class MySystem {

    private final EntityManagerFactory factory;

    private MySystem(EntityManagerFactory factory) {
        this.factory = factory;
    }

    public static MySystem create(String persistenceUnitName) {
        final EntityManagerFactory factory = Persistence.createEntityManagerFactory(persistenceUnitName);
        return new MySystem(factory);
    }

    public Optional<User> registerUser(RegistrationUserForm form) {
        return runInTransaction(datasource -> {
            final Users users = datasource.users();
            return users.exists(form.getEmail(), form.getUsername()) ? Optional.empty() : Optional.of(users.createUser(form));
        });
    }

    public Optional<Team> createTeam(CreateTeamForm form, User user) {
        return runInTransaction(datasource -> {
            final Teams teams = datasource.teams();
            return teams.exists(form.getName(), user) ? Optional.empty() : Optional.of(teams.createTeam(form, user));
        });

    }

    public Optional<Match> createMatch(Search search1, Search search2) {
        return runInTransaction(datasource -> {
            final Matches matches = datasource.matches();
            return matches.createMatch(search1, search2);
        });
    }
    public TimeInterval createTimeInterval(List<String> times){
        return runInTransaction(datasource->{
            final TimeIntervals timeIntervals = datasource.timeIntervals();
            return timeIntervals.createTimeInterval(times);
        });
    }

    public Optional<Search> findOrCreateSearch(CreateSearchForm form, Team team, TimeInterval time) {
        return runInTransaction(datasource -> {
            final Searches searches = datasource.searches();
            try {
                return searches.exists(Long.toString(team.getId()), time.getIntervals(), form.getDate(), form.getLatitude(), form.getLongitude(),form.getAge(), form.isRecurring()) ? searches.reactivateSearch(team, time.getIntervals(), form.getDate(), form.getLatitude(), form.getLongitude(), form.getAge(), form.isRecurring()) : Optional.of(searches.createSearch(team, form.getDate(), time.getIntervals(), form.getLatitude(), form.getLongitude(), form.getAge(), form.isRecurring()));
            } catch (ParseException e) {
                throw new RuntimeException(e);
            }
        });
    }
    public Notification createNotificationWithSearch(Search search2, String message, int code_id, long teamId1) {
        return runInTransaction(datasource -> {
            final Notifications notifications = datasource.notifications();
            long user_id = search2.getTeam().getUserId();
            final Users users = datasource.users();
            AtomicReference<Notification> notification = new AtomicReference<>();
            users.findById(user_id).ifPresentOrElse(
                    (user) -> {

                        if(code_id == 0 || code_id == 2)
                            notification.set(notifications.createNotificationWithTeamId(users.findById(user_id).get(), message, code_id, teamId1));

                        else
                            notification.set(notifications.createNotification(users.findById(user_id).get(), message, code_id));
                        NotificationService.privateMessage(user_id, message);
                        sendNotificationViaGmail(user.getEmail(), message);
                    },
                    () -> {
                        notification.set(new Notification());
                    }
            );
            return notification.get();
        });
    }
    public Notification createNotificationWithSearchId(Search search2, String message, int code_id, long searchId, long teamId) {
        return runInTransaction(datasource -> {
            final Notifications notifications = datasource.notifications();
            long user_id = search2.getTeam().getUserId();
            final Users users = datasource.users();
            AtomicReference<Notification> notification = new AtomicReference<>();
            users.findById(user_id).ifPresentOrElse(
                    (user) -> {

                        if(code_id == 5)
                            notification.set(notifications.createNotificationWithSearchId(users.findById(user_id).get(), message, code_id, searchId, teamId));

                        else
                            notification.set(notifications.createNotification(users.findById(user_id).get(), message, code_id));
                        NotificationService.privateMessage(user_id, message);
                        sendNotificationViaGmail(user.getEmail(), message);
                    },
                    () -> {
                        notification.set(new Notification());
                    }
            );
            return notification.get();
        });
    }
    public Notification createNotificationWithTeam(Team team, String message, int code_id, long otherTeamId) {
        return runInTransaction(datasource -> {
            final Notifications notifications = datasource.notifications();
            long user_id = team.getUserId();
            final Users users = datasource.users();
            AtomicReference<Notification> notification = new AtomicReference<>();
            users.findById(user_id).ifPresentOrElse(
                    (user) -> {
                        if(code_id == 0 || code_id == 2)
                            notification.set(notifications.createNotificationWithTeamId(users.findById(user_id).get(), message, code_id, team.getId()));
                        else
                            notification.set(notifications.createNotification(users.findById(user_id).get(), message, code_id));
                        NotificationService.privateMessage(user_id, message);
                        sendNotificationViaGmail(user.getEmail(), message);
                    },
                    () -> {
                        notification.set(new Notification());
                    }
            );
            return notification.get();
        });
    }
    public Optional<Notification> updateNotification(String id){
        return runInTransaction(datasource -> {
            final Notifications notifications = datasource.notifications();
            return notifications.changeStatusOpen(id);
        });
    }
    public boolean deactivateSearch(Long id){
        return runInTransaction(datasource ->{
            final Searches searches = datasource.searches();
            try{
                return searches.deactivateSearchBySearchId(id);
            }
            catch (Exception e){
                throw new RuntimeException(e);
            }
        });
    }
    public boolean confirmMatch(Long matchid, Long teamId){
        return runInTransaction(datasource ->{
            final Matches matches = datasource.matches();
            try{
                return matches.confirmMatchByTeam(matchid,teamId);
            }
            catch (Exception e){
                throw new RuntimeException(e);
            }
        });
    }
    public boolean declineMatch(Long matchid, Long teamid){
        return runInTransaction(datasource ->{
            final Matches matches = datasource.matches();
            try{
                return matches.declineMatchByTeam(matchid,teamid);
            }
            catch (Exception e){
                throw new RuntimeException(e);
            }
        });
    }


    public Optional<User> findUserByEmail(String email) {
        return runInTransaction(
                ds -> ds.users().findByEmail(email)
        );
    }
    public Optional<Team> findTeamById(String teamId) {
        return runInTransaction(
                ds -> ds.teams().findTeamsById(teamId)
        );
    }
    public Optional<Search> findSearchById(Long searchId) {
        return runInTransaction(
                ds -> ds.searches().getSearchById(searchId)
        );
    }

    public List<User> listUsers() {
        return runInTransaction(
                ds -> ds.users().list()
        );
    }
    public List<Notification> listNotifications(User user) {
        return runInTransaction(
                ds -> ds.notifications().list(user.getId())
        );
    }
    public List<Notification> listPendingNotifications(User user) {
        return runInTransaction(
                ds -> ds.notifications().listPending(user.getId())
        );
    }



    public boolean validPassword(String password, User foundUser) {
        // Super dummy implementation. Zero security
        return foundUser.getPassword().equals(password);
    }

    public Optional<Contact> findOrCreateContact(Team team1, Team team2) {
        return runInTransaction(datasource -> {
            final Contacts contacts = datasource.contacts();
            return contacts.exists(team1.getId(), team2.getId()) ? contacts.findContactByTeamsId(team1.getId(), team2.getId()) : contacts.createContact(team1, team2) ;
        });
    }

//    public Message sendMessage(CreateMessageForm form) {
//        return runInTransaction(datasource -> {
//            final Messages messages = datasource.messages();
//            return messages.createMessage(Long.parseLong(form.getTeam1_id()), Long.parseLong(form.getTeam2_id()), form.getDate(), form.getText());
//        });
//    }

    public List<Message> getMessages(long contactId) {
        return runInTransaction(datasource -> {
            final Messages messages = datasource.messages();
            return messages.getMessagesByContact(contactId);
        });
    }
    private <E> E runInTransaction(Function<MySystemRepository, E> closure) {
        final EntityManager entityManager = factory.createEntityManager();
        final MySystemRepository ds = MySystemRepository.create(entityManager);

        try {
            entityManager.getTransaction().begin();
            final E result = closure.apply(ds);
            entityManager.getTransaction().commit();
            return result;
        } catch (Throwable e) {
            e.printStackTrace();
            entityManager.getTransaction().rollback();
            throw e;
        } finally {
            entityManager.close();
        }
    }
    private static void sendNotificationViaGmail(String receiver, String emailText) {
        //La dirección de correo de envío
        String sender = "constanza.lasarte@ing.austral.edu.ar";
        //La clave de aplicación obtenida según se explica aquí:
        //https://www.campusmvp.es/recursos/post/como-enviar-correo-electronico-con-java-a-traves-de-gmail.aspx
        String password = "wizqbkzptvkphjkc";

        Properties props = System.getProperties();
        props.put("mail.smtp.host", "aspmx.l.google.com");  //El servidor SMTP de Google
        props.put("mail.smtp.user", sender);
        props.put("mail.smtp.password", password);    //La clave de la cuenta
        props.put("mail.smtp.auth", "true");    //Usar autenticación mediante usuario y clave
        props.put("mail.smtp.starttls.enable", "true"); //Para conectar de manera segura al servidor SMTP
        props.put("mail.smtp.port", "587"); //El puerto SMTP seguro de Google

        Session session = Session.getDefaultInstance(props);
        MimeMessage message = new MimeMessage(session);

        try {
            message.setFrom(new InternetAddress(sender));
            message.addRecipient(javax.mail.Message.RecipientType.TO, new InternetAddress(receiver));   //Se podrían añadir varios de la misma manera
            message.setSubject("Rival Match's Notification");
            message.setText(emailText);
            Transport transport = session.getTransport("smtp");
            transport.connect("smtp.gmail.com", sender, password);
            transport.sendMessage(message, message.getAllRecipients());
            transport.close();
            System.out.println("¡Correo enviado!");
        }
        catch (MessagingException me) {
            me.printStackTrace();   //Si se produce un error
        }
    }
}
