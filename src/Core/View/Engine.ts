import path from 'node:path';
import type { Express } from 'express';
import { create } from 'express-handlebars';
import { env, isProduction } from '../../Config/Env.js';
import { paths } from '../../Config/Paths.js';
import { helpers } from './Helpers.js';

/**
 * Registers Handlebars as the view engine.
 *
 * Layouts live in `views/Layouts`, partials in `views/Partials` and page
 * templates in `views/Pages`. A controller can override the layout by passing
 * `layout: 'Name'` to `res.render()`.
 */
export function registerViewEngine(app: Express): void {
  const hbs = create({
    extname: '.hbs',
    defaultLayout: 'Main',
    layoutsDir: path.join(paths.views, 'Layouts'),
    partialsDir: path.join(paths.views, 'Partials'),
    helpers,
  });

  app.engine('.hbs', hbs.engine);
  app.set('view engine', '.hbs');
  app.set('views', paths.views);

  if (isProduction) {
    app.enable('view cache');
  }

  // Available in every template, for every request.
  app.locals.appName = env.APP_NAME;
  app.locals.appSuffix = env.APP_SUFFIX;
  app.locals.appUrl = env.APP_URL;
  app.locals.isProduction = isProduction;
}
