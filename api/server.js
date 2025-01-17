const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require('express-session');

/**
  Do what needs to be done to support sessions with the `express-session` package!
  To respect users' privacy, do NOT send them a cookie unless they log in.
  This is achieved by setting 'saveUninitialized' to false, and by not
  changing the `req.session` object unless the user authenticates.

  Users that do authenticate should have a session persisted on the server,
  and a cookie set on the client. The name of the cookie should be "chocolatechip".

  The session can be persisted in memory (would not be adecuate for production)
  or you can use a session store like `connect-session-knex`.
 */
const usersRouter = require('./users/users-router.js');
const authRouter = require('./auth/auth-router.js');

const server = express();

server.use(session({
  name: 'shark', //name that holds the sessionID
  secret: 'fierce and fast', // the sessionId is actually encrypted 
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false, // in prod it should be true (only over HTTPS)
    httpOnly: false, // make it true if possible ( the javascript cannot rad the cookie )
  },
  rolling: true, // push back the expiration date of cookie
  resave: false,  //ignore for now 
  saveUninitialized: false, //if false, session are not stored 'by default
}))

server.use('/api/users', usersRouter);
server.use('/api/auth', authRouter);

server.use(helmet());
server.use(express.json());
server.use(cors());

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

server.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;
