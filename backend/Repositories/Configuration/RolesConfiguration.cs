using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Configuration
{
    public class RoleConfiguration : IEntityTypeConfiguration<IdentityRole>
    {
        public void Configure(EntityTypeBuilder<IdentityRole> builder)
        {
            builder.HasData
                (
                    new IdentityRole
                    {
                        Name = "Caretaker",
                        NormalizedName = "CARETAKER"
                    },
                    new IdentityRole
                    {
                        Name = "Administrator",
                        NormalizedName = "ADMINISTRATOR"
                    },
                    new IdentityRole
                    {
                        Name = "Veterinarian",
                        NormalizedName = "VETERINARIAN"
                    },
                    new IdentityRole
                    {
                        Name = "Volunteer",
                        NormalizedName = "VOLUNTEER"
                    }
                );
        }
    }
}
