package com.vuelo.Helicopter20.Services;

import com.vuelo.Helicopter20.Entities.Helicopter;
import com.vuelo.Helicopter20.Entities.User;
import com.vuelo.Helicopter20.Repositories.HelicopterRepository;
import com.vuelo.Helicopter20.Repositories.UserRepository;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

@Service
@AllArgsConstructor
@NoArgsConstructor
public class HelicopterService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HelicopterRepository helicopterRepository;


//
//    //todo: find users username and grab email. After create new instance in the session table with that users email
//    public void newSession(String username){
//        User user = userRepository.findByUsername(username);
//        String email = user.getEmail();
//        Session session = sessionRepository.findByUserEmail(email);
//        Calendar calendar = Calendar.getInstance();
//        calendar.add(Calendar.SECOND,30);
//        session.setExpire(calendar.getTime());
//    }

    public Helicopter duplicateCheck(Helicopter heli){
        Helicopter databaseHeli = helicopterRepository.findByModelIgnoreCase(heli.getModel().trim());
        if(databaseHeli != null){
                return databaseHeli;
            }else {
                helicopterRepository.insert(heli);
                return heli;
            }
        }

    //find user then create list of their favorite helicopter
    public List<Helicopter> getFavoritesByUserUsername(String username){
        User user = userRepository.findByUsername(username);
        List<Helicopter> helicopters = new ArrayList<>();
        for(String models : user.getFavorites()){
            helicopters.add(helicopterRepository.findByModelIgnoreCase(models));
        }
        return helicopters;
    }

    //update existing helicopter information
    public Helicopter updateHelicopter(String id, Helicopter heli){
        Helicopter h = helicopterRepository.findBy_id(id);
        if(h != null){
            Helicopter update = helicopterRepository.findBy_id(id);
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
            heli = helicopterRepository.save(heli);
            return heli;
        }
    }
}
