using FluentValidation;
using Jobing.Domain.Exceptions;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace Jobing.Api.Middlewares;

public class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
    {
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        var (statusCode, title, message) = exception switch
        {
            NotFoundException ex => (StatusCodes.Status404NotFound, "Not Found", ex.Message),
            ConflictException ex => (StatusCodes.Status409Conflict, "Conflict", ex.Message),
            UnauthorizedAccessException ex => (StatusCodes.Status401Unauthorized, "Unauthorized", ex.Message),
            ValidationException ex => (StatusCodes.Status400BadRequest, "Validation Failed",
                string.Join("; ", ex.Errors.Select(e => e.ErrorMessage))),
            DomainException ex => (StatusCodes.Status400BadRequest, "Bad Request", ex.Message),
            _ => (StatusCodes.Status500InternalServerError, "Internal Server Error", "An unexpected error occurred.")
        };

        if (statusCode == StatusCodes.Status500InternalServerError)
            _logger.LogError(exception, "Unhandled exception");

        var problemDetails = new ProblemDetails
        {
            Status = statusCode,
            Title = title,
            Detail = message,
            Type = $"https://httpstatuses.com/{statusCode}"
        };
        problemDetails.Extensions["message"] = message;

        if (exception is ValidationException validationException)
            problemDetails.Extensions["errors"] = validationException.Errors;

        httpContext.Response.StatusCode = statusCode;
        await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);
        return true;
    }
}
