//uvozimo zahtevane module

const express = require('express'); //za sam strežnik
const apiKeyMiddleware = require('./middleware/apiKeyMiddleware'); //lasten middleware (vmesna programska koda), za api key authentication
require('dotenv').config(); //naložimo okoljske spremenljivke iz .env datoteke

const app = express(); //ustvari instanco express aplikacije

const PORT = process.env.PORT || 3000; // če obstaja => uporabi PORT vrednost iz .env datoteke (okoljska spremenljivka) , sicer => PORT = 3000

app.use(apiKeyMiddleware); //uporabi lasten middleware za vse endpointe (poti) od tukaj naprej

//korenska pot, uporablja apiKeyMiddleware in ob uspešni validaciji API ključa izpiše spodnje JSON sporočilo
app.get('/', (req, res) => {
  res.status(200).json({ message: 'API key valid - access granted' });
});

//zaženi strežnik na vratih PORT in izpiši sporočilo
app.listen(PORT, () => {
  console.log('Server running on http://localhost:' + PORT);
});
