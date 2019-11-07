using MongoDB.Driver;
using RSIVueloAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Net;
using RSIVueloAPI.Helpers;
using MongoDB.Bson;
using System.ComponentModel.DataAnnotations;

namespace RSIVueloAPI.Services
{
  public class UserService : IUserService
  {
        private readonly IMongoCollection<User> _users;
        private readonly IMongoCollection<Verify> _verify;

        public UserService(IUserDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var db = client.GetDatabase(settings.DatabaseName);

            _users = db.GetCollection<User>(settings.UserCollectionName);
            _verify = db.GetCollection<Verify>(settings.VerifyCollectionName);
        }

        public List<User> Get() =>
            _users.Find(user => true).ToList();

        public User Get(string id) =>
            _users.Find<User>(user => user.Id == id).FirstOrDefault();

        public KeyValuePair<User, string> Create(UserDTO user)
        {
            User newUser = new User(user);

            newUser.Role = "user";
            newUser.favorites = new List<string>();
            newUser.Id = null;

            if (_users.Find(x => x.UserName.Equals(user.UserName)).Any()) 
                return new KeyValuePair<User, string>(null, "username already exist");
            if (!new EmailAddressAttribute().IsValid(user.Email))
                return new KeyValuePair<User, string>(null, "invalid email format");

            byte[] passwordHash, passwordSalt;
            CreatePasswordHash(user.Password, out passwordHash, out passwordSalt);

            newUser.PasswordHash = passwordHash;
            newUser.PasswordSalt = passwordSalt;

            _users.InsertOne(newUser);
            return new KeyValuePair<User, string>(newUser, "success");
        }

        public void Update(string id, User userIn, string password = null)
        {
            userIn.Role = "user";
            userIn.Id = id;

            if (userIn == null) throw new ApplicationException("User not found");

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

        public KeyValuePair<User, string> LoginUser(string username, string password)
        {
            User user = _users.Find(x => x.UserName.Equals(username)).FirstOrDefault();

            if (user != null && VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt)) 
                return new KeyValuePair<User, string>(user, "success");
            else 
                return new KeyValuePair<User, string>(null, "invalid password");
        }

        public KeyValuePair<User, string> ForgotPassword(string emailAddress)
        {
            User user = _users.Find(x => x.Email.Equals(emailAddress)).FirstOrDefault();

            if (user == null)
                return new KeyValuePair<User, string>(null, "invalid email");

            var token = Guid.NewGuid();
            var verify = new Verify()
            {
                UserEmail = user.Email,
                Token = token,
                TimeStamp = DateTime.Now,
                Expire = DateTime.Now.AddSeconds(60)
            };
            _verify.InsertOne(verify);

            var builder = Builders<Verify>.IndexKeys;
            _verify.Indexes.CreateOne(new CreateIndexModel<Verify>(builder.Ascending(x => x.Expire),
                                                                   new CreateIndexOptions { ExpireAfter = TimeSpan.FromSeconds(60) }));

            SmtpClient client = new SmtpClient("smtp.gmail.com");

            client.Port = 587;
            client.EnableSsl = true;
            client.UseDefaultCredentials = false;
            client.Credentials = new NetworkCredential("jo3jo3jo31234@gmail.com", "joeJOEjoe$0$");

            MailMessage msg = new MailMessage();
            msg.From = new MailAddress("jo3JO3jo31234@gmail.com");
            msg.To.Add(emailAddress);
            msg.Subject = "Vuelo Email Verification";
            var redirect = "https://localhost:5001/resetPassword";
            msg.Body = string.Format("Please copy this to the verification field: {0} <br>" +
                        "Click the <a href=\'{1}'> link </a> to verify password", token, redirect);
            msg.IsBodyHtml = true;

            client.Send(msg);

            return new KeyValuePair<User, string>(user, "success"); 
        }

        public User ChangePassword(string password, UserDTO userIn)
        {
            User user = new User(userIn);

            if (string.IsNullOrEmpty(password))
                return null;

            byte[] passwordHash, passwordSalt;
            CreatePasswordHash(password, out passwordHash, out passwordSalt);

            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;

            _users.ReplaceOne(temp => temp.Id == user.Id, user);

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
