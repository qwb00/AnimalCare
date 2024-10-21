using AutoMapper;
using Contracts;
using Microsoft.AspNetCore.Identity;
using Models.Entities;
using Service.Contracts;
using Shared.DataTransferObjects.AnimalsDTO;
using Shared.DataTransferObjects.UsersDTO;

namespace Service
{
    public class UserService : IUserService
    {
        private readonly UserManager<User> _repository;
        private readonly IMapper _mapper;

        public UserService(UserManager<User> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<UserListDTO>> GetAllUsersAsync()
        {
            var caretakers = await _repository.GetUsersInRoleAsync("Caretaker");

            var veterinarians = await _repository.GetUsersInRoleAsync("Veterinarian");

            var users = caretakers.Union(veterinarians);

            var usersDTO = _mapper.Map<IEnumerable<UserListDTO>>(users);
            return usersDTO;
        }

    }
}
