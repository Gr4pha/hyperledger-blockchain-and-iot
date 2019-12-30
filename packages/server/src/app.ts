import express from 'express'; // npm install --save @types/express
var cors = require('cors'); // npm install --save cors
import * as bodyParser from 'body-parser';
import { port as serverPort } from './env';
import router from './controllers/router';



const app: express.Application = express();
const port = serverPort;

// https://medium.com/@alexishevia/using-cors-in-express-cac7e29b005b
app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true,
    limit: '40mb'
}));

app.use(bodyParser.json({ limit: '40mb' }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

app.use('/', router);

app.listen(port, () =>
    console.log('Server started in port ' + port));

module.exports = app;
