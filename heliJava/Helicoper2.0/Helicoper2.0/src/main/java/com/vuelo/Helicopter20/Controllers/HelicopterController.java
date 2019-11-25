package com.vuelo.Helicopter20.Controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.vuelo.Helicopter20.Entities.Helicopter;
import com.vuelo.Helicopter20.Repositories.HelicopterRepository;
import com.vuelo.Helicopter20.Services.HelicopterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

//---------------------------------------------
//todo: for every helicopter interaction, call the newSession(String email) function.

//===============================================

@CrossOrigin
@RestController
public class HelicopterController {
    @Autowired
    private
    HelicopterRepository helicopterRepository;

    @Autowired
    HelicopterService heliService;

    //Get all the helicoipters
    @RequestMapping("/api/helicopter")
    public  String getAllHelicopters() throws JsonProcessingException {
        List<Helicopter> h = helicopterRepository.findAll();
        //Output to front end
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.writeValueAsString(h);
    }
    @RequestMapping("/api/helicopter/getOne/{_id}")
    public  String getAllHelicopters(@PathVariable String _id) throws JsonProcessingException {
        Helicopter h = helicopterRepository.findBy_id(_id);
        //Output to front end
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.writeValueAsString(h);
    }

    //delete an existing helicopter
    @DeleteMapping ("/api/helicopter/{_id}")
    public void delete(@PathVariable String _id){
        helicopterRepository.deleteById(_id);
     }

     //Creating a new helicopter
    @PostMapping("/api/helicopter")
    public Helicopter createHelicopter(@RequestBody Helicopter heli, HttpServletRequest httpRequest, HttpServletResponse httpResponse) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        httpResponse.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS, DELETE");
        httpResponse.setHeader("Access-Control-Allow-Headers", "*");
        httpResponse.setHeader("Access-Control-Allow-Credentials", "true");
        httpResponse.setHeader("Access-Control-Max-Age", "4800");
        objectMapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
        return heliService.duplicateCheck(heli);
    }
//updating helicopter
    @PatchMapping("/api/helicopter/{_id}/{username}")
    Helicopter updateHelicopter(@PathVariable String _id, @RequestBody Helicopter heli){
        return heliService.updateHelicopter(_id, heli);
    }
//finds a specific helicopter model
    @RequestMapping("/Helicopter/{model}")
        public  String getHelicopterByModel(@PathVariable String model){
            Helicopter h = helicopterRepository.findByModelIgnoreCase(model);
            return h.toString();
    }
//Returns users favorite helicopter
    @RequestMapping("/api/helicopter/favorites/{username}")
    public List<Helicopter> getFavoriteHelicopters(@PathVariable String username){
        return heliService.getFavoritesByUserUsername(username);
    }
}
