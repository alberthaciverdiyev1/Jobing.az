using FluentValidation;
using Jobing.Application.Features.Blogs.DTOs;

namespace Jobing.Application.Features.Blogs.Validators;

public class UpdateBlogPostValidator : AbstractValidator<UpdateBlogPostRequest>
{
    public UpdateBlogPostValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required")
            .Must(d => d.ContainsKey("az") && !string.IsNullOrWhiteSpace(d["az"]))
                .WithMessage("Title (AZ) is required");

        RuleFor(x => x.Title)
            .Must(d => d.Values.All(v => v.Length <= 500))
                .WithMessage("Each title translation must not exceed 500 characters");

        RuleFor(x => x.Excerpt)
            .Must(d => d == null || d.Values.All(v => v.Length <= 1000))
                .WithMessage("Each excerpt translation must not exceed 1000 characters");
    }
}
