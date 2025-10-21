# Implementacija avtentikacijskih metod v programskem jeziku JavaScript in ogrodju ExpressJS 

Ta repozitorij vsebuje praktične implementacije različnih avtentikacijskih metod z uporabo **JavaScript-a in ExpressJS-a**. Cilj je, da se z enostavnimi primeri v kodi prikaže, kako različne avtentikacijske metode delujejo v praksi (njihova logika delovanja).

## Implementirane avtentikacijske metode

### API Key Authentication
- Uporablja `PORT` in `API_KEY`, shranjena v `.env` datoteki.

### Basic Authentication
- Uporablja `PORT`, shranjen v `.env` datoteki.

### Digest Authentication
- Uporablja `PORT`, shranjen v `.env` datoteki.

### JWT Authentication
- Uporablja `PORT` in `JWT_SECRET`, shranjena v `.env` datoteki.

### OAuth 2.0 Authentication and Authorization
- Prikazuje logični potek OAuth 2.0 avtentikacijske in avtorizacijske metode z uporabo vpisa z Google računom.
- Zaradi varnosti `.env` datoteka s skrivnimi ključi **ni naložena** za OAuth 2.0, saj git blokira pošiljanje določenih občutljivih podatkov, Googlove poverilnice pa je vedno potrebno hraniti zasebno.
- Uporablja `PORT`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` in `SESSION_SECRET`, shranjeni v `.env` datoteki lokalno (njihov pomen razložen v kodi).

## Kratko o `.env` datotekah

- Za lažji/enostavnejši prikaz in razumevanje avtentikacijskih metod so `.env` datoteke z nekaterimi "občutljivimi" podatki (v resnici ne ponujajo dostopa do ničesar, vendar pa so le potrebni za prikaz delovanja avtentikacijskih metod prikazanih v kodi)
  vključene v ta github repozitorij (razen za OAuth 2.0).  
- Običajno `.env` datoteke vsebujejo občutljive informacije in jih **NIKOLI NE SMEMO NALOŽITI V JAVNE REPOZITORIJE**.  
- V tem repozitoriju vrednosti v `.env` datotekah **ne predstavljajo resničnih skrivnosti**—so zgolj primeri za učenje in razumevanje kode.  
- Vključitev teh datotek tukaj omogoča **lažje zagon kode brez dodatne nastavitev**, vendar ne smemo pozabiti: v resničnih projektih morajo biti skrivnosti vedno varno zaščitene.
