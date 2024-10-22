using AutoMapper;
using Contracts;
using Microsoft.AspNetCore.Identity;
using Models.Entities;
using Service.Contracts;
using Service.Extensions;
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

            var users = caretakers.Union(veterinarians).ToList();

            var usersDTO = await users.MapUsersToDTOsAsync<UserListDTO>(_repository, _mapper);
            return usersDTO;
        }

        public async Task<IEnumerable<VolunteerListDTO>> GetVolunteersAsync()
        {
            var users = await _repository.GetUsersInRoleAsync("Volunteer");

            var volunteers = users.OfType<Volunteer>().ToList();

           // var volunteersDTO = await volunteers.MapUsersToDTOsAsync<VolunteerListDTO>(_repository, _mapper);
            var volunteersDTO = volunteers.Select(v => _mapper.Map<VolunteerListDTO>(v));
            return volunteersDTO;
        }

        public async Task<(ChangeStatusForVolunteerDTO volunteerForPatch, Volunteer volunteerEntity)> GetVolunteerForPatchAsync(Guid id)
        {
            var user = await GetUserAndCheckIfItExists(id);
            var volunteer = user as Volunteer;

            var volunteerDTO = _mapper.Map<ChangeStatusForVolunteerDTO>(volunteer);
            return (volunteerToPatch: volunteerDTO, volunteerEntity: volunteer);
        }

        public async Task<IdentityResult> SaveChangesForPatchAsync(ChangeStatusForVolunteerDTO patch, Volunteer user)
        {
            _mapper.Map(patch, user);
            return await _repository.UpdateAsync(user);
        }

        public async Task DeleteUserAsync(Guid userId)
        {
            var user = await GetUserAndCheckIfItExists(userId);

            var result = await _repository.DeleteAsync(user);

            if (!result.Succeeded)
            {
                throw new Exception("Error occurred while deleting the user");
            }
        }

        public async Task<UserDetailDTO> GetUserAsync(Guid id)
        {
            var user = await GetUserAndCheckIfItExists(id);

            var userDTO = await user.MapUserToDTOAsync(_repository, _mapper);
            return userDTO;
        }

        private async Task<User> GetUserAndCheckIfItExists(Guid id)
        {
            var user = await _repository.FindByIdAsync(id.ToString());
            if (user == null)
            {
                throw new Exception($"User with id {id} not found");
            }

            return user;
        }

    }
}
