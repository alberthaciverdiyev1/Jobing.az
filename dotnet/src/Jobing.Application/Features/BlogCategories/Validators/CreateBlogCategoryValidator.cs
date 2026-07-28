using FluentValidation;
using Jobing.Application.Features.BlogCategories.DTOs;

namespace Jobing.Application.Features.BlogCategories.Validators;

public class CreateBlogCategoryValidator : AbstractValidator<CreateBlogCategoryRequest>
{
    public CreateBlogCategoryValidator()
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
