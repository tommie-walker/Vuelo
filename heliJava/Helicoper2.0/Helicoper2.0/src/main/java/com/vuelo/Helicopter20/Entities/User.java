package com.vuelo.Helicopter20.Entities;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Document(collection = "User")
@Builder
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class User {
        String _id;
        String passwordHash;
        String passwordSalt;
        @Field
        String email;
        List<String> favorites;
        String role;
}
