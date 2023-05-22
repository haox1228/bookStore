const express = require('express');
const bookBffRoutes = require('./routes/bookBffRoutes');

const app = express();
app.use(express.json());

app.get('/test', (req, res) => {
  res.status(200).send('Health check passed');
});
app.get('/status', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send('OK');
});
app.use('/books', bookBffRoutes);

const port = 80;
app.listen(port, () => {
  console.log(`Book BFF server is running on port ${port}`);
});