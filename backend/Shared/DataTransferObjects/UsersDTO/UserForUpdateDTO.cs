﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DataTransferObjects.UsersDTO
{
    public record UserForUpdateDTO : UserForManipulationDTO
    {
        public bool? isActive { get; set; }
    }
}
