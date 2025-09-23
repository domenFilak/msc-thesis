const jwt = require('jsonwebtoken'); //knjižnica jsonwebtoken - za ustvarjanje in preverjanje veljavnosti JWT-jev
require('dotenv').config(); //naložimo okoljske spremenljivke iz .env datoteke

const SECRET = process.env.JWT_SECRET; //tajni ključ => za podpis in preverjanje veljavnosti JWT

//izvoz funkcije vmesne programske kode, ki se bo izvajala pred dostopom do vseh zavarovanih API končnih točk na strežniku
module.exports = function jwtMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || ''; //prebere glavo avtorizacije (pričakovana oblika: "Bearer shranjena.vrednost.jwt")
  const token = authHeader.replace(/Bearer\s+/i, ''); //Odstrani "Bearer " del tako, da ostane samo dejanska vrednost JWT

  //v kolikor JWT ni bil posredovan ob zahtevku v glavi avtorizacije, kot odgovor na ta zahtevek pošlji spodnje sporočilo
  if (!token) {
    return res.status(401).json({ message: 'JWT required' });
  }

  try {
    const decoded = jwt.verify(token, SECRET); //preveri veljanost JWT z uporabo tajnega ključa
    req.user = decoded; //če veljaven => dekodiraj njegov tovor (npr. { user: "admin", iat: ..., exp: ... }) in ga shrani v req.user
    next(); //vrnemo next() => pomeni, da se je ta middleware uspešno izvedel in se lahko za njim izvede naslednji: to je sama logika v naši app.get() poti (API končni točki)
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired JWT' }); //v primeru da JWT ni veljaven (neveljaven oz. potečen JWT)
  }
};
