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
using Microsoft.AspNetCore.Http;

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
    private int sidExpire;

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

      sidExpire = 300;
    }
    public bool CheckLoginToken(string email, out string exist)
    {
      JWTToken jwt = _jwt.Find(x => x.UserEmail.Equals(email)).FirstOrDefault();

      if (jwt == null)
      {
        exist = string.Empty;
        return false;
      }

      exist = jwt.jwtToken;
      return true; // token already exist
    }

    public string GenerateJWT(UserDTO user)
    {
      var expiry = 180;
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
      return TokenString;
    }


    public void CreateDTO(User user, out UserDTO newDTO)
    {
      newDTO = new UserDTO
      {
        UserName = user.UserName,
        Password = "", // leave empty
        Email = user.Email,
        favorites = user.favorites,
        Role = user.Role
      };
    }

    public void AssignSessionProperties(out string key, out string random, out CookieOptions options)
    {
      key = "SID";
      random = Guid.NewGuid().ToString();
      options = new CookieOptions()
      {

        HttpOnly = true,
        IsEssential = true,
        Secure = true,
        SameSite = SameSiteMode.Strict,
        Expires = DateTime.UtcNow.AddHours(5),
        MaxAge = TimeSpan.FromHours(6)
      };
    }

    public bool RefreshSession(string username, string sid, string jwt, out User user)
    {
      // check if session is valid
      user = _users.Find(x => x.UserName.Equals(username)).FirstOrDefault();
      if (user == null)
        return false;

      string email = user.Email;
      Session session = _sid.Find(x => x.UserEmail.Equals(email)).FirstOrDefault();
      if (session == null)
        return false;

      // verify jwt and session
      if (session.jwtToken.Equals(jwt) && session.SessionId.Equals(sid))
      {
        // user has correct session, so refresh 
        Session update = new Session
        {
          Id = session.Id,  // updating entry, so object id is required
          UserEmail = session.UserEmail,
          SessionId = session.SessionId,
          jwtToken = jwt,
          TimeStamp = session.Expire,
          Expire = DateTime.UtcNow.AddSeconds(sidExpire)
        };

        _sid.ReplaceOne(temp => temp.UserEmail == update.UserEmail, update);
        return true;
      }
      else // invalid credentials
        return false;
    }

    public bool SaveSession(UserDTO user, string value, string jwt)
    {
      User userz = _users.Find(x => x.UserName.Equals(user.UserName)).FirstOrDefault();
      if (userz == null)
        return false;

      Session session = _sid.Find(x => x.UserEmail.Equals(userz.Email)).FirstOrDefault();
      if (session == null)
      {
        var sid = new Session()
        {
          UserEmail = user.Email,
          SessionId = value,
          jwtToken = jwt,
          TimeStamp = DateTime.UtcNow,
          Expire = DateTime.UtcNow.AddSeconds(sidExpire)
        };
        _sid.InsertOne(sid);
      }
      else
      {
        // user has correct session, so refresh 
        Session update = new Session
        {
          Id = session.Id,  // updating entry, so object id is required
          UserEmail = session.UserEmail,
          SessionId = value,
          jwtToken = jwt,
          TimeStamp = session.Expire,
          Expire = DateTime.UtcNow.AddSeconds(sidExpire)
        };

        _sid.ReplaceOne(temp => temp.UserEmail == update.UserEmail, update);
        return true;
      }




      return true;
    }

    public List<User> Get() =>
        _users.Find(user => true).ToList();

    public User Get(string id) =>
        _users.Find<User>(user => user.Id == id).FirstOrDefault();

    public User Create(UserDTO user)
    {
      User newUser = new User(user);

      newUser.Role = "user";
      newUser.favorites = new List<string>();
      newUser.Id = null;

      if (!new EmailAddressAttribute().IsValid(user.Email))
        return null;
      if (_users.Find(x => x.Email.Equals(user.Email)).Any())
        return null;
      if (_users.Find(x => x.UserName.Equals(user.UserName)).Any())
        return null;

      byte[] passwordHash, passwordSalt;
      CreatePasswordHash(user.Password, out passwordHash, out passwordSalt);

      newUser.PasswordHash = passwordHash;
      newUser.PasswordSalt = passwordSalt;

      _users.InsertOne(newUser);
      return newUser;
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
    public bool AddHeliFavorite(string newEntry, string username, string sid, string jwt)
    {
      var isValid = RefreshSession(username, sid, jwt, out User user);
      if (!isValid)
        return false;

      user.favorites.Add(new string(newEntry));
      _users.ReplaceOne(temp => temp.UserName == user.UserName, user);
      return true;
    }

    public bool DeleteHeliFavorite(string entry, string username, string sid, string jwt)
    {
      var isValid = RefreshSession(username, sid, jwt, out User user);
      if (!isValid)
        return false;

      if (!user.favorites.Remove(entry))
        return false;

      _users.ReplaceOne(temp => temp.UserName == user.UserName, user);
      return true;
    }

    public User LoginUser(string username, string password)
    {
      User user = _users.Find(x => x.UserName.Equals(username)).FirstOrDefault();

      if (user != null && VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
        return user;
      else
        return null;
    }

    public User LogoutUser(UserDTO dto)
    {
      User user = _users.Find(x => x.UserName.Equals(dto.UserName)).FirstOrDefault();
      if (user == null)
        return null;

      Session sid = _sid.Find(x => x.UserEmail.Equals(user.Email)).FirstOrDefault();
      if (sid == null)
        return null;

      // delete from db
      _sid.DeleteOne(temp => temp.UserEmail == sid.UserEmail);

      return user;
    }

    public User ForgotPassword(string emailAddress)
    {
      User user = _users.Find(x => x.Email.Equals(emailAddress)).FirstOrDefault();

      if (user == null)
        return null;

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

      return user;
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
