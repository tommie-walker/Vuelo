//package com.vuelo.Helicopter20.Test.Services;
//

//        import com.vuelo.Helicopter20.Entities.Helicopter;
//        import com.vuelo.Helicopter20.Entities.User;
//        import com.vuelo.Helicopter20.Repositories.HelicopterRepository;
//        import com.vuelo.Helicopter20.Repositories.UserRepository;
//        import com.vuelo.Helicopter20.Services.HelicopterService;
//        import org.junit.Before;
//        import org.junit.jupiter.api.Test;
//        import org.mockito.Mockito;
//        import org.mockito.MockitoAnnotations;
//
//        import java.util.ArrayList;
//        import java.util.List;
//
//        import static org.junit.jupiter.api.Assertions.assertEquals;
//        import static org.mockito.ArgumentMatchers.any;
//        import static org.mockito.ArgumentMatchers.anyString;
//        import static org.mockito.Mockito.doNothing;
//        import static org.mockito.Mockito.when;

//
//public class HelicopterServiceTest {
//
//    private HelicopterRepository helicopterRepository = Mockito.mock(HelicopterRepository.class);
//
//    private UserRepository userRepository = Mockito.mock(UserRepository.class);

//    HelicopterService helicopterService = new HelicopterService(userRepository, helicopterRepository);
//    @Before


//    public void init(){
//        MockitoAnnotations.initMocks(this);
//    }
//
//    @Test
//    public void updateHelicopterTest(){
//        Helicopter heli = Helicopter.builder()
//                ._id("id")
//                .capacityWeight("capacityWeight")
//                .crewMax("crewMax")
//                .crewMin("crewMin")
//                .fuselageLength("fuselageLength")
//                .height("height")
//                .maxSpeed("maxSpeed")
//                .model("model")
//                .rotorDiameter("rotorDiameter")
//                .type("type")
//                .url("url")
//                .build();
//
//        when(helicopterRepository.findBy_id(anyString())).thenReturn(heli);
//
//        Helicopter heliUpdate = Helicopter.builder()
//                .capacityWeight("capacityWeightUpdate")
//                .crewMax("crewMaxUpdate")
//                .crewMin("crewMinUpdate")
//                .fuselageLength("fuselageLengthUpdate")
//                .height("heightUpdate")
//                .maxSpeed("maxSpeedUpdate")
//                .model("modelUpdate")
//                .rotorDiameter("rotorDiameterUpdate")
//                .type("typeUpdate")
//                .build();
//
//        Helicopter heliResult = helicopterService.updateHelicopter("id", heliUpdate);
//
//        assertEquals("id", heliResult.get_id());
//        assertEquals("capacityWeightUpdate", heliResult.getCapacityWeight());
//        assertEquals("crewMaxUpdate", heliResult.getCrewMax());
//        assertEquals("crewMinUpdate", heliResult.getCrewMin());
//        assertEquals("fuselageLengthUpdate", heliResult.getFuselageLength());
//        assertEquals("heightUpdate", heliResult.getHeight());
//        assertEquals("maxSpeedUpdate", heliResult.getMaxSpeed());
//        assertEquals("modelUpdate", heliResult.getModel());
//        assertEquals("rotorDiameterUpdate", heliResult.getRotorDiameter());
//        assertEquals("typeUpdate", heliResult.getType());
//        assertEquals("url", heliResult.getUrl());
//    }
//    @Test
//    public void helicopterNotInDBTest(){
//
//        when(helicopterRepository.findBy_id(anyString())).thenReturn(null);
//        Helicopter heli = Helicopter.builder()
//                .capacityWeight("capacityWeight")
//                .crewMax("crewMax")
//                .crewMin("crewMin")
//                .fuselageLength("fuselageLength")
//                .height("height")
//                .maxSpeed("maxSpeed")
//                .model("model")
//                .rotorDiameter("rotorDiameter")
//                .type("type")
//                .url("url")
//                .build();
//
//        when(helicopterRepository.save(any())).thenReturn(heli);
//
//        Helicopter heliResult = helicopterService.updateHelicopter("wrongID", heli);
//        assertEquals("capacityWeight", heliResult.getCapacityWeight());
//        assertEquals("crewMax", heliResult.getCrewMax());
//        assertEquals("crewMin", heliResult.getCrewMin());
//        assertEquals("fuselageLength", heliResult.getFuselageLength());
//        assertEquals("height", heliResult.getHeight());
//        assertEquals("maxSpeed", heliResult.getMaxSpeed());
//        assertEquals("model", heliResult.getModel());
//        assertEquals("rotorDiameter", heliResult.getRotorDiameter());
//        assertEquals("type", heliResult.getType());
//        assertEquals("url", heliResult.getUrl());
//    }
//
//    @Test
//    public void getFavoritesByUserUsernameTest(){
//
//        List<String> fav = new ArrayList<>();
//        fav.add("HC.2");
//        fav.add("UH-60A");
//        User user = User.builder().email("email").role("user").username("username").favorites(fav).build();
//
//        Helicopter heli = Helicopter.builder().capacityWeight("capacityWeight").crewMax("crewMax")
//                .crewMin("crewMin").fuselageLength("fuselageLength").height("height").maxSpeed("maxSpeed")
//                .model("test").rotorDiameter("rotorDiameter").type("tester").url("url").build();
//
//        Helicopter heli2 = Helicopter.builder().capacityWeight("capacityWeight").crewMax("crewMax").crewMin("crewMin")
//                .fuselageLength("fuselageLength").height("height").maxSpeed("maxSpeed").model("test2")
//                .rotorDiameter("rotorDiameter").type("tester2").url("url").build();
//
//        when(userRepository.findByUsername(any())).thenReturn(user);

//        when(helicopterRepository.findByModelIgnoreCase("UH-60A")).thenReturn(heli);
//        when(helicopterRepository.findByModelIgnoreCase("HC.2")).thenReturn(heli2);

//
//        List<Helicopter> heliList = new ArrayList<>();
//        heliList.add(heli2);
//        heliList.add(heli);
//

//        assertEquals(heliList,helicopterService.getFavoritesByUserUsername(user.getUsername()));
//
//    }
//
//    @Test
//    public void duplicateCheckExistsTest(){
//        //create test heli
//        Helicopter dataHeli = Helicopter.builder()
//                .model("data")
//                .type("data")
//                .height("data")
//                .crewMax("data")
//                .capacityWeight("data")
//                .crewMin("data")
//                .fuselageLength("data")
//                .maxSpeed("data")
//                .rotorDiameter("data")
//                .build();
//
//        Helicopter testHeli = Helicopter.builder()
//                .model("data")
//                .type("test")
//                .height("test")
//                .crewMax("test")
//                .capacityWeight("test")
//                .crewMin("test")
//                .fuselageLength("test")
//                .maxSpeed("test")
//                .rotorDiameter("test")
//                .build();
//
//        when(helicopterRepository.findByModelIgnoreCase(testHeli.getModel())).thenReturn(dataHeli);
//        assertEquals(dataHeli, helicopterService.duplicateCheck(testHeli));
//    }
//    @Test
//    public void duplicateDoesntExistTest(){
//        Helicopter testHeli = Helicopter.builder()
//                .model("test")
//                .type("test")
//                .height("test")
//                .crewMax("test")
//                .capacityWeight("test")
//                .crewMin("test")
//                .fuselageLength("test")
//                .maxSpeed("test")
//                .rotorDiameter("test")
//                .build();
//
//        when(helicopterRepository.findByModelIgnoreCase(testHeli.getModel())).thenReturn(null);
//        assertEquals(testHeli, helicopterService.duplicateCheck(testHeli));
//
//    }

//}