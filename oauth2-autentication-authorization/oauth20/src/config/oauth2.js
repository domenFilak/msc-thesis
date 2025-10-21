/*
Ta del kode uporablja Passport.js za OAuth 2.0 prijavo preko Google-a. Passport.js je priljubljen modul za 
upravljanje prijav in avtorizacij uporabnikov. GoogleStrategy pa je posebna strategija za OAuth 2.0, 
ki omogoča, da se uporabniki prijavijo s svojim Google računom.
*/
/*
Kar je pri tem delu kode zelo pomembno je to, da ta del kode uporablja Google Cloud Console.

Google Cloud Console je spletna platforma, kjer upravljamo vse Google-ove API-je in storitve, katere so na voljo širši javnosti.
Za našo spletno aplikacijo tukaj ustvarimo projekt, ki predstavlja registracijo naše aplikacije pri Google-u.
Tam registriramo OAuth 2.0 poverilnice: Client ID (javni identifikator spletne aplikacije) in Client Secret (skrivno geslo spletne aplikacije).
Prav tako vpišemo callback URL-je, kamor Google preusmeri uporabnika po uspešni prijavi.
Google nato ve, katera aplikacija prosi za dostop in lahko varno preda uporabniške podatke.
Brez te nastavitve OAuth 2.0 prijava ne bi delovala.
*/

const passport = require('passport'); //uvozi passport modul za avtorizacijo
const GoogleStrategy = require('passport-google-oauth20').Strategy; //uvozi Google OAuth 2.0 strategijo za avtentikacijo in avtorizacijo

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID, //google identifikator naše aplikacije
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, //geslo, ki dokazuje, da je naša aplikacija zaupanja vredna (je prijavljena pri Google Cloud Console)
    callbackURL: "http://localhost:3000/auth/google/callback" //URL naslov na katerega Google preusmeri po prijavi, mora biti registriran v Google Cloud Console
  },
  function(accessToken, refreshToken, profile, cb) { //funkcija ki se kliče po uspešni prijavi
                                                     //prejme "accessToken" (omogoča aplikaciji dostop do Google API-jev), "refreshToken" in "profile" (vsebuje osnovne info o uporabniku)
    return cb(null, profile); //vrni Google-ove podatke o prijavljenem uporabniku

  }
));

passport.serializeUser(function(user, done) {
    done(null, user); //shrani uporabnika v sejo po uspešni prijavi
});

passport.deserializeUser(function(user, done) {
    done(null, user); //za vsak naslednji zahtevek => pridobi uporabnika iz shrambe seje
});
