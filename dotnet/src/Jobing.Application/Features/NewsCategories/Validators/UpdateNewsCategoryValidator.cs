using FluentValidation;
using Jobing.Application.Features.NewsCategories.DTOs;

namespace Jobing.Application.Features.NewsCategories.Validators;

public class UpdateNewsCategoryValidator : AbstractValidator<UpdateNewsCategoryRequest>
{
    public UpdateNewsCategoryValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
    }
}
