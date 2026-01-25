const bcrypt = require('bcryptjs');
const password = 'gabi10';
const hash = '$2b$10$BV.eRVlH7xbirpr.dRIN1u22boBBuBcU2bRetJrbp9zIm0q9334c7u';
console.log('Match?', bcrypt.compareSync(password, hash));
console.log('Password len:', password.length);
console.log('Hash len:', hash.length);
