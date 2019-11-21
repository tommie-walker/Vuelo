using Microsoft.AspNetCore.Http;
using RSIVueloAPI.Models;
using System;
using System.Collections.Generic;
using System.Security.Claims;

namespace RSIVueloAPI.Services
{
  public interface IUserService
  {
    bool CheckLoginToken(string email, out string exist);
    string GenerateJWT(UserDTO user);
    bool SaveSession(UserDTO user, string value, string jwt);
    void CreateDTO(User user, out UserDTO newDTO);
    void AssignSessionProperties(out string key, out string random, out CookieOptions options);
    bool RefreshSession(string username, string sid, string jwt, out User user);
    List<User> Get();
    User Get(string id);
    User Create(UserDTO user);
    void Update(string id, User userIn, string password);
    bool AddHeliFavorite(string newEntry, string username, string sid, string jwt);
    bool DeleteHeliFavorite(string entry, string username, string sid, string jwt);
    User LoginUser(string username, string password);
    User LogoutUser(UserDTO dto);
    User ForgotPassword(string emailAddress);
    User ChangePassword(string password, string code);

  }
}