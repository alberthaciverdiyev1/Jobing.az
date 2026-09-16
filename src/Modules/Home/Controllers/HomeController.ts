import type { RequestHandler } from 'express';
import { moduleView } from '../../../Core/View/ModuleView.js';

export const index: RequestHandler = (_req, res) => {
  res.render(moduleView('Home', 'Home'), {
    pageTitle: res.locals.t('home.title'),
    pageDescription: res.locals.t('home.subtitle'),
  });
};
