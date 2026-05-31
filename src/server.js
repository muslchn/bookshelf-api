const express = require('express');
const routes = require('./routes');

const app = express();
const port = 9000;
const host = 'localhost';

app.use(express.json());
app.use(routes);

app.listen(port, host, () => {
  console.log(`Server berjalan pada http://${host}:${port}`);
});
