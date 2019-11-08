using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RSIVueloAPI.Models
{
    public enum ErrorCode
    {
        InvalidPass,
        InvalidEmail,
        UserExist,
        EmailExist,
        Success,
        Unknown
    }
}
