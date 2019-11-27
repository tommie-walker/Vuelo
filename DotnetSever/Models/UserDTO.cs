using Newtonsoft.Json;
using System.Collections.Generic;

namespace RSIVueloAPI.Models
{
  public class UserDTO
  {
    [JsonProperty("_id")]
    public string Id { get; set; }
    [JsonProperty("username")]
    public string UserName { get; set; }

    [JsonProperty("password")]
    public string Password { get; set; }

    [JsonProperty("email")]
    public string Email { get; set; }

    [JsonProperty("favorites")]
    public List<string> favorites { get; set; }

    [JsonProperty("role")]
    public string Role { get; set; }

    [JsonProperty("session")]
    public string session { get; set; }

    [JsonProperty("token")]
    public string token { get; set; }

    [JsonProperty("heliId")]
    public string heliId { get; set; }

    [JsonProperty("model")]
    public string heliModel { get; set; }

    [JsonProperty("url")]
    public string heliUrl { get; set; }
    [JsonProperty("type")]
    public string heliType { get; set; }

    [JsonProperty("capacityWeight")]
    public string heliCap { get; set; }

    [JsonProperty("crewMax")]
    public string heliMax { get; set; }

    [JsonProperty("crewMin")]
    public string heliMin { get; set; }

    [JsonProperty("fuselageLength")]
    public string heliLength { get; set; }

    [JsonProperty("height")]
    public string heliHeight { get; set; }

    [JsonProperty("rotorDiameter")]
    public string heliRotor { get; set; }

    [JsonProperty("maxSpeed")]
    public string heliMaxSpeed { get; set; }
  }
}
