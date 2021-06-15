using Microsoft.AspNetCore.Mvc;

namespace Riddim.Data
{
    public class ValidationResult<T>
    {
        public bool Valid { get; init; }
        public ActionResult<T> ErrorResult { get; init; }

        public static ValidationResult<T> Create(ActionResult<T> errorResult)
        {
            return new ValidationResult<T>
            {
                Valid = false,
                ErrorResult = errorResult
            };
        }

        public static ValidationResult<T> Create()
        {
            return new ValidationResult<T>
            {
                Valid = true
            };
        }
    }
}
