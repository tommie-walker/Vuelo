using RSIVueloAPI.Models;
using System.Collections.Generic;

namespace RSIVueloAPI.Services
{
    public interface IUserService
    {
        List<User> Get();
        User Get(string id);
        string Create(UserDTO user);
        void Update(string id, User userIn, string password);
        void Remove(User userIn);
        void Remove(string id);
        KeyValuePair<User, string> LoginUser(string username, string password);
        KeyValuePair<User, string> ForgotPassword(string emailAddress);
        User ChangePassword(string password, UserDTO user);

    }
}