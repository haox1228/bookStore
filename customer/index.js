const express = require('express');
const bodyParser = require('body-parser');
const customerRoutes = require('./routes/customerRoutes');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/customers', customerRoutes);
app.get('/status', (req, res) => {
    res.set('Content-Type', 'text/plain');
    res.send('OK');
  });
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Books microservice running at http://localhost:${port}');
    });