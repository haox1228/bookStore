const express = require('express');
const customerBffRoutes = require('./routes/customerBffRoutes');


const app = express();
app.use(express.json());

app.use('/customers', customerBffRoutes);
app.get('/test', (req, res) => {
  res.status(200).send('Health check passed');
});
app.get('/status', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send('OK');
});

const port = 80;


app.listen(port, () => {
  console.log(`Book BFF server is running on port ${port}`);
});