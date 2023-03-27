package example;

import com.google.gson.Gson;
import model.User;
import repository.Users;
import spark.Spark;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;

public class Application {
    private static final Gson gson = new Gson();

    public static void main(String[] args) {

        final EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("rmatch");

        Spark.port(4326);

//        storedBasicUser(entityManagerFactory);


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


    }

//    private static void storedBasicUser(EntityManagerFactory entityManagerFactory) {
//        final EntityManager entityManager = entityManagerFactory.createEntityManager();
//        final Users users = new Users(entityManager);
//
//        EntityTransaction tx = entityManager.getTransaction();
//        tx.begin();
//        if (users.listAll().isEmpty()) {
//            final User kate =
//                    User.create("catuchi22@river.com", "91218","Catuchi","Ghi");
//            final User coke =
//                    User.create("cocaL@depo.com","1234","Coke","Lasa");
//
//            final User fercho =
//                    User.create("ferpalacios@remix.com","4321","Fercho","Palacios");
//
//            users.persist(kate);
//            users.persist(coke);
//            users.persist(fercho);
//        }
//        tx.commit();
//        entityManager.close();
//    }
}