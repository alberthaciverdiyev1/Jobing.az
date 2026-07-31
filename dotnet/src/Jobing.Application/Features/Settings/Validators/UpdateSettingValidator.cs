using FluentValidation;
using Jobing.Application.Features.Settings.DTOs;

namespace Jobing.Application.Features.Settings.Validators;

public class UpdateSettingValidator : AbstractValidator<UpdateSettingRequest>
{
    public UpdateSettingValidator()
    {
        RuleFor(x => x.Key)
            .NotEmpty().WithMessage("Key is required")
            .MaximumLength(200).WithMessage("Key must not exceed 200 characters")
            .Matches("^[a-z0-9][a-z0-9._-]*$").WithMessage("Key must be lowercase and contain only letters, digits, dots, underscores or hyphens");

        RuleFor(x => x.Group)
            .NotEmpty().WithMessage("Group is required")
            .MaximumLength(100).WithMessage("Group must not exceed 100 characters")
            .Matches("^[a-z0-9][a-z0-9_-]*$").WithMessage("Group must be lowercase and contain only letters, digits, underscores or hyphens");

        RuleFor(x => x.Description)
            .MaximumLength(500).WithMessage("Description must not exceed 500 characters");
    }
}
