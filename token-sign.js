const jwt = require('jsonwebtoken');

const secret = 'mysecretsshhh';
const payload = {
  sub: 1,
  name: 'John Doe',
  role: 'admin',
  admin: true,
};

function signToken(payload, secret) {
  return jwt.sign(payload, secret);
}

const token = signToken(payload, secret);
console.log(token); // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsIm5hbWUiOiJKb2huIERvZSIsInJvbGUiOiJhZG1pbiIsImFkbWluIjp0cnVlLCJpYXQiOjE2NjQ2ODY4NjF9.5DuE_v2VzA9W7NK9lTpZSSd_Ul0ppeUOUE3-Dzm9mbU
