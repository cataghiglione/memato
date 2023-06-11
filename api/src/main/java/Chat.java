import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.eclipse.jetty.websocket.api.Session;
import org.json.JSONObject;

import static spark.Spark.*;

public class Chat {

    static Map<Session, String> userUsernameMap = new ConcurrentHashMap<>();
    static Map<String, Session> usernameSessionMap = new ConcurrentHashMap<>();
    static int nextUserNumber = 1;

    public static void main(String[] args) {
        staticFiles.location("/public");
        staticFiles.expireTime(600);
        webSocket("/chat", ChatWebSocketHandler.class);
        init();
    }

    public static void broadcastMessage(String sender, String message, Session senderSession) {
        userUsernameMap.keySet().stream().filter(Session::isOpen).forEach(session -> {
            try {
                boolean isCurrentUser = session.equals(senderSession);
                session.getRemote().sendString(String.valueOf(new JSONObject()
                        .put("userMessage", createHtmlMessageFromSender(sender, message, isCurrentUser))
                        .put("userList", userUsernameMap.values())
                ));
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
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

}
