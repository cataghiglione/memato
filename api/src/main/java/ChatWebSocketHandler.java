import org.eclipse.jetty.websocket.api.*;
import org.eclipse.jetty.websocket.api.annotations.*;
import org.json.JSONObject;
import java.util.ArrayList;
import java.util.List;


@WebSocket
public class ChatWebSocketHandler {

    // apenas prendo el ws sender = props.teamid. Tiene que haber un await o algo asi?
    private String sender, msg;
    private Session session;

    @OnWebSocketConnect
    public void onConnect(Session user) throws Exception {
        session = user; // por ahora solo guardo la session
    }

    @OnWebSocketClose
    public void onClose(Session user, int statusCode, String reason) {
        String username = Chat.userUsernameMap.get(user);
        Chat.userUsernameMap.remove(user);
        Chat.usernameSessionMap.get(username).remove(user);
    }

    @OnWebSocketMessage
    public void onMessage(Session user, String message) {
        JSONObject JSONMessage = new JSONObject(message);
        int count = JSONMessage.length();
        // if a user just connected. It ain't actually a message, it's just adding the user to the sessions maps.
        if(count == 1){
            String username = JSONMessage.getString("sender"); // username = sender
            Chat.userUsernameMap.put(user, username); // should actually delete this one.
            List<Session> sessions;
            if(!Chat.usernameSessionMap.containsKey(username)){
                sessions = new ArrayList<>();
            }
            else{
                sessions = Chat.usernameSessionMap.get(username);
            }
            sessions.add(user);
            Chat.usernameSessionMap.put(username, sessions);
            System.out.println(Chat.usernameSessionMap.get(username).size());

        }
        // if it is an actual message:
        else{
            sender = (String) JSONMessage.get("sender");
            // si reciever session no existe guardar el mensaje en la bd. TO DO
            // si existe también mandarle el msj.
            String receiver = (String) JSONMessage.get("receiver");
            String text = (String) JSONMessage.get("content");

            // If target user is connected.
            if(userExistsOnMap(receiver)){
                if(Chat.usernameSessionMap.get(receiver).size() != 0 ){
                    for (Session s: Chat.usernameSessionMap.get(receiver)){
                        Chat.privateMessage(sender, text, user, s);
                    }
                    for (Session s: Chat.usernameSessionMap.get(sender)){
                        Chat.privateMessage(sender, text, s, s);
                    }
                }
                else{
                    for (Session s: Chat.usernameSessionMap.get(sender)){
                        Chat.privateMessage(sender, text, s, s);
                    }
                }
            }
            else{
                for (Session s: Chat.usernameSessionMap.get(sender)){
                    Chat.privateMessage(sender, text, s, s);
                }
            }

        }
    }

    public boolean userExistsOnMap(String username){
        return Chat.usernameSessionMap.containsKey(username);
    }



}
