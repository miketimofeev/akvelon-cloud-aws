const express = require('express'),
  app = express();

app.get('/', (req, res) => {
  console.log(req.ip);
  res.send({ok: 1});
});

app.listen(8080, () => {
  console.log('app started on 8080 port');
});
