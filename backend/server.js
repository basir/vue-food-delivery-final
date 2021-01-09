import express from 'express';
import data from './data.js';
import path from 'path';
const app = express();

app.get('/api/products', (req, res) => {
  res.send(data.products);
});

app.get('/api/products/:id', (req, res) => {
  res.send(data.products.find((x) => x._id === req.params.id));
});

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/dist')));
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/dist/index.html'))
);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});
