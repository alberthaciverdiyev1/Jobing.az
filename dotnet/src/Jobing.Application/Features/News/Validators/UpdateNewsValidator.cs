using FluentValidation;
using Jobing.Application.Features.News.DTOs;

namespace Jobing.Application.Features.News.Validators;

public class UpdateNewsValidator : AbstractValidator<UpdateNewsRequest>
{
    public UpdateNewsValidator()
    {
        RuleFor(x => x.Title).NotEmpty().MaximumLength(500);
        RuleFor(x => x.Excerpt).MaximumLength(1000);
    }
}
