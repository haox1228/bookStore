const express = require('express');
const bodyParser = require('body-parser');
const customerRoutes = require('./routes/customerRoutes');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/test', (req, res) => {
  res.status(200).send('Health check passed');
});

app.use('/customers', customerRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Books microservice running at http://localhost:${port}');
    });