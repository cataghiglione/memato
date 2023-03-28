import repository.Teams;
import repository.Users;

import javax.persistence.EntityManager;

public class MySystemRepository {

    private final Users users;
    private final Teams teams;

    public MySystemRepository(EntityManager entityManager) {
        this.users = new Users(entityManager);
        this.teams=new Teams(entityManager);
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

}
