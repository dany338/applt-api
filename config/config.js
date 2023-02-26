require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'dev',
  isProd: process.env.NODE_ENV === 'production',
  port: process.env.PORT || 3002,
  dbUrl: process.env.DATABASE_URL,
  dbUrlMySql: process.env.DATABASE_URL_MYSQL,
  apikey: process.env.API_KEY,
  jwtSecret: process.env.JWT_SECRET,
  nodemailerUser: process.env.SMTP_EMAIL,
  nodemailerPass: process.env.SMTP_PASSWORD,
  nodemailerHost: process.env.NODEMAILER_HOST,
  nodemailerPort: process.env.NODEMAILER_PORT,
  nodemailerSecure: process.env.NODEMAILER_SECURE,
}

module.exports = { config };
