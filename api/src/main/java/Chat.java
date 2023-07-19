import java.text.SimpleDateFormat;
import java.util.Date;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.eclipse.jetty.websocket.api.Session;
import org.json.JSONObject;

import static spark.Spark.*;

public class Chat {

    static Map<Session, String> userUsernameMap = new ConcurrentHashMap<>();
    static Map<String, List<Session>> usernameSessionMap = new ConcurrentHashMap<>();
    static int nextUserNumber = 1;

    public static void main(String[] args) {
        staticFiles.location("/public");
        staticFiles.expireTime(600);
        webSocketIdleTimeoutMillis(1800000);
        webSocket("/chat", ChatWebSocketHandler.class);
        init();
    }

    public static void broadcastMessage(String sender, String message, Session senderSession) {
        userUsernameMap.keySet().stream().filter(Session::isOpen).forEach(session -> {
            try {
                boolean isCurrentUser = session.equals(senderSession);
                session.getRemote().sendString(String.valueOf(new JSONObject()
                        .put("userMessage", createJsonMessageFromSender(sender, message, isCurrentUser))
                        .put("userList", userUsernameMap.values())
                ));
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
    }

    public static void privateMessage(String sender, String message, Session senderSession, Session receiverSession) {
        if (receiverSession.isOpen()) {
            try {
                boolean isCurrentUser = receiverSession.equals(senderSession); // Realmente no se para qué sirve esto.
                receiverSession.getRemote().sendString(String.valueOf(new JSONObject()
                        .put("userMessage", createJsonMessageFromSender(sender, message, isCurrentUser))
                        .put("userList", userUsernameMap.values())
                ));

            } catch (Exception e) {
                e.printStackTrace();
            }
        } else {
            // Store the message in the database or perform any necessary handling for inactive receiver session
            System.out.println("Receiver session is not open. Store the message or perform other actions.");
            // Actually, it should always be open, but just in case.
        }
    }
    public static void privateMessage(String sender, String message, Session senderSession) {
        try {
            senderSession.getRemote().sendString(String.valueOf(new JSONObject()
                    .put("userMessage", createJsonMessageFromSender(sender, message, true))
                    .put("userList", userUsernameMap.values())
            ));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static String createHtmlMessageFromSender(String sender, String message, boolean isCurrentUser) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("HH:mm:ss");
        String timestamp = dateFormat.format(new Date());

        StringBuilder htmlBuilder = new StringBuilder();
        htmlBuilder
                .append("<article class=\"")
                .append(isCurrentUser ? "current-user" : "other-user")
                .append("\">")
                .append("<b>").append(sender).append(" says:</b>")
                .append("<p>").append(message).append("</p>").append("<span class=\"timestamp\">").append(timestamp).append("</span>")
                .append("</article>");

        return htmlBuilder.toString();
    }
    private static JSONObject createJsonMessageFromSender(String sender, String message, boolean isCurrentUser) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("HH:mm:ss");
        String timestamp = dateFormat.format(new Date());

        JSONObject jsonMessage = new JSONObject();
        jsonMessage.put("sender", sender);
        jsonMessage.put("message", message);
        jsonMessage.put("isCurrentUser", isCurrentUser); // no me sirve la verdad
        jsonMessage.put("timestamp", timestamp);

        return jsonMessage;
    }

    // si tengo seleccionado boca en vez de pincha los mensajes de river a pincha solo se guardan en la db.

}
