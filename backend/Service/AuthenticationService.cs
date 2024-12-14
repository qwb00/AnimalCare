using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Models.Entities;
using Service.Contracts;
using System.Security.Claims;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using Shared.DataTransferObjects.UsersDTO;
using Shared.Enums;

namespace Service
{
    internal sealed class AuthenticationService : IAuthenticationService
    {
        private readonly IMapper _mapper;
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _configuration;

        private User? _user;

        public AuthenticationService(IMapper mapper, UserManager<User> userManager, IConfiguration configuration)
        {
            _mapper = mapper;
            _userManager = userManager;
            _configuration = configuration;
        }

        public async Task<IdentityResult> RegisterUser(UserForCreateDTO userForRegistration)
        {
            IdentityResult result;
            
            if (userForRegistration.Roles.Contains("Volunteer"))
            {
                var volunteer = _mapper.Map<Volunteer>(userForRegistration);
                volunteer.VolunteerStatus = VolunteerStatus.New;
                volunteer.isActive = true;
                
                result = await _userManager.CreateAsync(volunteer, userForRegistration.Password);
                if (result.Succeeded)
                {
                    await _userManager.AddToRolesAsync(volunteer, userForRegistration.Roles);
                }
            }
            else
            {
                var user = _mapper.Map<User>(userForRegistration);
                user.isActive = true;
                
                result = await _userManager.CreateAsync(user, userForRegistration.Password);
                if (result.Succeeded)
                {
                    await _userManager.AddToRolesAsync(user, userForRegistration.Roles);
                }
            }
            return result;
        }

        public async Task<bool> ValidateUser(UserForAuthenticationDTO userForAuth)
        {
            _user = await _userManager.FindByEmailAsync(userForAuth.Email);
            if (_user.isActive == false)
            {
                return false;
            }
            var result = (_user != null && await _userManager.CheckPasswordAsync(_user, userForAuth.Password));
            return result;
        }
        public async Task<string> CreateToken()
        {
            var signingCredentials = GetSigningCredentials();
            var claims = await GetClaims();
            var tokenOptions = GenerateTokenOptions(signingCredentials, claims);
            return new JwtSecurityTokenHandler().WriteToken(tokenOptions);
        }

        private SigningCredentials GetSigningCredentials()
        {
            var key = Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("SECRET"));
            var secret = new SymmetricSecurityKey(key);
            return new SigningCredentials(secret, SecurityAlgorithms.HmacSha256);
        }
        private async Task<List<Claim>> GetClaims()
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, _user.UserName)
            };
            var roles = await _userManager.GetRolesAsync(_user);
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }
            return claims;
        }
        private JwtSecurityToken GenerateTokenOptions(SigningCredentials signingCredentials,
        List<Claim> claims)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var tokenOptions = new JwtSecurityToken
            (
            issuer: jwtSettings["validIssuer"],
            audience: jwtSettings["validAudience"],
            claims: claims,
            expires: DateTime.Now.AddMinutes(Convert.ToDouble(jwtSettings["expires"])),
            signingCredentials: signingCredentials
            );
            return tokenOptions;
        }


    }
}
