const crypto = require('crypto'); //Za izvajanje funkcije zgoščevanja

//Beležimo kombinacije nonce:nc, ki so bile že uporabljene (za preprečevanje "Replay attack" napadov)
const usedNonceCounters = new Set();

//Funkcija za generiranje nonce vrednosti (naključna vrednost za enkratno uporabo)
function generateNonce() {
  return crypto.randomBytes(16).toString('hex');
}

//Funkcija za izračun A1 dela - zgoščevanje uporabniškega imena, realm in gesla
function calculateA1(username, realm, password) {
  return crypto.createHash('md5').update(`${username}:${realm}:${password}`).digest('hex');
}

//Funkcija za izračun A2 dela - zgoščevanje HTTP metode in URI-ja
function calculateA2(method, uri) {
  return crypto.createHash('md5').update(`${method}:${uri}`).digest('hex');
}

//Funkcija za razčlenitev podatkov iz digest authorization glave
function parseDigestAuth(authHeader) {
  const authData = {};
  const authParts = authHeader.replace(/Digest\s+/i, '').split(',');
  
  for (const part of authParts) {
    const [key, value] = part.trim().split('=');
    //Odstranimo navednice iz vrednosti
    authData[key] = value ? value.replace(/"/g, '') : value;
  }
  
  return authData;
}

//Funkcija za preverjanje pristnosti uporabnika - digest authentication metoda

function validateDigest(authHeader, method, uri) {

  //Privzeti uporabnik in geslo za test - v pravi aplikaciji bi to pridobili iz baze podatkov
  const validUsername = 'admin';
  const validPassword = 'admin';
  const realm = 'user_pages';

  //Razčlenimo podatke iz Authorization glave
  const authData = parseDigestAuth(authHeader);
  
  //Preverimo ali imamo vse potrebne podatke
  if (!authData.username || !authData.nonce || !authData.response || !authData.nc || !authData.cnonce || !authData.qop) {
    return false;
  }

  // Preverimo ali je uporabniško ime pravilno
  if (authData.username !== validUsername) {
    return false;
  }

  //Preverimo, ali smo že videli to kombinacijo nonce:nc (preprečevanje replay napadov)
  const nonceCounter = `${authData.nonce}:${authData.nc}`;
  if (usedNonceCounters.has(nonceCounter)) {
    return false; // Možen replay napad - ta nonce:nc kombinacija je bila že uporabljena
  }

  //Izračunamo A1 (username:realm:password)
  const ha1 = calculateA1(validUsername, realm, validPassword);
  
  //Izračunamo A2 (method:uri)
  const ha2 = calculateA2(method, uri);

  //Izračunamo končni response
  let expectedResponse;
  
  expectedResponse = crypto
  .createHash('md5')
  .update(`${ha1}:${authData.nonce}:${authData.nc}:${authData.cnonce}:${authData.qop}:${ha2}`)
  .digest('hex');

  //Dodamo kombinacijo nonce:nc v set že uporabljenih
  usedNonceCounters.add(nonceCounter);

  //Preverimo če se response ujema s pričakovanim
  return authData.response === expectedResponse;
}

//Definiramo in ustvarimo logiko za naš digestAuthMiddleware
module.exports = function digestAuthMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';

  //Če zahtevek vsebuje avtorizacijsko glavo za digest authentication metodo
  if (authHeader.startsWith('Digest ')) {
    const isValid = validateDigest(authHeader, req.method, req.url);
    
    if (isValid) {
      return next(); //Uporabnik je pooblaščen za dostop, nadaljuj z naslednjo middleware funkcijo
    }
  }

  //Če uporabnik ni pooblaščen ali pa zahtevek nima avtorizacijske glave za digest authentication metodo, pošljemo zahtevo za preverjanje pristnosti uporabnika
  const nonce = generateNonce();
  res.set(
    'WWW-Authenticate', 
    `Digest realm="user_pages", qop="auth", nonce="${nonce}", algorithm=MD5`
  );
  
  res.status(401).send('Authentication required.'); //Statusno kodo nastavimo na 401 in pošljemo sporočilo
};