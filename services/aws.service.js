const aws = require('@aws-sdk/client-ses');
const boom = require('@hapi/boom');
const nodemailer = require('nodemailer');

const { config } = require('../config/config');
const UserService = require('./users.service');
const service = new UserService();

const ses = new aws.SES({
  apiVersion: '2010-12-01',
  region: 'us-east-1',
  credentials: {
      secretAccessKey: config.awsSecretAccessKey,
      accessKeyId: config.accessKeyId
  }
});

class AwsService {
  constructor() {}

  async sendMailAttachment(infoMail) {
    // create Nodemailer SES transporter
    const transporter = nodemailer.createTransport({
      SES: { ses, aws }
    });

    await transporter.sendMail(infoMail);
    return { message: 'mail sent with SES' };
  }

  async sendPdfExported(id, email, file) {
    const user = await service.findOne(id);
    if (!user) {
      throw boom.notFound('user not found');
    }
    const html = `
      <main style="min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <p align="center">
          <span style="text-align: center;"><b>Correo de exportacion de datos</b></span><br />
          <span style="text-align: center;">&nbsp;</span><br />
          <span style="text-align: center;">Ingresa a este link =></span><br />
        </p>
        <br />
        <div style="width: 100%; height: 1px; background-color: red;"></div><br />
        <p align="center">
          <a href="" rel="noopener">
          <img width=200px height=200px src="https://drive.google.com/uc?export=view&id=1lXh66UaJXOf67HXmoTIgMRz55YxqA6G-" alt="Companies"></a>
        </p>
      </main>
    `;
    const mail = {
      from: config.nodemailerUser, // sender address
      to: `${email}`, // list of receivers
      subject: "Este es un nuevo correo de exportación de compañias", // Subject line
      text: "Hola usuario", // plain text body
      html, // html body
      attachments: [
        {
          filename: 'reporte-'+ user.id +'.pdf',
          path: file
        }
      ]
    };
    const rta = await this.sendMailAttachment(mail);
    return rta;
  }
}

module.exports = AwsService;
