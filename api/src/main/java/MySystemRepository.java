import repository.Searches;
import repository.Teams;
import repository.Users;

import javax.persistence.EntityManager;

public class MySystemRepository {

    private final Users users;
    private final Teams teams;
    private final Searches searches;

    public MySystemRepository(EntityManager entityManager) {
        this.users = new Users(entityManager);
        this.teams=new Teams(entityManager);
        this.searches = new Searches(entityManager);
    }

    public static MySystemRepository create(EntityManager entityManager) {
        return new MySystemRepository(entityManager);
    }

    public Users users() {
        return users;
    }
    public Teams teams(){
        return teams;
    }

    public Searches searches() {
        return searches;
    }
}
