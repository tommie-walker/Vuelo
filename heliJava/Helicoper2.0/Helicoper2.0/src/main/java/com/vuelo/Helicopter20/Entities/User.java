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
        public String email;
        String _id;
        @Field
        List<String> favorites;
        String role;
        String username;

}
