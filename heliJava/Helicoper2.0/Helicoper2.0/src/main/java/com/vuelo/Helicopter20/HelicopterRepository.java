package com.vuelo.Helicopter20;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HelicopterRepository extends MongoRepository<Helicopter, String> {
    Helicopter findByModel(String model);
    Optional<Helicopter> findById(String _id);
    List<Helicopter> findAll();
   Helicopter insert(Helicopter helicopter);
   void delete(Helicopter helicopter);
}