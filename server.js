const express = require('express');
const app = express();
const port = 5001;

app.get('/endpoint', (req, res) => {
  res.send('Hello from Express!');
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});