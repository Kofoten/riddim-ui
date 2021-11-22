using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;

namespace Riddim.Data.Auth
{
    public sealed class SecurityTokenValidator : ISecurityTokenValidator
    {
        private readonly ISecurityTokenValidator inner;
        
        public int MaximumTokenSizeInBytes { get; set; }
        public bool CanValidateToken => true;

        public SecurityTokenValidator(ISecurityTokenValidator inner)
        {
            this.inner = inner;

            MaximumTokenSizeInBytes = 1048576;
        }

        public bool CanReadToken(string securityToken)
        {
            return true;
        }

        public ClaimsPrincipal ValidateToken(string securityToken, TokenValidationParameters validationParameters, out SecurityToken validatedToken)
        {
            var jwt = new JwtSecurityToken(securityToken);
            validationParameters.ValidateIssuerSigningKey = false;

            var compositeToken = new JwtSecurityToken(jwt.Issuer, jwt.Audiences.Single(), jwt.Claims, jwt.ValidFrom, jwt.ValidTo);
            validatedToken = compositeToken;

            //var principal = inner.ValidateToken($"{compositeToken.EncodedHeader}.{compositeToken.EncodedPayload}.{jwt.RawSignature}", validationParameters, out validatedToken);
            return new ClaimsPrincipal(new ClaimsIdentity[] { new ClaimsIdentity(jwt.Claims) });
        }
    }
}
