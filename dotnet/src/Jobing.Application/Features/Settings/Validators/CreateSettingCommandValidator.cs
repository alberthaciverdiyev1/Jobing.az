using FluentValidation;
using Jobing.Application.Features.Settings.Commands;

namespace Jobing.Application.Features.Settings.Validators;

public class CreateSettingCommandValidator : AbstractValidator<CreateSettingCommand>
{
    public CreateSettingCommandValidator()
    {
        RuleFor(x => x.Key)
            .NotEmpty().WithMessage("Key is required")
            .MaximumLength(200).WithMessage("Key must not exceed 200 characters")
            .Matches("^[a-z0-9][a-z0-9._-]*$").WithMessage("Key must be lowercase and contain only letters, digits, dots, underscores or hyphens");

        RuleFor(x => x.Value)
            .Must(d => d == null || (d.ContainsKey("az") && !string.IsNullOrWhiteSpace(d["az"])))
                .WithMessage("Value (AZ) is required when a value is provided");

        RuleFor(x => x.Value)
            .Must(d => d == null || d.Values.All(v => v.Length <= 50000))
                .WithMessage("Each value translation must not exceed 50000 characters");

        RuleFor(x => x.Description)
            .MaximumLength(500).WithMessage("Description must not exceed 500 characters");
    }
}
