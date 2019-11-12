using RSIVueloAPI.Models;
using System;
using System.Collections.Generic;
using System.Security.Claims;

namespace RSIVueloAPI.Services
{
    public interface IUserService
    {
        string GenerateJWT(UserDTO user);
        List<User> Get();
        User Get(string id);
        KeyValuePair<User, ErrorCode> Create(UserDTO user);
        void Update(string id, User userIn, string password);
        void Remove(User userIn);
        void Remove(string id);
        KeyValuePair<User, ErrorCode> LoginUser(string username, string password);
        KeyValuePair<User, ErrorCode> LogoutUser(UserDTO dto);
        KeyValuePair<User, ErrorCode> ForgotPassword(string emailAddress);
        User ChangePassword(string password, string code);

    }
}