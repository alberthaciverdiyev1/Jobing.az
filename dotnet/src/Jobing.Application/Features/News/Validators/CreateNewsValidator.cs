using FluentValidation;
using Jobing.Application.Features.News.DTOs;

namespace Jobing.Application.Features.News.Validators;

public class CreateNewsValidator : AbstractValidator<CreateNewsRequest>
{
    public CreateNewsValidator()
    {
        RuleFor(x => x.Title).NotEmpty().MaximumLength(500);
        RuleFor(x => x.Excerpt).MaximumLength(1000);
    }
}
