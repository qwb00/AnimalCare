using Models.Entities;
using Shared.RequestFeatures;
using System.Linq;

namespace Repositories.Extensions
{
    public static class RepositoryUserExtensions
    {
        public static IQueryable<User> FilterUsers(this IQueryable<User> users, UserParameters userParameters)
        {
            if (!string.IsNullOrWhiteSpace(userParameters.Email))
            {
                users = users.Where(u => u.Email.Contains(userParameters.Email.Trim()));
            }

            if (!string.IsNullOrWhiteSpace(userParameters.PhoneNumber))
            {
                users = users.Where(u => u.PhoneNumber.Contains(userParameters.PhoneNumber.Trim()));
            }

            if (!string.IsNullOrWhiteSpace(userParameters.Role))
            {
                var role = userParameters.Role.Trim().ToLower();
                users = role switch
                {
                    "caretaker" => users.OfType<CareTaker>(),
                    "veterinarian" => users.OfType<Veterinarian>(),
                    _ => users
                };
            }

            if (!string.IsNullOrWhiteSpace(userParameters.Name))
            {
                users = users.Where(u => u.FullName.Contains(userParameters.Name.Trim()));
            }

            return users;
        }
    }
}