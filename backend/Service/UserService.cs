﻿using AutoMapper;
using Contracts;
using Microsoft.AspNetCore.Identity;
using Models.Entities;
using Service.Contracts;
using Service.Extensions;
using Shared.DataTransferObjects.UsersDTO;
using Shared.RequestFeatures;

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

        public async Task<IEnumerable<UserListDTO>> GetAllUsersAsync(UserParameters userParameters)
        {
            IEnumerable<User> users;

            // search by role
            if (!string.IsNullOrWhiteSpace(userParameters.Role))
            {
                var role = userParameters.Role.Trim().ToLower();

                users = role switch
                {
                    "caretaker" => await _repository.GetUsersInRoleAsync("Caretaker"),
                    "veterinarian" => await _repository.GetUsersInRoleAsync("Veterinarian"),
                    _ => Enumerable.Empty<User>() // Если роль не поддерживается
                };
            }
            else
            {
                // get all users
                var caretakers = await _repository.GetUsersInRoleAsync("Caretaker");
                var veterinarians = await _repository.GetUsersInRoleAsync("Veterinarian");
                users = caretakers.Union(veterinarians);
            }

            // need to filter only active users
            users = users.Where(u => u.isActive);

            // filters
            if (!string.IsNullOrWhiteSpace(userParameters.Email))
            {
                users = users.Where(u => u.Email.Contains(userParameters.Email.Trim(), StringComparison.OrdinalIgnoreCase));
            }

            if (!string.IsNullOrWhiteSpace(userParameters.PhoneNumber))
            {
                users = users.Where(u => u.PhoneNumber.Contains(userParameters.PhoneNumber.Trim()));
            }

            if (!string.IsNullOrWhiteSpace(userParameters.Name))
            {
                users = users.Where(u => u.FullName.Contains(userParameters.Name.Trim(), StringComparison.OrdinalIgnoreCase));
            }
            
            var usersDTO = await users.ToList().MapUsersToDTOsAsync<UserListDTO>(_repository, _mapper);
            return usersDTO;
        }


        public async Task<IEnumerable<VolunteerListDTO>> GetVolunteersAsync(VolunteerParameters volunteerParameters)
        {
            // get all volunteers
            var users = await _repository.GetUsersInRoleAsync("Volunteer");

            // filters
            var volunteers = users.Where(u => u.isActive);

            if (!string.IsNullOrWhiteSpace(volunteerParameters.Email))
            {
                volunteers = volunteers.Where(u => u.Email.Contains(volunteerParameters.Email.Trim(), StringComparison.OrdinalIgnoreCase));
            }

            if (!string.IsNullOrWhiteSpace(volunteerParameters.PhoneNumber))
            {
                volunteers = volunteers.Where(u => u.PhoneNumber.Contains(volunteerParameters.PhoneNumber.Trim()));
            }

            if (!string.IsNullOrWhiteSpace(volunteerParameters.Name))
            {
                volunteers = volunteers.Where(u => u.FullName.Contains(volunteerParameters.Name.Trim(), StringComparison.OrdinalIgnoreCase));
            }
            
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
        
        public async Task<(UserForUpdateDTO userForPatch, User userEntity)> GetUserForPatchAsync(Guid id)
        {
            var user = await GetUserAndCheckIfItExists(id);

            var userDTO = _mapper.Map<UserForUpdateDTO>(user);

            return (userForPatch: userDTO, userEntity: user);
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

        public async Task UpdateUserRoleAsync(Guid userId, UpdateUserRoleDTO request)
        {
            var user = await _repository.FindByIdAsync(userId.ToString());
            if (user == null)
            {
                throw new Exception("User not found");
            }

            var currentRoles = await _repository.GetRolesAsync(user);
            var removeResult = await _repository.RemoveFromRolesAsync(user, currentRoles);
            if (!removeResult.Succeeded)
            {
                throw new Exception("Failed to remove old roles");
            }

            var addResult = await _repository.AddToRoleAsync(user, request.NewRoleName);
            if (!addResult.Succeeded)
            {
                throw new Exception("Failed to add new role");
            }
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
