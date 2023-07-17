import org.eclipse.jetty.websocket.api.Session;
import spark.Spark;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import static spark.Spark.*;

public class MySystemService {

    private final Routes routes = new Routes();

    // this map is shared between sessions and userIds
    static Map<Session, Long> userUsernameMap = new ConcurrentHashMap<>();

    public void start() {
//        staticFiles.location("public");
//        startWebSocket();
        startWebServer();
    }


    public void stop() {
        stopWebServer();
    }

    private void startWebServer() {
        staticFiles.location("public");
        port(4326);
        final MySystem system = MySystem.create("rmatch");
        NotificationService.startNotificationServer(system);
        routes.create(system);
    }
    private void startWebSocket() {
        webSocket("/notificationServer", ChatWebSocketHandler.class);
        init();
    }

    private void stopWebServer() {
        Spark.stop();
    }

}
