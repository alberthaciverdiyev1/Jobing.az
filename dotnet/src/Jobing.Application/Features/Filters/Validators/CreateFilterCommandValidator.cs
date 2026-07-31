using FluentValidation;
using Jobing.Application.Features.Filters.Commands;

namespace Jobing.Application.Features.Filters.Validators;

public class CreateFilterCommandValidator : AbstractValidator<CreateFilterCommand>
{
    public CreateFilterCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty()
            .Must(d => d.Count > 0 && d.Values.All(v => !string.IsNullOrWhiteSpace(v)));
    }
}
