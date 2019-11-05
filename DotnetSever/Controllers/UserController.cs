using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using RSIVueloAPI.Models;
using RSIVueloAPI.Services;
using Microsoft.AspNetCore.Http;

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
                return NotFound();

            return Ok(new
            {
                Id = user.Id,
                Username = user.UserName,
                Email = user.Email,
                Favorites = user.favorites
            });
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
                return StatusCode(StatusCodes.Status303SeeOther);

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

        [HttpDelete("{id:length(24)}")]
        public IActionResult DeleteUser(string id)
        {
            var user = _userService.Get(id);
            if (user == null)
                return StatusCode(StatusCodes.Status404NotFound);
            _userService.Remove(user.Id);
            return Ok(user);
        }

        [HttpPost("[action]")]
        public IActionResult ForgotPassword(string emailAddress)
        {
            var user = _userService.ForgotPassword(emailAddress);
            if (user == null)
                return StatusCode(StatusCodes.Status404NotFound);

            return Ok(user);
        }

        [HttpPut("[action]")]
        public IActionResult UpdatePassword(string password, UserDTO userIn)
        {
            var user = _userService.Get(userIn.Id);
            if (user == null)
                return StatusCode(StatusCodes.Status404NotFound);
            var newUser = _userService.ChangePassword(password, userIn);

            return Ok(newUser);
        }
    }
}
