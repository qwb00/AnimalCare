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

        public async Task<UserDetailDTO> GetUserByUsernameAsync(string username)
        {
            var user = await _repository.FindByNameAsync(username);

            if (user == null)
            {
                throw new Exception($"User with name {username} not found");
            }

            var userDTO = await user.MapUserToDTOAsync(_repository, _mapper);
            return userDTO;
        }

        public async Task<(ChangeStatusForVolunteerDTO volunteerForPatch, Volunteer volunteerEntity)> GetVolunteerForPatchAsync(Guid id)
        {
            var user = await GetUserAndCheckIfItExists(id);
            var volunteer = user as Volunteer;

            var volunteerDTO = _mapper.Map<ChangeStatusForVolunteerDTO>(volunteer);
            return (volunteerToPatch: volunteerDTO, volunteerEntity: volunteer);
        }

        public async Task<(UserForUpdateDTO userForPatch, User userEntity)> GetUserForPatchAsync(string name)
        {
            var user = await _repository.FindByNameAsync(name);

            if (user == null)
            {
                throw new Exception($"User with name {name} not found");
            }

            var userDTO = _mapper.Map<UserForUpdateDTO>(user);
            return (volunteerToPatch: userDTO, userEntity: user);
        }

        public async Task<IdentityResult> SaveChangesForPatchAsync(UserForUpdateDTO patch, User user)
        {
            _mapper.Map(patch, user);
            return await _repository.UpdateAsync(user);
        }

        public async Task<IdentityResult> SaveChangesForPatchAsync(ChangeStatusForVolunteerDTO patch, Volunteer volunteer)
        {
            _mapper.Map(patch, volunteer);
            return await _repository.UpdateAsync(volunteer);
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
