using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using WebAPI.Models;

namespace WebAPI.Infrastructure.ApplicationUserClaims
{
    public class ApplicationUserClaimsPrincipalFactory : UserClaimsPrincipalFactory<ApplicationUser>
    {
        public ApplicationUserClaimsPrincipalFactory(
            UserManager<ApplicationUser> userManager
            , IOptions<IdentityOptions> optionsAccessor)
            : base(userManager, optionsAccessor)
        { }

        public async override Task<ClaimsPrincipal> CreateAsync(ApplicationUser user)
        {
            var principal = await base.CreateAsync(user);

            if (!string.IsNullOrWhiteSpace(user.Email))
            {
                ((ClaimsIdentity)principal.Identity).AddClaims(new[] {
                    new Claim("Email", user.Email)
                });
            }

            if (!string.IsNullOrEmpty(user.AfauserLink))
            {
                ((ClaimsIdentity)principal.Identity).AddClaims(new[]
                {
                    new Claim("AfauserLink", user.AfauserLink)
                });
            }
            // You can add more properties that you want to expose on the User object below

            return principal;
        }
    }
}
