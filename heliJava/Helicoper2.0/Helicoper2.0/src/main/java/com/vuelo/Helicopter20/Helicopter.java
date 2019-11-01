package com.vuelo.Helicopter20;
import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.MongoId;

@Document(collection = "Helicopters")
@Builder
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
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
