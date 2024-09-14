import express from 'express';
//import bodyParser from 'body-parser';
import routes from './src/Routes/Main.js';
import sequelize from './src/Config/Database.js';
import swaggerDocs from './src/Config/Swagger.js';


const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

if (process.env.NODE_ENV !== 'production') {
    (async () => {
        try {
            const { default: loggerMiddleware } = await import('./src/Middlewares/Logger.js');
            app.use(loggerMiddleware);
        } catch (error) {
            console.error('Error loading logger middleware:', error);
        }
    })();
}
app.use('/api', routes);
swaggerDocs(app);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

// sequelize.sync({ alter: true }).then(() => {
//     app.listen(port, () => {
//         console.log(`Server is running at http://localhost:${port}`);
//     });
// }).catch((error) => {
//     console.error('Unable to connect to the database:', error);
// });
