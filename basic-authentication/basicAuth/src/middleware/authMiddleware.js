
function decodeCredentials(authHeader) { //funkcija za dekodiranje uporabniškega imena in gesla iz Base64, parameter je glava avtorizacije danega zahtevka 
                                        // authHeader: Basic YWRtaW46YWRtaW4=       ==> primer prejete glave avtorizacije
  const encodedCredentials = authHeader
    .trim() //odstranimo odvečne presledke pred in za Basic YWRtaW46YWRtaW4=
    .replace(/Basic\s+/i, ''); //regex da odstranimo vrsto auth metode in presledek za njo, torej iz Basic YWRtaW46YWRtaW4= nam ostane le YWRtaW46YWRtaW4=

  const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString('utf8'); //dekodiramo YWRtaW46YWRtaW4= po Base64 da dobimo uporabniško ime in geslo

  return decodedCredentials.split(':'); //razdelimo string po dvopičju, funkcija nato vrne array, recimo ['username', 'password']
}

//definiramo in ustvarimo logiko za naš authMiddleware (po principu basic auth metode)
module.exports = function authMiddleware(req, res, next) {
  const [username, password] = decodeCredentials(req.headers.authorization || ''); //pridobimo uporabniško ime in geslo s pomočjo naše decodeCredentials funkcije

  if (username === 'admin' && password === 'admin') { //če sta uporabniško ime in geslo enaka 'admin', je uporabnik pooblaščen za dostop
    return next(); //vrnemo next(), pomeni da se je ta middleware uspešno izvedel in se lahko za njim izvede naslednji: to je sama logika v naši app.get() poti
  }
  //tukaj poves da ni pravo geslo in ime

  //če uporabnik ni pooblaščen za dostop
  res.set('WWW-Authenticate', 'Basic realm="user_pages"'); //v odgovoru strežnika nastavimo glavo avtorizacije: metoda je Basic in parameter realm="user_pages"
                                                          //klientu povemo, da je potrebna avtentikacija za dostop, se pojavi okno za vnos uporab. imena in gesla
  res.status(401).send('Authentication required.'); //statusno kodo nastavimo na 401, kratko tekstovno sporočilo in pošljemo klientu vključno z glavo avtorizacije
}