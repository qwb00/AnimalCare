using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DataTransferObjects.UsersDTO
{
    public record VolunteerListDTO : UserDetailDTO
    {
        public bool IsVerified {  get; init; }
        public bool IsActive { get; init; }
    }
}
