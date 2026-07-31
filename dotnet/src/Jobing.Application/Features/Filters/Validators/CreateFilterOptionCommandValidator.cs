using FluentValidation;
using Jobing.Application.Features.Filters.Commands;

namespace Jobing.Application.Features.Filters.Validators;

public class CreateFilterOptionCommandValidator : AbstractValidator<AddFilterOptionCommand>
{
    public CreateFilterOptionCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty()
            .Must(d => d.Count > 0 && d.Values.All(v => !string.IsNullOrWhiteSpace(v)));
    }
}
