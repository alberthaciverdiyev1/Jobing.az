using FluentValidation;
using Jobing.Application.Features.Cities.DTOs;

namespace Jobing.Application.Features.Cities.Validators;

public class UpdateCityValidator : AbstractValidator<UpdateCityRequest>
{
    public UpdateCityValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required")
            .Must(dict => dict.Count > 0).WithMessage("At least one translation is required")
            .Must(dict => dict.Values.All(v => !string.IsNullOrWhiteSpace(v)))
                .WithMessage("Translation values cannot be empty");
    }
}
