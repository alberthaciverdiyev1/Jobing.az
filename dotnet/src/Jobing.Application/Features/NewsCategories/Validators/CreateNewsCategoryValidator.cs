using FluentValidation;
using Jobing.Application.Features.NewsCategories.DTOs;

namespace Jobing.Application.Features.NewsCategories.Validators;

public class CreateNewsCategoryValidator : AbstractValidator<CreateNewsCategoryRequest>
{
    public CreateNewsCategoryValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
    }
}
