﻿using RSIVueloAPI.Models;
using System;
using System.Collections.Generic;
using System.Security.Claims;

namespace RSIVueloAPI.Services
{
    public interface IUserService
    {
        string GenerateJWT(UserDTO user);
        ErrorCode SaveSession(UserDTO user, string value);
        List<User> Get();
        User Get(string id);
        KeyValuePair<User, ErrorCode> Create(UserDTO user);
        void Update(string id, User userIn, string password);
        void Remove(User userIn);
        void Remove(string id);
        ErrorCode AddHeliFavorite(string newEntry, string username);

        ErrorCode DeleteHeliFavorite(string entry, string username);
        KeyValuePair<User, ErrorCode> LoginUser(string username, string password);
        KeyValuePair<User, ErrorCode> LogoutUser(UserDTO dto);
        KeyValuePair<User, ErrorCode> ForgotPassword(string emailAddress);
        User ChangePassword(string password, string code);

    }
}