const bcrypt = require('bcrypt');

async function hashPassword() {
  const myPassword = 'admin.123'; // 'admin.123' = password to hash = $2b$10$XqnHDKm5SbSb9y5YnNU59uu8ydg1aIjK5EOguZBJ8xZPTqz2hsHY6
  const hash = await bcrypt.hash(myPassword, 10);
  console.log(hash);
}

hashPassword();
