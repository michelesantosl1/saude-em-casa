const bcrypt = require('bcryptjs');

const senha = 'admin123';

bcrypt.hash(senha, 10).then((hash) => {
  console.log('Hash gerado:', hash);
});
