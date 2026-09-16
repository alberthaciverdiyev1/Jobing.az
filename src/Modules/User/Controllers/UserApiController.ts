import type { Request, RequestHandler } from 'express';
import { clearAuthToken, issueAuthToken } from '../../../Core/Auth/AuthTokenCookie.js';
import { UnauthorizedError } from '../../../Core/Http/Errors/index.js';
import { created, noContent, ok } from '../../../Core/Http/Responses.js';
import { userService } from '../Services/index.js';
import { transformUser } from '../Transformers/UserTransformer.js';
import type { LoginRequest, RegisterRequest } from '../Requests/index.js';

function registerInput(req: Request): RegisterRequest {
  return req.validated?.body as RegisterRequest;
}

function loginInput(req: Request): LoginRequest {
  return req.validated?.body as LoginRequest;
}

export const register: RequestHandler = async (req, res) => {
  const user = await userService.register(registerInput(req));
  const auth = await issueAuthToken(res, user.id);

  created(res, {
    user: transformUser(user),
    token: auth.token,
    expiresAt: auth.expiresAt.toISOString(),
  });
};

export const login: RequestHandler = async (req, res) => {
  const { email, password } = loginInput(req);
  const user = await userService.authenticate(email, password);
  const auth = await issueAuthToken(res, user.id);

  ok(res, {
    user: transformUser(user),
    token: auth.token,
    expiresAt: auth.expiresAt.toISOString(),
  });
};

export const logout: RequestHandler = (_req, res) => {
  clearAuthToken(res);
  noContent(res);
};

export const me: RequestHandler = (req, res) => {
  if (!req.user) throw new UnauthorizedError('Authentication required');
  ok(res, { user: transformUser(req.user) });
};
