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
      /*  Chat.userUsernameMap.put(user, username); // este debería borrarlo
        Chat.usernameSessionMap.put(username, user);
        Chat.broadcastMessage(sender = "Server", msg = (username + " joined the chat"), user); // Pass the user Session as an argument*/
    }

    @OnWebSocketClose
    public void onClose(Session user, int statusCode, String reason) {
        String username = Chat.userUsernameMap.get(user);
        Chat.userUsernameMap.remove(user);
        // en realidad quitamos la session de ese muchacho, acomodalo
        Chat.usernameSessionMap.remove(username);
    }

    @OnWebSocketMessage
    public void onMessage(Session user, String message) {
        JSONObject JSONMessage = new JSONObject(message);
        int count = JSONMessage.length();
        // if a user just connected. It ain't actually a message, it's just adding the user to the sessions maps.
        if(count == 1){
            String username = JSONMessage.getString("sender"); // username = sender
            Chat.userUsernameMap.put(user, username); // should actually delete this one.
            if(!Chat.usernameSessionMap.containsKey(username)){
                List<Session> sessions = new ArrayList<>();
                sessions.add(user);
                Chat.usernameSessionMap.put(username, sessions);
            }
            else{
                List<Session> sessions = Chat.usernameSessionMap.get(username);
                sessions.add(user);
                Chat.usernameSessionMap.put(username, sessions);
            }
            System.out.println(username); // idem
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
                }
                else{
                    Chat.privateMessage(sender, text, user);
                }
            }
            else{
                Chat.privateMessage(sender, text, user);
            }

            // TODO: Save and retrieve messages from DB
            // Agarrarlos ya lo hizo coni.
        }
    }

    public boolean userExistsOnMap(String username){
        return Chat.usernameSessionMap.containsKey(username);
    }



}
