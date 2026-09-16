import type { Request, RequestHandler } from 'express';
import { isAppError } from '../../../Core/Http/Errors.js';
import { fieldErrors } from '../../../Core/Http/Validation.js';
import { moduleView } from '../../../Core/View/ModuleView.js';
import { addFlash } from '../../../Middlewares/Flash.js';
import { userService } from '../Services/UserService.js';
import { loginSchema, registerSchema } from '../Validators/UserValidators.js';

const VIEW = (name: string): string => moduleView('User', name);

/** Only same-origin paths are accepted as post-login destinations. */
function safeRedirect(value: unknown): string {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//')
    ? value
    : '/profile';
}

function bodyOf(req: Request): Record<string, unknown> {
  return (req.body ?? {}) as Record<string, unknown>;
}

export const showRegister: RequestHandler = (_req, res) => {
  res.render(VIEW('Register'), {
    pageTitle: res.locals.t('auth.register.title'),
    errors: {},
    values: {},
  });
};

export const register: RequestHandler = async (req, res) => {
  const parsed = registerSchema.safeParse(bodyOf(req));

  if (!parsed.success) {
    res.status(422).render(VIEW('Register'), {
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

    res.status(error.statusCode).render(VIEW('Register'), {
      pageTitle: res.locals.t('auth.register.title'),
      errors: { email: error.message },
      values: bodyOf(req),
    });
  }
};

export const showLogin: RequestHandler = (req, res) => {
  res.render(VIEW('Login'), {
    pageTitle: res.locals.t('auth.login.title'),
    errors: {},
    values: {},
    next: safeRedirect(req.query.next),
  });
};

export const login: RequestHandler = async (req, res) => {
  const body = bodyOf(req);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    res.status(422).render(VIEW('Login'), {
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

    res.status(error.statusCode).render(VIEW('Login'), {
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

export const profile: RequestHandler = (_req, res) => {
  res.render(VIEW('Profile'), {
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
