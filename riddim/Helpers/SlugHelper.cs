using System.Text.RegularExpressions;

namespace Riddim.Helpers
{
    public static class SlugHelper
    {
        private static readonly Regex ValidationExpression = new("^[0-9a-z_-]*$");
        
        public static bool ValidateSlug(string slug)
        {
            return ValidationExpression.IsMatch(slug);
        }
    }
}
