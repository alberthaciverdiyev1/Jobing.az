using FluentValidation;
using Jobing.Application.Features.Filters.Commands;

namespace Jobing.Application.Features.Filters.Validators;

public class UpdateFilterCommandValidator : AbstractValidator<UpdateFilterCommand>
{
    public UpdateFilterCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty()
            .Must(d => d.Count > 0 && d.Values.All(v => !string.IsNullOrWhiteSpace(v)));
    }
}
