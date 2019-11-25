package com.vuelo.Helicopter20.Entities;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Document(collection = "User")
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class User {
        String email;
        String _id;
        @Field
        List<String> favorites;
        String role;
        String username;

}
