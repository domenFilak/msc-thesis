//uvozimo zahtevane module

const express = require('express'); //za sam strežnik
const authMiddleware = require('./middleware/authMiddleware'); //lasten middleware (vmesna programska koda), za basic authentication
require('dotenv').config(); //naložimo okoljske spremenljivke iz .env datoteke

const app = express(); //ustvari instanco express aplikacije

const PORT = process.env.PORT || 3000; // če obstaja => uporabi PORT vrednost iz .env datoteke (okoljska spremenljivka) , sicer => PORT = 3000

app.use(authMiddleware); //uporabi lasten middleware za vse endpointe (poti) od tukaj naprej

//korenska pot, uporablja authMiddleware in ob uspešni prijavi se izpiše spodnje sporočilo
app.get('/', (req, res) => {
    res.status(200).send({msg: "User authenticated!"});
});

//zaženi strežnik na vratih PORT in izpiši sporočilo  
app.listen(PORT, () => {
    console.log('Server running on http://localhost:' + PORT);
});