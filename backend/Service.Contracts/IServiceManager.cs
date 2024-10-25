using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Contracts
{
    public interface IServiceManager
    {
        IAnimalService AnimalService { get; }
        IExaminationService ExaminationService { get; }
        IReservationService ReservationService { get; }
        IUserService UserService { get; }
        IAuthenticationService AuthenticationService { get; }
    }
}
