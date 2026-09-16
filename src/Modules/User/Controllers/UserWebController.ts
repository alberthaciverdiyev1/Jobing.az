import type { Request, RequestHandler } from 'express';
import { isAppError } from '../../../Core/Http/Errors.js';
import { fieldErrors } from '../../../Core/Http/Validation.js';
import { renderPage } from '../../../Core/View/Edge.js';
import { addFlash } from '../../../Middlewares/Flash.js';
import { userService } from '../Services/UserService.js';
import { loginRequest, registerRequest } from '../Requests/index.js';

/** Only same-origin paths are accepted as post-login destinations. */
function safeRedirect(value: unknown): string {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//')
    ? value
    : '/profile';
}

function bodyOf(req: Request): Record<string, unknown> {
  return (req.body ?? {}) as Record<string, unknown>;
}

export const showRegister: RequestHandler = async (_req, res) => {
  await renderPage(res, 'User/Register', {
    pageTitle: res.locals.t('auth.register.title'),
    errors: {},
    values: {},
  });
};

export const register: RequestHandler = async (req, res) => {
  const parsed = registerRequest.safeParse(bodyOf(req));

  if (!parsed.success) {
    await renderPage(res.status(422), 'User/Register', {
      pageTitle: res.locals.t('auth.register.title'),
      errors: fieldErrors(parsed.error),
      values: bodyOf(req),
    });
    return;
  }

  try {
    const user = await userService.register(parsed.data);
    await regenerateSession(req);
    req.session.userId = user.id;
    addFlash(req, 'success', res.locals.t('auth.register.success'));
    res.redirect('/profile');
  } catch (error) {
    if (!isAppError(error)) throw error;

    await renderPage(res.status(error.statusCode), 'User/Register', {
      pageTitle: res.locals.t('auth.register.title'),
      errors: { email: error.message },
      values: bodyOf(req),
    });
  }
};

export const showLogin: RequestHandler = async (req, res) => {
  await renderPage(res, 'User/Login', {
    pageTitle: res.locals.t('auth.login.title'),
    errors: {},
    values: {},
    next: safeRedirect(req.query.next),
  });
};

export const login: RequestHandler = async (req, res) => {
  const body = bodyOf(req);
  const parsed = loginRequest.safeParse(body);

  if (!parsed.success) {
    await renderPage(res.status(422), 'User/Login', {
      pageTitle: res.locals.t('auth.login.title'),
      errors: fieldErrors(parsed.error),
      values: body,
      next: safeRedirect(body.next),
    });
    return;
  }

  try {
    const user = await userService.authenticate(parsed.data.email, parsed.data.password);
    await regenerateSession(req);
    req.session.userId = user.id;
    addFlash(req, 'success', res.locals.t('auth.login.success'));
    res.redirect(safeRedirect(body.next));
  } catch (error) {
    if (!isAppError(error)) throw error;

    await renderPage(res.status(error.statusCode), 'User/Login', {
      pageTitle: res.locals.t('auth.login.title'),
      errors: { password: res.locals.t('auth.login.invalid') },
      values: body,
      next: safeRedirect(body.next),
    });
  }
};

export const logout: RequestHandler = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('jobing.sid');
    res.redirect('/');
  });
};

export const profile: RequestHandler = async (_req, res) => {
  await renderPage(res, 'User/Profile', {
    pageTitle: res.locals.t('auth.profile.title'),
    errors: {},
    values: {},
  });
};

/** Drops the old session id so a stolen cookie cannot be reused after login. */
async function regenerateSession(req: Request): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    req.session.regenerate((error) => (error ? reject(error) : resolve()));
  });
}
