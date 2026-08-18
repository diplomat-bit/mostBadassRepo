// REPOSITORY SOURCE: diplomat-bit/Fuckyou | PATH: diplomat-bit-Fuckyou-70f83c5/server/index.js
================================================================================

const express = require('express');
const app = express();
const routes = require('./routes.js');

app.use(express.json());

app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

================================================================================
// APPENDED FROM REPO: diplomat-bit/magic | ORIGINAL PATH: diplomat-bit-magic-a3f5ff1/server/index.js
================================================================================

const express = require('express');
const app = express();
const routes = require('./routes.js');

app.use(express.json());

app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});