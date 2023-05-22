const express = require('express');
const bodyParser = require('body-parser');

const bookRoutes = require('./routes/bookRoutes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/books', bookRoutes);
const port = process.env.PORT || 3000;
app.get('/status', (req, res) => {
    res.set('Content-Type', 'text/plain');
    res.send('OK');
  });
app.listen(port, () => {
    console.log('Books microservice running at http://localhost:${port}');
    });