package com.vuelo.Helicopter20.Entities;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Document(collection = "Session")
@Builder
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Session {
        String _id;
        @Field
        String UserEmail;
        String SessionId;
        DateTimeFormat TimeStamp;
        DateTimeFormat Expire;
}