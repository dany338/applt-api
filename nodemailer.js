const nodemailer = require("nodemailer");
const { config } = require('./config/config');

// async..await is not allowed in global scope, must use a wrapper
async function sendMail() {

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: config.nodemailerHost, // host: 'smtp.ethereal.email',
    secure: config.nodemailerSecure, // true for 465, false for other ports
    port: config.nodemailerPort, //  port: 587,
    auth: {
      user: config.nodemailerUser,
      pass: config.nodemailerPass
    }
  });

  const html = `
    <main style="min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
      <p align="center">
        <span style="text-align: center;"><b>Hola daniel gallo</b></span><br />
        <span style="text-align: center;">&nbsp;</span><br />
        <span style="text-align: center;">Parolitos</span><br />
        <span style="text-align: center;">&nbsp;</span><br />
        <span style="text-align: center;">Junitos animanias</span><br />
      </p>
      <br />
      <div style="width: 100%; height: 1px; background-color: red;"></div><br />
      <p align="center">
        <a href="" rel="noopener">
        <img width=200px height=200px src="https://drive.google.com/uc?export=view&id=1lXh66UaJXOf67HXmoTIgMRz55YxqA6G-" alt="People"></a>
      </p>
    </main>
  `;

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'invoices.api.2022@gmail.com', // sender address
    to: ["dgallo@waverleysoftware.com", "dany338@gmail.com", "sac@creacionesvisionarias.org", "info@creacionesvisionarias.org"], // list of receivers
    subject: "Este es un nuevo correo de prueba de daniel", // Subject line
    text: "Este es un nuevo correo de prueba de daniel", // plain text body
    html: `${html}`, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

sendMail();
