const jwt = require('jsonwebtoken');

const secret = 'mysecretsshhh';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsIm5hbWUiOiJKb2huIERvZSIsInJvbGUiOiJhZG1pbiIsImFkbWluIjp0cnVlLCJpYXQiOjE2NjQ2ODY4NjF9.5DuE_v2VzA9W7NK9lTpZSSd_Ul0ppeUOUE3-Dzm9mbU';

function verifyToken(token, secret) {
  return jwt.verify(token, secret);
}

const payload = verifyToken(token, secret);
console.log(payload); // { sub: 1, name: 'John Doe', role: 'admin', admin: true, iat: 1664688661 }
