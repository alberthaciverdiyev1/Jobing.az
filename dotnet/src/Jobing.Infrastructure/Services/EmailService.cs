using Jobing.Application.Common.Interfaces;
using Microsoft.Extensions.Logging;

namespace Jobing.Infrastructure.Services;

public class EmailService : IEmailService
{
    private readonly ILogger<EmailService> _logger;

    public EmailService(ILogger<EmailService> logger)
    {
        _logger = logger;
    }

    public Task SendPasswordResetEmailAsync(string email, string resetLink)
    {
        // TODO: Replace with real email provider (SMTP, SendGrid, etc.)
        _logger.LogInformation(
            "Password reset requested for {Email}. Reset link: {ResetLink}",
            email, resetLink);

        return Task.CompletedTask;
    }
}
