package com.vuelo.Helicopter20.Services;

import com.vuelo.Helicopter20.Entities.Helicopter;
import com.vuelo.Helicopter20.Entities.User;
import com.vuelo.Helicopter20.Repositories.HelicopterRepository;
import com.vuelo.Helicopter20.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class HelicopterService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HelicopterRepository helicopterRepository;


    //find user then create list of their favorite helicopter
    public List<Helicopter> getFavoritesByUserUsername(String username){
        User user = userRepository.findByUsername(username);
        List<Helicopter> helicopters = new ArrayList<>();
        for(String models : user.getFavorites()){
            helicopters.add(helicopterRepository.findByModel(models));
        }
        return helicopters;
    }

//update helicopter fields/info
    public Helicopter updateHelicopter(String id, Helicopter heli){
        Optional<Helicopter> h = Optional.of(helicopterRepository.findById(id).get());
        if(h.isPresent()){
            Helicopter update = helicopterRepository.findById(id).get();
            update.setModel(heli.getModel());
            update.setType(heli.getType());
            update.setCapacityWeight(heli.getCapacityWeight());
            update.setCrewMax(heli.getCrewMax());
            update.setCrewMin(heli.getCrewMin());
            update.setFuselageLength(heli.getFuselageLength());
            update.setHeight(heli.getHeight());
            update.setRotorDiameter(heli.getRotorDiameter());
            update.setMaxSpeed(heli.getMaxSpeed());
            helicopterRepository.save(update);
            return update;
        }else{
            return heli;
        }
    }
}
