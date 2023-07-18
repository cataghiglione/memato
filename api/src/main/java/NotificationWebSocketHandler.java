import model.CreateNotificationWSForm;
import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.annotations.*;
import repository.Searches;
import repository.Teams;
import repository.Users;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import java.util.concurrent.atomic.AtomicLong;
import java.util.concurrent.atomic.AtomicReference;

import static spark.Spark.before;
import static spark.Spark.get;

@WebSocket
public class NotificationWebSocketHandler {

    private String sender, msg;
//    private final EntityManagerFactory factory = Persistence.createEntityManagerFactory("rmatch");

    @OnWebSocketConnect
    public void onConnect(Session user) throws Exception {
        String username = "User" + Chat.nextUserNumber++;
        NotificationService.userUsernameMap.put(user, username);
    }

    @OnWebSocketClose
    public void onClose(Session user, int statusCode, String reason) {
        String username = NotificationService.userUsernameMap.get(user);
        NotificationService.userUsernameMap.remove(user);
    }

    @OnWebSocketMessage
    public void onMessage(Session user, String message) {
        if(message.contains("TeamId:") && !message.substring(7).equals("0")){
            NotificationService.userIdMap.put(NotificationService.system.findTeamById(message.substring(7)).get().getUserId(), user);
        }
        else if(message.contains("CloseTeamId:")&& !message.substring(12).equals("0")){
            NotificationService.userIdMap.remove(NotificationService.system.findTeamById(message.substring(12)).get().getUserId());
        }

        else{
            CreateNotificationWSForm wsForm = CreateNotificationWSForm.createFromJson(message);
            if(wsForm.getSearch_id() == null){
                NotificationService.privateMessage(findUserByTeam(wsForm.getTeam_id()), "NOTIFICATION! \n" + wsForm.getMessage());
            }
            else{
                NotificationService.privateMessage(findUserBySearch(wsForm.getCandidate_search_id()), "NOTIFICATION! \n" + "nueva notificacion por medio de search");
            }
        }
        Chat.broadcastMessage(Chat.userUsernameMap.get(user), message, user); // Pass the user Session as an argument
    }

    private long findUserBySearch(Long searchId){
        AtomicLong user_id = new AtomicLong();
        NotificationService.system.findSearchById(searchId).ifPresent(
            (search) -> {
                user_id.set(search.getTeam().getUserId());
            });
        return user_id.get();
    }
    private long findUserByTeam(Long teamId){
        AtomicLong user_id = new AtomicLong();
        NotificationService.system.findTeamById(String.valueOf(teamId)).ifPresent(
            (team) -> {
                user_id.set(team.getUserId());
            });
        return user_id.get();
    }

    private String getMessage(CreateNotificationWSForm form){
        AtomicReference<String> msg = new AtomicReference<>();
        NotificationService.system.findSearchById(form.getSearch_id()).ifPresent(
            (search1) -> {
                NotificationService.system.findSearchById(form.getCandidate_search_id()).ifPresent(
                    (search2) -> {
                        NotificationService.system.createMatch(search1, search2).ifPresentOrElse(
                            (match) -> {
                                msg.set(String.format("Good news! %s wants to play with %s on %d/%d", search1.getTeam().getName(), search2.getTeam().getName(), search2.getDate().getDate(), search2.getDate().getMonth() + 1));
                            },
                            ()->{
                                msg.set("A match with this searches already exists");
                            }
                        );
                    }
                );
            });
        return msg.get();
    }

}
