using FluentValidation;
using Jobing.Application.Features.BlogCategories.DTOs;

namespace Jobing.Application.Features.BlogCategories.Validators;

public class CreateBlogCategoryValidator : AbstractValidator<CreateBlogCategoryRequest>
{
    public CreateBlogCategoryValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required")
            .MaximumLength(200).WithMessage("Name must not exceed 200 characters");
    }
}
