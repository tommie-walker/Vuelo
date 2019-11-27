using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using RSIVueloAPI.Models;
using RSIVueloAPI.Services;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using System;
using System.Net.Http;
using Newtonsoft.Json;
using System.Text;
using System.Net.Http.Headers;

namespace RSIVueloAPI.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class UserController : ControllerBase
  {
    private readonly UserService _userService;

    public UserController(UserService userService)
    {
      _userService = userService;
    }

    [HttpPost("Authenticate")]
    public IActionResult Authenticate([FromBody]UserDTO dto)
    {
      var user = _userService.LoginUser(dto.UserName, dto.Password);
      if (user == null)
        return StatusCode(StatusCodes.Status401Unauthorized);

      var checkJWT = _userService.CheckLoginToken(user.Email, out string jwt);
      _userService.CreateDTO(user, out UserDTO newDTO);

      if (!checkJWT) // generate jwt if user does not have one
        jwt = _userService.GenerateJWT(newDTO);

      _userService.AssignSessionProperties(out string key, out string random, out CookieOptions options);
      Response.Cookies.Append(key, random, options);

      var isSaved = _userService.SaveSession(newDTO, random, jwt);
      if (!isSaved)
        return StatusCode(StatusCodes.Status401Unauthorized);

      return Ok(new
      {
        Id = user.Id,
        Username = user.UserName,
        Email = user.Email,
        Favorites = user.favorites,
        token = jwt,
        Session = random,
        Role = user.Role
      });
    }

    [HttpPost("[action]")]
    public IActionResult GetSession([FromBody]UserDTO dto)
    {
      var cookie = Request.Cookies["SID"];
      var isValid = _userService.RefreshSession(dto.UserName, cookie, dto.token, out User user);
      if (!isValid)
        return StatusCode(StatusCodes.Status401Unauthorized);

      return Ok(user);
    }

    [HttpPost("[action]")]
    public async Task<ActionResult> AddHeli([FromBody]UserDTO dto)
    {
      var cookie = Request.Cookies["SID"];
      var isValid = _userService.RefreshSession(dto.UserName, cookie, dto.token, out User user);
      if (!isValid)
        return StatusCode(StatusCodes.Status401Unauthorized);

      HttpClient client = new HttpClient();
      HttpRequestMessage heli = new HttpRequestMessage();
      Helicopter h = new Helicopter();
      h.heliId = dto.heliId;
      h.heliModel = dto.heliModel;
      h.heliUrl = dto.heliUrl;
      h.heliType = dto.heliType;
      h.heliCap = dto.heliCap;
      h.heliMax = dto.heliMax;
      h.heliMin = dto.heliMin;
      h.heliLength = dto.heliLength;
      h.heliHeight = dto.heliHeight;
      h.heliRotor = dto.heliRotor;
      h.heliMaxSpeed = dto.heliMaxSpeed;

      var json = JsonConvert.SerializeObject(h);
      var content = new StringContent(json, Encoding.UTF8, "application/json");
      var request = new HttpRequestMessage
      {
        RequestUri = new Uri("http://localhost:8080/api/helicopter"),
        Content = content,
        Method = HttpMethod.Post
      };

      HttpResponseMessage result = await client.SendAsync(request);

      return Ok(result);
    }

    [HttpDelete("[action]")]
    public async Task<ActionResult> DeleteHeli([FromBody]UserDTO dto)
    {
      var cookie = Request.Cookies["SID"];
      var isValid = _userService.RefreshSession(dto.UserName, cookie, dto.token, out User user);
      if (!isValid)
        return StatusCode(StatusCodes.Status401Unauthorized);

      HttpClient client = new HttpClient();
      HttpRequestMessage heli = new HttpRequestMessage();
      Helicopter h = new Helicopter();
      h.heliId = dto.heliId;

      var json = JsonConvert.SerializeObject(h);
      var content = new StringContent(json, Encoding.UTF8, "application/json");
      var request = new HttpRequestMessage
      {
        RequestUri = new Uri("http://localhost:8080/api/helicopter/" + h.heliId),
        Content = content,
        Method = HttpMethod.Delete
      };

      HttpResponseMessage result = await client.SendAsync(request);

      return Ok(result);
    }

    [HttpPost("[action]")]
    public async Task<ActionResult> UpdateHeli([FromBody]UserDTO dto)
    {
      var cookie = Request.Cookies["SID"];
      var isValid = _userService.RefreshSession(dto.UserName, cookie, dto.token, out User user);
      if (!isValid)
        return StatusCode(StatusCodes.Status401Unauthorized);

      HttpClient client = new HttpClient();
      HttpRequestMessage heli = new HttpRequestMessage();
      Helicopter h = new Helicopter();
      h.heliId = dto.heliId;
      h.heliModel = dto.heliModel;
      h.heliUrl = dto.heliUrl;
      h.heliType = dto.heliType;
      h.heliCap = dto.heliCap;
      h.heliMax = dto.heliMax;
      h.heliMin = dto.heliMin;
      h.heliLength = dto.heliLength;
      h.heliHeight = dto.heliHeight;
      h.heliRotor = dto.heliRotor;
      h.heliMaxSpeed = dto.heliMaxSpeed;

      var json = JsonConvert.SerializeObject(h);
      var content = new StringContent(json, Encoding.UTF8, "application/json");
      var request = new HttpRequestMessage
      {
        RequestUri = new Uri("http://localhost:8080/api/helicopter/" + h.heliId),
        Content = content,
        Method = HttpMethod.Patch,
      };

      HttpResponseMessage result = await client.SendAsync(request);

      return Ok(result);
    }

    [HttpGet("[action]")]
    public ActionResult<List<User>> GetAllUsers() =>
        _userService.Get();

    [HttpGet("[action]")]
    public ActionResult<User> GetUser(string id)
    {
      var user = _userService.Get(id);
      if (user == null)
        return StatusCode(StatusCodes.Status404NotFound);
      return user;
    }

    [HttpPost("[action]")]
    public ActionResult<User> CreateUser(UserDTO user)
    {
      var addedUser = _userService.Create(user);
      if (addedUser == null)
        return StatusCode(StatusCodes.Status409Conflict);
      return Ok(user);
    }

    [HttpPut("{id:length(24)}")]
    public IActionResult UpdateUser(string id, User userIn)
    {
      var user = _userService.Get(id);
      if (user == null)
        return StatusCode(StatusCodes.Status409Conflict);
      _userService.Update(id, userIn);
      return Ok(userIn);
    }

    [HttpPut("[action]")]
    public IActionResult AddUserFavorite([FromBody]UserDTO dto)
    {
      var isSaved = _userService.AddHeliFavorite(dto.heliModel, dto.UserName, dto.session, dto.token);
      if (!isSaved)
        return StatusCode(StatusCodes.Status404NotFound, isSaved);
      return Ok(isSaved);
    }

    [HttpPut("[action]")]
    public IActionResult DeleteUserFavorite([FromBody]UserDTO dto)
    {
      var isSaved = _userService.DeleteHeliFavorite(dto.heliModel, dto.UserName, dto.session, dto.token);
      if (!isSaved)
        return StatusCode(StatusCodes.Status404NotFound);
      return Ok(isSaved);
    }

    [HttpPost("[action]")]
    public IActionResult ForgotPassword([FromBody]UserDTO dto)
    {
      var user = _userService.ForgotPassword(dto.Email);
      if (user == null)
        return StatusCode(StatusCodes.Status404NotFound);
      return Ok(user);
    }

    [HttpPut("[action]")]
    public IActionResult UpdatePassword([FromBody]UserDTO dto)
    {
      var newUser = _userService.ChangePassword(dto.Password, dto.session);
      if (newUser == null)
        return StatusCode(StatusCodes.Status404NotFound);
      return Ok(newUser);
    }

    [HttpPost("[action]")]
    public IActionResult Logout([FromBody]UserDTO userIn)
    {
      var user = _userService.LogoutUser(userIn);
      if (user == null)
        return StatusCode(StatusCodes.Status404NotFound);

      foreach (var cookie in Request.Cookies.Keys)
      {
        if (cookie == "SID")
          Response.Cookies.Delete(cookie);
      }
      return Ok(user);
    }
  }
}
