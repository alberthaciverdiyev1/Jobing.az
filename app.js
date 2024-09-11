import express from 'express';
//import bodyParser from 'body-parser';
import routes from './src/Routes/Main.js';
import sequelize from './src/Config/Database.js';
import swaggerDocs from './src/Config/Swagger.js';


const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
//app.use(bodyParser.urlencoded({ extended: true }));

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
