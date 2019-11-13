package com.vuelo.Helicopter20.Repositories;


import com.vuelo.Helicopter20.Entities.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    //call to return user info
    User findByUsername(String username);
}
