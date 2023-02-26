const bcrypt = require('bcrypt');

async function verifyPassword() {
  const myPassword = 'admin.123';
  const hash = '$2b$10$XqnHDKm5SbSb9y5YnNU59uu8ydg1aIjK5EOguZBJ8xZPTqz2hsHY6';
  const result = await bcrypt.compare(myPassword, hash);
  console.log(result);
}

verifyPassword();
