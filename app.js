import express from 'express';
import path from 'path'; // Import path
import routes from './src/Routes/Main.js';
import sequelize from './src/Config/Database.js';
import swaggerDocs from './src/Config/Swagger.js';

const app = express();
const port = process.env.PORT || 3001;
app.set('view engine', 'ejs');
app.set('views', './src/Views');
app.use(express.static(path.resolve('./src/Public')));

app.use(express.json());

// if (process.env.NODE_ENV !== 'production') {
//     (async () => {
//         try {
//             const { default: loggerMiddleware } = await import('./src/Middlewares/Logger.js');
//             app.use(loggerMiddleware);
//         } catch (error) {
//             console.error('Error loading logger middleware:', error);
//         }
//     })();
// }

app.use('/', routes);

// Uncomment for Swagger if needed
// swaggerDocs(app);

// Sync database and start server

// Sync database and start server
// sequelize.sync({ alter: true }).then(() => {
//     app.listen(port, () => {
//         console.log(`Server is running at http://localhost:${port}`);
//     });
// }).catch((error) => {
//     console.error('Unable to connect to the database:', error);
// });


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});