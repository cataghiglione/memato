import org.eclipse.jetty.websocket.api.Session;
import org.json.JSONObject;

import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;

import static spark.Spark.*;
import static spark.Spark.init;

public class NotificationService {

    static Map<Session, String> userUsernameMap = new ConcurrentHashMap<>();

    static Map<Long, Session> userIdMap = new ConcurrentHashMap<>();
    static MySystem system;
    public static void startNotificationServer(MySystem mySystem) {
        staticFiles.location("public"); //index.html is served at localhost:4567 (default port)
        staticFiles.expireTime(60000);
        webSocketIdleTimeoutMillis(1800000);
        webSocket("/notificationServer", NotificationWebSocketHandler.class);
        init();
        system = mySystem;
    }

    public static void privateMessage(Long user_id, String message) {
        try {
            Session session = userIdMap.get(user_id);
            if(session.isOpen()){
                session.getRemote().sendString(String.valueOf(new JSONObject()
                        .put("userMessage", message)
                ));
                System.out.println("WEB SOCKET ENVIANDO NOTIIII");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
