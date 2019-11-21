package com.vuelo.Helicopter20.Entities;
import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.Objects;

@Document(collection = "Helicopters")
@Getter
@Setter
@ToString
@AllArgsConstructor
@Builder
public class Helicopter {
    String _id;
    String type;
    @Field
    String model;
    String capacityWeight;
    String crewMax;
    String crewMin;
    String fuselageLength;
    String height;
    String rotorDiameter;
    String maxSpeed;
    String url;

}
