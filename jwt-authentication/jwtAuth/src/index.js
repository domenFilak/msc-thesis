//uvozimo zahtevane module

const express = require('express'); //za sam strežnik
const jwt = require('jsonwebtoken'); //knjižnica jsonwebtoken - za ustvarjanje in preverjanje veljavnosti JWT-jev
const jwtMiddleware = require('./middleware/jwtMiddleware'); //lasten middleware (vmesna programska koda), za JWT authentication
require('dotenv').config(); //naložimo okoljske spremenljivke iz .env datoteke

const app = express(); //ustvari instanco express aplikacije
const PORT = process.env.PORT || 3000; //če obstaja => uporabi PORT vrednost iz .env datoteke (okoljska spremenljivka) , sicer => PORT = 3000
const SECRET = process.env.JWT_SECRET; //tajni ključ => za podpis in preverjanje veljavnosti JWT

app.use(express.json()); //vmesna programska koda, ki pretvori prejeto JSON telo v zahtevku v req.body

/*
  Login API končna točka
  POST /login
  - V telesu zahtevka pričakuje uporabniško ime in geslo (oblika JSON)
  - Če je par uporabniškega imena in gesla veljaven => ustvari, podpiše JWT in ga vrne klientu v odgovoru
  - Klient mora nato ta prejeti JWT vključiti v vsakem naslednjem zahtevku na neko zavarovano API končno točko tukaj na strežniku => v glavi avtorizacije, kot Bearer token
 */
app.post('/login', (req, res) => {
  const { username, password } = req.body; //izvleči in shrani posredovano uporabniško ime in geslo (s strani klienta v telesu zahtevka)

  if (username === 'admin' && password === '1234') { //če je uporabniško ime enako 'admin' in geslo enako '1234', je potem klientu ustvarjen JWT in dovoljen dostop do zavarovanih virov (API končnih točk na strežniku)
    const token = jwt.sign({ user: username }, SECRET, { expiresIn: '1h' }); //ustvari podpisani JWT z rokom veljavnosti 1 ure
    return res.json({ token }); //Pošlji JWT nazaj klientu v odgovoru na prvotni zahtevek - klient si ga mora shraniti na varnem mestu
  }

  res.status(401).json({ message: 'Invalid credentials' }); //odgovor klientu na prvotni zahtevek v kolikor vpis ni uspešen
});

app.use(jwtMiddleware); //uporabi lasten middleware za vse endpointe (API končne točke) od tukaj naprej

/**
   zavarovani vir na strežniku - korenska pot, uporablja jwtMiddleware in ob uspešni prijavi se izpiše spodnje sporočilo
   GET /
   - Klient lahko do tega dostopa le, če je v glavi avtorizacije posredovan veljaven JWT (kot Bearer token)
   - jwtMiddleware bo dekodiran tovor priložil k req.user  
*/
app.get('/', (req, res) => {
  res.json({ message: `Hello, ${req.user.user}. You are authenticated.` });
});

//zaženi strežnik na vratih PORT in izpiši sporočilo
app.listen(PORT, () => {
  console.log("Server running on http://localhost:" + PORT);
});
