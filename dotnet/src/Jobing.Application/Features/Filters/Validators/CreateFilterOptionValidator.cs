using FluentValidation;
using Jobing.Application.Features.Filters.DTOs;

namespace Jobing.Application.Features.Filters.Validators;

public class CreateFilterOptionValidator : AbstractValidator<CreateFilterOptionRequest>
{
    public CreateFilterOptionValidator()
    {
        RuleFor(x => x.Name).NotEmpty()
            .Must(d => d.Count > 0 && d.Values.All(v => !string.IsNullOrWhiteSpace(v)));
    }
}
