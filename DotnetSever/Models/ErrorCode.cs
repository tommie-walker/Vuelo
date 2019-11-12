using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RSIVueloAPI.Models
{
    public enum ErrorCode
    {
        InvalidPass = 1, 
        InvalidEmail,
        UserExist,
        EmailExist,
        Success,
        Unknown
    }
}
