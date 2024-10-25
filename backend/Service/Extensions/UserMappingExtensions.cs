using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Models.Entities;
using Shared.DataTransferObjects.UsersDTO;

namespace Service.Extensions
{
    public static class UserMappingExtensions
    {
        public static async Task<List<TDto>> MapUsersToDTOsAsync<TDto>(this List<User> users, UserManager<User> userManager, IMapper mapper)
            where TDto : class
        {
            var userDTOs = new List<TDto>();

            foreach (var user in users)
            {
                var userDTO = mapper.Map<TDto>(user);

                if (userDTO is IRole roleAwareDTO)
                {
                    var roles = await userManager.GetRolesAsync(user);
                    roleAwareDTO.Role = roles.FirstOrDefault();
                }

                userDTOs.Add(userDTO);
            }

            return userDTOs;
        }

        public static async Task<UserDetailDTO> MapUserToDTOAsync(this User user, UserManager<User> userManager, IMapper mapper)
        {
            var userDTO = mapper.Map<UserDetailDTO>(user);

            var roles = await userManager.GetRolesAsync(user);
            userDTO.Role = roles.FirstOrDefault(); 

            return userDTO;
        }
    }

}
