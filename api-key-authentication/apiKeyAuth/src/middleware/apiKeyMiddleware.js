require('dotenv').config(); //naložimo okoljske spremenljivke iz .env datoteke

//definiramo samo funkcijo (logiko) za naš lasten middleware (vmesno programsko kodo) za API key authentication metodo
module.exports = function apiKeyMiddleware(req, res, next) {
  const apiKey = req.headers['x-api-key']; //pridobimo vrednost API ključa iz glave zahtevka (natančneje iz polja 'x-api-key' v glavi zahtevka)
  const expectedKey = process.env.API_KEY; //iz nabora okoljskih spremenljivk pridobimo pričakovani (pravilni!) API ključ

  //preverimo, ali je bil API ključ sploh posredovan v glavi zahtevka in ali se ujema s pričakovanim (pravilnim!) API ključem
  if (apiKey && apiKey === expectedKey) {
    next(); //vrnemo next() => pomeni, da se je ta middleware uspešno izvedel in se lahko za njim izvede naslednji: to je sama logika v naši app.get() poti
  } else {
    res.status(401).json({ error: 'Unauthorized - invalid API key' }); //če API ključ ni bil posredovan oz. je napačen, vrnemo statusno kodo 401 (nepooblaščeno)
  }
};


