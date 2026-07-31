using FluentValidation;
using Jobing.Application.Features.Jobs.DTOs;

namespace Jobing.Application.Features.Jobs.Validators;

public class CreateJobValidator : AbstractValidator<CreateJobRequest>
{
    public CreateJobValidator()
    {
        RuleFor(x => x.Title)
            .Must(d => d.ContainsKey("az") && !string.IsNullOrWhiteSpace(d["az"]))
                .WithMessage("Title (AZ) is required")
            .Must(d => d.Values.All(v => v.Length <= 255))
                .WithMessage("Each title translation must not exceed 255 characters");

        RuleFor(x => x.Description)
            .Must(d => d == null || (d.ContainsKey("az") && !string.IsNullOrWhiteSpace(d["az"])))
                .WithMessage("Description (AZ) is required when a description is provided")
            .Must(d => d == null || d.Values.All(v => v.Length <= 10000))
                .WithMessage("Each description translation must not exceed 10000 characters");

        RuleFor(x => x.Requirements)
            .Must(d => d == null || d.Values.All(v => v.Length <= 10000))
                .WithMessage("Each requirements translation must not exceed 10000 characters");

        RuleFor(x => x.SalaryText)
            .Must(d => d == null || d.Values.All(v => v.Length <= 200))
                .WithMessage("Each salary text translation must not exceed 200 characters");

        RuleFor(x => x.Currency)
            .IsInEnum().WithMessage("Currency must be AZN, USD or EUR");

        RuleFor(x => x.ApplicationMethod)
            .Must(m => m == null || m == "email" || m == "url")
                .WithMessage("ApplicationMethod must be 'email' or 'url'");

        RuleFor(x => x.ApplicationUrl)
            .MaximumLength(500).WithMessage("ApplicationUrl must not exceed 500 characters");

        RuleFor(x => x)
            .Must(j => j.MinSalary == null || j.MaxSalary == null || j.MinSalary <= j.MaxSalary)
                .WithMessage("MinSalary must not exceed MaxSalary");
    }
}
