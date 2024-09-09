import express from 'express';
//import bodyParser from 'body-parser';
import routes from './src/Routes/main.js';
import sequelize from './src/Config/database.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
//app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', routes);

sequelize.sync({ alter: true }).then(() => {
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}).catch((error) => {
    console.error('Unable to connect to the database:', error);
});
