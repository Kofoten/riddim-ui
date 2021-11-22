using System.Collections.Generic;

namespace Riddim.Identity.Configuration
{
    public sealed class AuthenticationClient
    {
        public string Audience { get; init; }
        public string Authority { get; init; }
        public IEnumerable<string> Issuers { get; init; }
    }
}
