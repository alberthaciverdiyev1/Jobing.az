import express from 'express';
import path from 'path';
import routes from './src/Routes/Main.js';
import sequelize from './src/Config/Database.js';
import swaggerDocs from './src/Config/Swagger.js';
import loggerMiddleware from './src/Middlewares/Logger.js';
import Production from './src/Helpers/Production.js';

const app = express();
const port = process.env.PR_PORT || 3001;

app.set('view engine', 'ejs');
app.set('views', './src/Views');
app.use(express.static(path.resolve('./src/Public')));
app.use(express.json());

app.use((req, res, next) => {
    res.locals.Production = Production;
    next();
});

app.use(loggerMiddleware);
app.use('/', routes);

// swaggerDocs(app);

// sequelize.sync({ alter: true })
//     .then(() => {
//         app.listen(port, () => {
//             console.log(`Server is running at http://localhost:${port}`);
//         });
//     })
//     .catch((error) => {
//         console.error('Unable to connect to the database:', error);
//     });

app.use((req, res, next) => {
    res.status(404).send('404 Not Found');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
