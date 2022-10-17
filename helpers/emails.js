import nodemailer from "nodemailer";

//Enviar email para confirmar una cuenta
export const sendEmailToConfirm = async (data) => {
  const { email, name, token } = data;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  //informacion del email
  const info = await transport.sendMail({
    from: "Uptask - <cuentas@uptask.com",
    to: email,
    subject: "Uptask - confirm your account",
    text: "confirm your account in Uptask",
    html: `
      <p>Hi ${name}, confirm your account in Uptask</p>
      <p>Your account is almost ready, just click the link below to confirm your account:</p>
      <a href="${process.env.FRONTEND_URL}/confirm-account/${token}">Confirm Account</a>
      <p>If you don't create this account, you can ignore this email.</p>
    `
  });
};

//Email cuando un usuario quiere cambiar contraseña
export const sendEmailForgetPassword = async (data) => {
  const { email, name, token } = data;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  //informacion del email
  const info = await transport.sendMail({
    from: "Uptask - <cuentas@uptask.com",
    to: email,
    subject: "Uptask - reset your password",
    text: "Reset your password",
    html: `
      <p>Hi ${name}, change your password</p>
      <p>Click the link below to reset your password:</p>
      <a href="${process.env.FRONTEND_URL}/new-password/${token}">Reset password</a>
      <p>If you aren't trying to reset your password, you can ignore this email.</p>
    `
  });
};
