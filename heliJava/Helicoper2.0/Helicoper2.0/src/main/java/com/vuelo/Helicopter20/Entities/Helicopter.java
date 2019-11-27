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
@Setter
@Getter
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Helicopter that = (Helicopter) o;
        return Objects.equals(type, that.type) &&
                model.equals(that.model) &&
                Objects.equals(capacityWeight, that.capacityWeight) &&
                Objects.equals(crewMax, that.crewMax) &&
                Objects.equals(crewMin, that.crewMin) &&
                Objects.equals(fuselageLength, that.fuselageLength) &&
                Objects.equals(height, that.height) &&
                Objects.equals(rotorDiameter, that.rotorDiameter) &&
                Objects.equals(maxSpeed, that.maxSpeed);
    }

    @Override
    public int hashCode() {
        return Objects.hash(type, model, capacityWeight, crewMax, crewMin, fuselageLength, height, rotorDiameter, maxSpeed);
    }


}
