const bcrypt = require('bcryptjs');
const saltRounds = 10;
const contraseña = 'lider123';

bcrypt.hash(contraseña, saltRounds, (err, hash) => {
  if (err) throw err;
  console.log('🔐 Hash listo para SQL:');
  console.log(`UPDATE usuario SET contraseña_hash = '${hash}' WHERE correo = 'ana@ipuc.org';`);
});