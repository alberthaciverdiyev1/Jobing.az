import type { Request, RequestHandler } from 'express';
import { UnauthorizedError } from '../../../Core/Http/Errors.js';
import { created, noContent, ok } from '../../../Core/Http/Responses.js';
import { userService } from '../Services/UserService.js';
import { transformUser } from '../Transformers/UserTransformer.js';
import type { LoginInputSchema, RegisterInputSchema } from '../Validators/UserValidators.js';

function registerInput(req: Request): RegisterInputSchema {
  return req.validated?.body as RegisterInputSchema;
}

function loginInput(req: Request): LoginInputSchema {
  return req.validated?.body as LoginInputSchema;
}

/** Replaces the session id so a stolen cookie cannot be reused after login. */
async function startSession(req: Request, userId: string): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    req.session.regenerate((error) => (error ? reject(error) : resolve()));
  });
  req.session.userId = userId;
}

export const register: RequestHandler = async (req, res) => {
  const user = await userService.register(registerInput(req));
  await startSession(req, user.id);

  created(res, { user: transformUser(user) });
};

export const login: RequestHandler = async (req, res) => {
  const { email, password } = loginInput(req);
  const user = await userService.authenticate(email, password);
  await startSession(req, user.id);

  ok(res, { user: transformUser(user) });
};

export const logout: RequestHandler = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('jobing.sid');
    noContent(res);
  });
};

export const me: RequestHandler = (req, res) => {
  if (!req.user) throw new UnauthorizedError('Authentication required');
  ok(res, { user: transformUser(req.user) });
};
