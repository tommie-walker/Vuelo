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
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Options;
using System.Text;

namespace RSIVueloAPI.Services
{
  public class UserService : IUserService
  {
        private readonly IMongoCollection<User> _users;
        private readonly IMongoCollection<EmailAuth> _emailAuth;
        private readonly IMongoCollection<JWTToken> _jwt;
        private readonly IMongoCollection<Session> _sid;
        private KeyValuePair<string, string> _settings;
        private JWTTokenManager _tokenManagement;

        public UserService(IUserDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var db = client.GetDatabase(settings.DatabaseName);

            _users = db.GetCollection<User>(settings.UserCollectionName);
            _emailAuth = db.GetCollection<EmailAuth>(settings.EmailAuthCollectionName);
            _jwt = db.GetCollection<JWTToken>(settings.JWTCollectionName);
            _sid = db.GetCollection<Session>(settings.SessionCollectionName);

            _settings = new KeyValuePair<string, string>(settings.EmailUser, settings.EmailPass);

            _tokenManagement = new JWTTokenManager
            {
                Secret = settings.Secret,
                Issuer = settings.Issuer,
                Audience = settings.Auidence,
                AccessExpiration = settings.AccessExpiration,
                RefreshExpiration = settings.RefreshExpiration
            };
        }

        public string GenerateJWT(UserDTO user)
        {
            var expiry = 60;
            var claim = new[]
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.Role, user.Role)
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_tokenManagement.Secret));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var jwtToken = new JwtSecurityToken(
                _tokenManagement.Issuer,
                _tokenManagement.Audience,
                claim,
                expires: DateTime.UtcNow.AddSeconds(expiry),
                signingCredentials: credentials
            );

            var TokenString = new JwtSecurityTokenHandler().WriteToken(jwtToken);

            // create timestamp in db
            var jwt = new JWTToken()
            {
                UserEmail = user.Email,
                jwtToken = TokenString,
                TimeStamp = DateTime.UtcNow,
                Expire = DateTime.UtcNow.AddSeconds(expiry)
            };
            
            _jwt.InsertOne(jwt);

            var builder = Builders<JWTToken>.IndexKeys;
            _jwt.Indexes.CreateOne(new CreateIndexModel<JWTToken>(builder.Ascending(x => x.Expire),
                                                                   new CreateIndexOptions { ExpireAfter = TimeSpan.FromSeconds(expiry) }));

            return TokenString;
        }

        public ErrorCode SaveSession(UserDTO user, string value)
        {
            if (user == null)
                return ErrorCode.InvalidUser;
            var expiry = 60;
            var sid = new Session()
            {
                UserEmail = user.Email,
                SessionId = value,
                TimeStamp = DateTime.UtcNow,
                Expire = DateTime.UtcNow.AddSeconds(expiry)
            };

            _sid.InsertOne(sid);

            var builder = Builders<Session>.IndexKeys;
            _sid.Indexes.CreateOne(new CreateIndexModel<Session>(builder.Ascending(x => x.Expire),
                                                                 new CreateIndexOptions { ExpireAfter = TimeSpan.FromSeconds(expiry) }));

            return ErrorCode.Success;
        }

        public List<User> Get() =>
            _users.Find(user => true).ToList();

        public User Get(string id) =>
            _users.Find<User>(user => user.Id == id).FirstOrDefault();

        public KeyValuePair<User, ErrorCode> Create(UserDTO user)
        {
            User newUser = new User(user);

            newUser.Role = "user";
            newUser.favorites = new List<string>();
            newUser.Id = null;

            if (!new EmailAddressAttribute().IsValid(user.Email))
                return new KeyValuePair<User, ErrorCode>(null, ErrorCode.InvalidEmail);
            if (_users.Find(x => x.Email.Equals(user.Email)).Any())
                return new KeyValuePair<User, ErrorCode>(null, ErrorCode.EmailExist);
            if (_users.Find(x => x.UserName.Equals(user.UserName)).Any())
                return new KeyValuePair<User, ErrorCode>(null, ErrorCode.UserExist);

            byte[] passwordHash, passwordSalt;
            CreatePasswordHash(user.Password, out passwordHash, out passwordSalt);

            newUser.PasswordHash = passwordHash;
            newUser.PasswordSalt = passwordSalt;

            _users.InsertOne(newUser);
            return new KeyValuePair<User, ErrorCode>(newUser, ErrorCode.Success);
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

        public ErrorCode AddHeliFavorite(string newEntry, string username)
        {
            User user = _users.Find(x => x.UserName.Equals(username)).FirstOrDefault();

            if (user == null)
                return ErrorCode.InvalidUser;

            if (user.favorites.Contains(newEntry))
                return ErrorCode.HeliExist;

            user.favorites.Add(newEntry);
            _users.ReplaceOne(temp => temp.UserName == user.UserName, user);

            return ErrorCode.Success;
        }

        public ErrorCode DeleteHeliFavorite(string entry, string username)
        {
            User user = _users.Find(x => x.UserName.Equals(username)).FirstOrDefault();

            if (user == null)
                return ErrorCode.InvalidUser;

            if (!user.favorites.Remove(entry))
                return ErrorCode.InvalidHeli;

            _users.ReplaceOne(temp => temp.UserName == user.UserName, user);
            return ErrorCode.Success;
        }

        public KeyValuePair<User, ErrorCode> LoginUser(string username, string password)
        {
            User user = _users.Find(x => x.UserName.Equals(username)).FirstOrDefault();

            if (user != null && VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt)) 
                return new KeyValuePair<User, ErrorCode>(user, ErrorCode.Success);
            else 
                return new KeyValuePair<User, ErrorCode>(null, ErrorCode.InvalidEmail);
        }

        public KeyValuePair<User, ErrorCode> LogoutUser(UserDTO dto)
        {
            User user = _users.Find(x => x.UserName.Equals(dto.UserName)).FirstOrDefault();
            JWTToken jwt = _jwt.Find(x => x.UserEmail.Equals(user.Email)).FirstOrDefault();
            Session sid = _sid.Find(x => x.UserEmail.Equals(user.Email)).FirstOrDefault();

            if (user == null || jwt == null || sid == null)
                return new KeyValuePair<User, ErrorCode>(null, ErrorCode.Unknown);

            // delete from db
            _jwt.DeleteOne(temp => temp.UserEmail == jwt.UserEmail);
            _sid.DeleteOne(temp => temp.UserEmail == sid.UserEmail);

            return new KeyValuePair<User, ErrorCode>(user, ErrorCode.Success);
        }

        public KeyValuePair<User, ErrorCode> ForgotPassword(string emailAddress)
        {
            User user = _users.Find(x => x.Email.Equals(emailAddress)).FirstOrDefault();

            if (user == null)
                return new KeyValuePair<User, ErrorCode>(null, ErrorCode.InvalidEmail);

            var expiry = 60;
            var token = Guid.NewGuid();
            var emailAuth = new EmailAuth()
            {
                UserEmail = user.Email,
                Token = token,
                TimeStamp = DateTime.UtcNow,
                Expire = DateTime.UtcNow.AddSeconds(expiry)
            };
            _emailAuth.InsertOne(emailAuth);

            var builder = Builders<EmailAuth>.IndexKeys;
            _emailAuth.Indexes.CreateOne(new CreateIndexModel<EmailAuth>(builder.Ascending(x => x.Expire),
                                                                   new CreateIndexOptions { ExpireAfter = TimeSpan.FromSeconds(expiry) }));

            SmtpClient client = new SmtpClient("smtp.gmail.com");

            client.Port = 587;
            client.EnableSsl = true;
            client.UseDefaultCredentials = false;
            client.Credentials = new NetworkCredential(_settings.Key, _settings.Value);

            MailMessage msg = new MailMessage();
            msg.From = new MailAddress("jo3JO3jo31234@gmail.com");
            msg.To.Add(emailAddress);
            msg.Subject = "Vuelo Email Verification";
            var redirect = "https://localhost:5001/resetPassword";
            msg.Body = string.Format("Please copy this to the verification field: {0} <br>" +
                        "Click the <a href=\'{1}'> link </a> to verify password", token, redirect);
            msg.IsBodyHtml = true;

            client.Send(msg);

            return new KeyValuePair<User, ErrorCode>(user, ErrorCode.Success); 
        }

        public User ChangePassword(string password, string code)
        {
            EmailAuth emailAuth = _emailAuth.Find(x => x.Token.Equals(code)).FirstOrDefault();
            if (emailAuth == null)
                return null;

            User user = _users.Find(x => x.Email.Equals(emailAuth.UserEmail)).FirstOrDefault();
            if (user == null)
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
