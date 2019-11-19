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

    [JsonProperty("model")]
    public string heliModel { get; set; }


  }
}
