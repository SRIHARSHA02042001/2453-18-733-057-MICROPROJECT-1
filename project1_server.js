const express = require('express');
const bodyparser = require('body-parser');
let jwt = require('jsonwebtoken');
let project1_config = require('./project1_config');
let project1_middleware = require('./project1_middleware');

class Handler{
  login (req, res) {
    let username = req.body.username;
    let password = req.body.password;
    let mockedUsername = 'admin';
    let mockedPassword = 'password';

    if (username && password) {
      if (username === mockedUsername && password === mockedPassword) {
        let token = jwt.sign({username: username},
          project1_config.secret,
          { expiresIn: '24h'
          }
        );
        res.json({
          success: true,
          message: 'Authentication successful!',
          token: token
        });
      } else {
        res.send(101).json({
          success: false,
          message: 'Incorrect username or password'
        });
      }
    } else {
      res.send(102).json({
        success: false,
        message: 'Authentication failed! Please check the request'
      });
    }
  }
  start (req, res) {
    res.json({
      success: true,
      message: 'Start page'
    });
  }
}
function main () {
  let app = express();
  let handlers = new Handler();
  const port = 4000;
  app.use(bodyparser.urlencoded({
    extended: true
  }));
  app.use(bodyparser.json());
  app.post('/login', handlers.login);
  app.get('/', project1_middleware.checkToken, handlers.start);
  app.listen(port, () => console.log(`Server is listening on port number: ${port}`));
}
main();