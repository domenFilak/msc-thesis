//middleware (vmesna programska koda) za preverjanje, ali je uporabnik že prijavljen
function isLoggedIn(req, res, next) {
    //preveri ali je uporabnik prijavljen: če obstaja req.user (uporabnik je prijavljen), potem nadaljuj; sicer vrni status 401 (Unauthorized)
    req.user ? next() : res.sendStatus(401);
}

module.exports = isLoggedIn;
