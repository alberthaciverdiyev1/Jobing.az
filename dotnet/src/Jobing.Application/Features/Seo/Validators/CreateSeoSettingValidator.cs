using FluentValidation;
using Jobing.Application.Features.Seo.DTOs;

namespace Jobing.Application.Features.Seo.Validators;

public class CreateSeoSettingValidator : AbstractValidator<CreateSeoSettingRequest>
{
    public CreateSeoSettingValidator()
    {
        RuleFor(x => x.PageKey)
            .NotEmpty().WithMessage("PageKey is required")
            .MaximumLength(100).WithMessage("PageKey must not exceed 100 characters")
            .Matches("^[a-z0-9][a-z0-9._-]*$").WithMessage("PageKey must be lowercase and contain only letters, digits, dots, underscores or hyphens");

        RuleFor(x => x.Title)
            .Must(d => d != null && d.ContainsKey("az") && !string.IsNullOrWhiteSpace(d["az"]))
                .WithMessage("Title (AZ) is required")
            .Must(d => d == null || d.Values.All(v => v.Length <= 200))
                .WithMessage("Each title translation must not exceed 200 characters");

        RuleFor(x => x.Description)
            .Must(d => d == null || (d.ContainsKey("az") && !string.IsNullOrWhiteSpace(d["az"])))
                .WithMessage("Description (AZ) is required when a description is provided")
            .Must(d => d == null || d.Values.All(v => v.Length <= 500))
                .WithMessage("Each description translation must not exceed 500 characters");

        RuleFor(x => x.Keywords)
            .Must(d => d == null || (d.ContainsKey("az") && !string.IsNullOrWhiteSpace(d["az"])))
                .WithMessage("Keywords (AZ) is required when keywords are provided")
            .Must(d => d == null || d.Values.All(v => v.Length <= 500))
                .WithMessage("Each keywords translation must not exceed 500 characters");

        RuleFor(x => x.OgImage)
            .MaximumLength(500).WithMessage("OgImage must not exceed 500 characters");
    }
}
