﻿using System.ComponentModel.DataAnnotations;
using Shared.Enums;

namespace Shared.DataTransferObjects.UsersDTO
{
    public record UserListDTO : IRole
    {
        public Guid Id { get; init; }
        public string Name { get; init; }
        public string Email { get; init; }
        public string PhoneNumber { get; init; }
        public string Role { get; set; }
        [Url]
        public string? Photo { get; set; }
        public bool isActive { get; set; }
    }
}
