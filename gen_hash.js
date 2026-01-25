const bcrypt = require('bcrypt');
const password = 'gabi10';
const hash = bcrypt.hashSync(password, 10);
console.log(hash);
