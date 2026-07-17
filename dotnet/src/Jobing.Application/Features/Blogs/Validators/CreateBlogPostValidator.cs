using FluentValidation;
using Jobing.Application.Features.Blogs.DTOs;

namespace Jobing.Application.Features.Blogs.Validators;

public class CreateBlogPostValidator : AbstractValidator<CreateBlogPostRequest>
{
    public CreateBlogPostValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required")
            .MaximumLength(500).WithMessage("Title must not exceed 500 characters");

        RuleFor(x => x.Excerpt)
            .MaximumLength(1000).WithMessage("Excerpt must not exceed 1000 characters");
    }
}
