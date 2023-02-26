const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const { config } = require('../config/config');
const UserService = require('./users.service');
const service = new UserService();

class AuthService {
  constructor() {}

  async validatePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  async getUser(email, password) {
    const user = await service.findByEmail(email);
    if (!user) {
      throw boom.unauthorized();
    }
    const isMatch = await this.validatePassword(password, user.password);
    if (!isMatch) {
      throw boom.unauthorized();
    }
    delete user.dataValues.password;
    return user;
  }

  signToken(user) {
    const payload = {
      sub: user.id,
      role: user.role
    }
    const token = jwt.sign(payload, config.jwtSecret);
    return {
      user,
      token
    };
  }

  async sendRecovery(email) {
    const user = await service.findByEmail(email);
    if (!user) {
      throw boom.notFound('user not found');
    }
    const payload = { sub: user.id };
    const token   = jwt.sign(payload, config.jwtSecret, { expiresIn: '15min' });
    const link    = `http://localhost:3000/recovery?token=${token}`;
    await service.update(user.id, { recoveryToken: token });
    const html = `
      <main style="min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <p align="center">
          <span style="text-align: center;"><b>Correo de recuperación</b></span><br />
          <span style="text-align: center;">&nbsp;</span><br />
          <span style="text-align: center;">Ingresa a este link => ${link}</span><br />
        </p>
        <br />
        <div style="width: 100%; height: 1px; background-color: red;"></div><br />
        <p align="center">
          <a href="" rel="noopener">
          <img width=200px height=200px src="https://drive.google.com/uc?export=view&id=1lXh66UaJXOf67HXmoTIgMRz55YxqA6G-" alt="People"></a>
        </p>
      </main>
    `;
    const mail = {
      from: config.nodemailerUser, // sender address
      to: `${user.email}`, // list of receivers
      subject: "Este es un nuevo correo", // Subject line
      text: "Hola santi", // plain text body
      html, // html body
    };
    const rta = await this.sendMail(mail);
    return rta;
  }

  async changePassword(token, newPassword) {
    try {
      const payload = jwt.verify(token, config.jwtSecret);
      const user = await service.findOne(payload.sub);
      if (!user) {
        throw boom.notFound('user not found');
      }
      if (user.recoveryToken !== token) {
        throw boom.unauthorized('token invalid');
      }
      const hash = await bcrypt.hash(newPassword, 10);
      await service.update(user.id, { password: hash, recoveryToken: null });
      return { message: 'password changed' };
    } catch (error) {
      throw boom.unauthorized();
    }
  }

  async sendMail(infoMail) {
    const transporter = nodemailer.createTransport({
      host: config.nodemailerHost, // host: 'smtp.ethereal.email',
      secure: config.nodemailerSecure, // true for 465, false for other ports
      port: config.nodemailerPort, //  port: 587,
      auth: {
        user: config.nodemailerUser,
        pass: config.nodemailerPass
      }
    });

    await transporter.sendMail(infoMail);
    return { message: 'mail sent' };
  }
}

module.exports = AuthService;
