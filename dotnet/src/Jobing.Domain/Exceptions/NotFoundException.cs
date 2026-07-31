namespace Jobing.Domain.Exceptions;

public class NotFoundException : DomainException
{
    public NotFoundException(string entity, int id)
        : base($"{entity} with id '{id}' was not found.") { }

    public NotFoundException(string message) : base(message) { }
}
