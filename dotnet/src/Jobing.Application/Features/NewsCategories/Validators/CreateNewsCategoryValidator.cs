using FluentValidation;
using Jobing.Application.Features.NewsCategories.DTOs;

namespace Jobing.Application.Features.NewsCategories.Validators;

public class CreateNewsCategoryValidator : AbstractValidator<CreateNewsCategoryRequest>
{
    public CreateNewsCategoryValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required")
            .Must(d => d.ContainsKey("az") && !string.IsNullOrWhiteSpace(d["az"]))
                .WithMessage("Name (AZ) is required");

        RuleFor(x => x.Name)
            .Must(d => d.Values.All(v => v.Length <= 200))
                .WithMessage("Each name translation must not exceed 200 characters");
    }
}
