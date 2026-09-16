import type { Request, RequestHandler } from 'express';
import { UnauthorizedError } from '../../../Core/Http/Errors.js';
import { created, noContent, ok } from '../../../Core/Http/Responses.js';
import { userService } from '../Services/UserService.js';
import type { LoginInputSchema, RegisterInputSchema } from '../Validators/UserValidators.js';

function registerInput(req: Request): RegisterInputSchema {
  return req.validated?.body as RegisterInputSchema;
}

function loginInput(req: Request): LoginInputSchema {
  return req.validated?.body as LoginInputSchema;
}

export const register: RequestHandler = async (req, res) => {
  const user = await userService.register(registerInput(req));

  await new Promise<void>((resolve, reject) => {
    req.session.regenerate((error) => (error ? reject(error) : resolve()));
  });
  req.session.userId = user.id;

  created(res, { user });
};

export const login: RequestHandler = async (req, res) => {
  const { email, password } = loginInput(req);
  const user = await userService.authenticate(email, password);

  await new Promise<void>((resolve, reject) => {
    req.session.regenerate((error) => (error ? reject(error) : resolve()));
  });
  req.session.userId = user.id;

  ok(res, { user });
};

export const logout: RequestHandler = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('jobing.sid');
    noContent(res);
  });
};

export const me: RequestHandler = (req, res) => {
  if (!req.user) throw new UnauthorizedError('Authentication required');
  ok(res, { user: req.user });
};
