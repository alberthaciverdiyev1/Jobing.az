import type { RequestHandler } from 'express';
import { renderPage } from '../../../Core/View/Edge.js';

export const index: RequestHandler = async (_req, res) => {
  await renderPage(res, 'Home/Home', {
    pageTitle: res.locals.t('home.title'),
    pageDescription: res.locals.t('home.subtitle'),
  });
};
