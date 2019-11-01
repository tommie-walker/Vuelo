package com.vuelo.Helicopter20;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
public class HelicopterController {
    @Autowired
    private
    HelicopterRepository helicopterRepository;

    @RequestMapping("/")
    public String index() {
        return "Greetings from Spring Boot!";
    }

    @RequestMapping("/api/helicopter")
    public  String getAllHelicopters() throws JsonProcessingException {
        List<Helicopter> h = helicopterRepository.findAll();
        //Output to front end
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.writeValueAsString(h);
    }

<<<<<<< Updated upstream
=======
     @DeleteMapping ("/api/helicopter/{_id}")
     public void delete(@PathVariable String _id){
        helicopterRepository.deleteById(_id);
     }
     @PutMapping("/api/helicotper/{_id}")


>>>>>>> Stashed changes
    @PostMapping("/api/helicopter")
    public Helicopter createHelicopter(@RequestBody Helicopter heli, HttpServletRequest httpRequest, HttpServletResponse httpResponse) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        httpResponse.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS, DELETE");
        httpResponse.setHeader("Access-Control-Allow-Headers", "*");
        httpResponse.setHeader("Access-Control-Allow-Credentials", "true");
        httpResponse.setHeader("Access-Control-Max-Age", "4800");
        objectMapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
            helicopterRepository.insert(heli);
            return heli;
    }

    @RequestMapping("/Helicopter/{model}")
    public  String getHelicopterByModel(@PathVariable String model){
        Helicopter h = helicopterRepository.findByModel(model);
        return h.toString();
    }
}
