//uvozimo zahtevane module

const express = require('express'); //za sam strežnik
const session = require('express-session'); //modul za upravljanje sej (session) v Express aplikaciji
const passport = require('passport'); //Passport.js – modul za avtentikacijo uporabnikov (npr. prijava z Google računom)
require('dotenv').config(); //naložimo okoljske spremenljivke iz .env datoteke
require('./config/oauth2');//naloži in inicializira konfiguracijo OAuth 2.0 (GoogleStrategy, serialize/deserialize) za Passport => torej za to našo spletno aplikacijo

const isLoggedIn = require('./middleware/isLoggedInMiddleware'); //uvozimo lasten middleware (vmesno programsko kodo)

const app = express(); //ustvari instanco express aplikacije

app.use(session({ secret: process.env.SESSION_SECRET })); //omogoči seje za shranjevanje podatkov o prijavljenem uporabniku med zahtevki
app.use(passport.initialize()); //inicializira Passport za avtentikacijo => v aplikaciji je potrebno sedaj uporabljati passport
app.use(passport.session()); //omogoča seje za ohranjanje prijave uporabnika

const PORT = process.env.PORT || 3000; //če obstaja => uporabi PORT vrednost iz .env datoteke (okoljska spremenljivka) , sicer => PORT = 3000

/*
   Korenska pot za OAuth 2.0 prijavo preko Googla
   GET /
    - Prikazana je povezava za avtorizacijo z Google-om
    - Uporabnik dostopa do korenske poti in je preusmerjen na Google prijavno stran
*/
app.get('/', (req, res) => {
    res.send('<a href="/auth/google">Authenticate with Google</a>')
});

/*
    Endpoint za prijavo preko Googla.
    GET /auth/google
        - Ko dostopamo do tega API-ja, Passport sproži OAuth 2.0 prijavni proces.
        - Uporabnik bo preusmerjen na Google prijavno stran, kjer bo moral potrditi dovoljenja ("scopes") in se prijaviti s svojim Google računom.
        - Parameter "scope" določa, katere podatke želi aplikacija pridobiti od uporabnika (v tem primeru email in osnovni profil).
        - Po uspešni prijavi bo Google preusmeril uporabnika na callback URL, ki ga definira GoogleStrategy.
*/
app.get('/auth/google', 
    passport.authenticate('google', //passport preusmeri uporabnika na Google-ovo prijavno stran
        {
            scope: ['email', 'profile'], //dovoljenja ("scopes"), katera želimo od uporabnika za spletno aplikacijo
            prompt: 'consent' //ob vsaki prijavi naj uporabnik potrdi/zavrne dovoljenja, katera želi spletna aplikacija
        }) 
);

/*
    Endpoint na katerega se preusmeri po poizkusu prijave s pomočjo Google računa.
    GET /auth/google/callback
*/
app.get('/auth/google/callback', 
    passport.authenticate('google', { //tukaj passport preveri podatke katere je vrnil Google ob prijavi uporabnika s pomočjo Google računa
        successRedirect: '/auth/protected', //v kolikor je bila prijava s pomočjo Google računa uspešna
        failureRedirect : '/auth/failure' //v kolikor je bila prijava s pomočjo Google računa neuspešna
    })
);

/*
    Pot, na katero se preusmeri uporabnika ob neuspešni prijavi s pomočjo Google računa
    GET /auth/failure
*/
app.get('/auth/failure', (req, res) => {
    res.send('Something went wrong (incorect credentials or error).')
});

/*
    Pot, na katero se preusmeri uporabnika ob uspešni prijavi s pomočjo Google računa
    GET /auth/protected
*/
app.get('/auth/protected', isLoggedIn, (req, res) => { //pred izpisom vsebine preveri, ali je uporabnik vpisan (s pomočjo vmesne programske kode) => zavarovan API endpoint
    res.send("Hello " + req.user.displayName + "!"); //izpiši uporabniško ime prijavljenega uporabnika, katero smo pridobili s pomočjo vpisa z Google računom
});

//zaženi strežnik na vratih PORT in izpiši sporočilo
app.listen(PORT, () => {
  console.log("Server running on http://localhost:" + PORT);
});