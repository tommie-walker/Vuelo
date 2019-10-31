using Microsoft.AspNetCore.Http;
using MongoDB.Driver;
using RSIVueloAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http.Filters;
using System.Web.Http.Controllers;
using System.Net.Http;
using System.Net.Mail;
using System.Net;

namespace RSIVueloAPI.Services
{
    public class UserService : IUserService
    {
        private readonly IMongoCollection<User> _users;

        public UserService(IUserDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var db = client.GetDatabase(settings.DatabaseName);

            _users = db.GetCollection<User>(settings.UserCollectionName);
        }

        public List<User> Get() =>
            _users.Find(user => true).ToList();

        public User Get(string id) =>
            _users.Find<User>(user => user.Id == id).FirstOrDefault();

        public User Create(UserDTO user)
        {
            User newUser = new User(user);

            // all newly created users will have 'user' role, empty favorites list and [id] attribute set by MongoDB
            newUser.Role = "user";
            newUser.favorites = new List<string>();
            newUser.Id = null;

            if (string.IsNullOrWhiteSpace(user.Password)) // required password field
                return null;
            if (_users.Find(x => x.UserName.Equals(user.UserName)).Any()) // true if dupe user is found, otherwise false
                return null;

            // password hashing
            byte[] passwordHash, passwordSalt;
            CreatePasswordHash(user.Password, out passwordHash, out passwordSalt);

            newUser.PasswordHash = passwordHash;
            newUser.PasswordSalt = passwordSalt;

            _users.InsertOne(newUser);
            return newUser;
        }

        public void Update(string id, User userIn, string password = null)
        {
            // don't allow users to be updated to admin and edit [id] attribute
            userIn.Role = "user";
            userIn.Id = id;

            if (userIn == null) throw new ApplicationException("User not found");

            // update password w/ hash values, if any 
            if (!string.IsNullOrWhiteSpace(password))
            {
                byte[] passwordHash, passwordSalt;
                CreatePasswordHash(password, out passwordHash, out passwordSalt);

                userIn.PasswordHash = passwordHash;
                userIn.PasswordSalt = passwordSalt;
            }

            _users.ReplaceOne(user => user.Id == id, userIn);
        }

        public void Remove(User userIn) =>
            _users.DeleteOne(user => user.Id == userIn.Id);

        public void Remove(string id) =>
            _users.DeleteOne(user => user.Id == id);

        public User LoginUser(string username, string password)
        {
            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
                return null;

            // null if user is not in the database
            User user = _users.Find(x => x.UserName.Equals(username)).FirstOrDefault();

            if (user != null && VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt)) 
                return user;
            else // user not found or wrong password
                return null;
        }

        public User ForgotPassword(string emailAddress)
        {
            if (string.IsNullOrEmpty(emailAddress))
                return null;

            // null if user is not in database
            User user = _users.Find(x => x.Email.Equals(emailAddress)).FirstOrDefault();

            if (user == null)
                return null;

            SmtpClient client = new SmtpClient("smtp.gmail.com");
            client.Port = 587;
            client.EnableSsl = true;
            client.UseDefaultCredentials = false;
            client.Credentials = new NetworkCredential("jo3jo3jo31234@gmail.com", "joeJOEjoe$0$");

            // jo3JO3jo31234@gmail.com
            // joeJOEjoe$0$
            

            MailMessage msg = new MailMessage();
            msg.From = new MailAddress("jo3JO3jo31234@gmail.com");
            msg.To.Add(emailAddress);
            msg.Subject = "Email Verification";
            var redirect = "https://localhost:5001/login";
            msg.Body = string.Format("Please click the <a href=\'{0}'> link </a> to verify password", redirect);
            msg.IsBodyHtml = true;

            client.Send(msg);

            return user; 
        }

        private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {            
            if (password == null) throw new ArgumentNullException("password");
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("value cannot be empty or whitespace only.", "password");

            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        private static bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
        {
            if (password == null) throw new ArgumentNullException("password");
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("value cannot be empty or whitespace only.", "password");
            if (storedHash.Length != 64) throw new ArgumentException("Invalid password hash length (64 bytes expected)", "passwordHash");
            if (storedSalt.Length != 128) throw new ArgumentException("Invalid password salt length (128 bytes expected)", "passwordHash");

            using (var hmac = new System.Security.Cryptography.HMACSHA512(storedSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < computedHash.Length; i++)
                    if (computedHash[i] != storedHash[i]) return false;

                // password is verified, so return true
                return true;
            }
        }
    }
}
