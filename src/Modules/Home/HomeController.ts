import type { RequestHandler } from 'express';

export const index: RequestHandler = (_req, res) => {
  res.render('Pages/Home', {
    pageTitle: res.locals.t('home.title'),
    pageDescription: res.locals.t('home.subtitle'),
  });
};
