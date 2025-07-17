const express = require('express');
const cors = require('cors');
const reniecRoute = require('./routes/reniec');

const app = express();
app.use(cors());
app.use(express.json());

// Rutas protegidas
app.use('/api/reniec', reniecRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
