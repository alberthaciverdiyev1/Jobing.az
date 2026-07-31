using FluentValidation;
using Jobing.Application.Features.Filters.Commands;

namespace Jobing.Application.Features.Filters.Validators;

public class UpdateFilterOptionCommandValidator : AbstractValidator<UpdateFilterOptionCommand>
{
    public UpdateFilterOptionCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty()
            .Must(d => d.Count > 0 && d.Values.All(v => !string.IsNullOrWhiteSpace(v)));
    }
}
