using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RSIVueloAPI.Models
{
    public class Session
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        [BsonElement(elementName: "_id")]
        public string Id { get; set; }

        [BsonElement(elementName: "UserEmail")]
        public string UserEmail { get; set; }

        [BsonElement(elementName: "SessionId")]
        public string SessionId { get; set; }

        [BsonElement(elementName: "JWTToken")]
        public string jwtToken { get; set; }

        [BsonElement(elementName: "TimeStamp")]
        public DateTime TimeStamp { get; set; }

        [BsonElement(elementName: "Expire")]
        public DateTime Expire { get; set; }
    }
}
