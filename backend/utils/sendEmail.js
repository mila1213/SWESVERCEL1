let sendEmail;

try {
  const nodemailer = require('nodemailer');

  const MAIL_HOST = process.env.MAIL_HOST || process.env.SMTP_HOST || '';
  const MAIL_PORT = process.env.MAIL_PORT ? Number(process.env.MAIL_PORT) : process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
  const MAIL_USER = process.env.MAIL_USER || process.env.MAIL_USERNAME || process.env.SMTP_USER || process.env.SMTP_USERNAME || '';
  const MAIL_PASS = process.env.MAIL_PASS || process.env.MAIL_PASSWORD || process.env.SMTP_PASS || process.env.SMTP_PASSWORD || '';
  const MAIL_FROM = process.env.MAIL_FROM || process.env.MAIL_FROM_ADDRESS || MAIL_USER || 'no-reply@example.com';
  const MAIL_SECURE = process.env.MAIL_SECURE === 'true' || MAIL_PORT === 465;
  const MAIL_TLS_REJECT_UNAUTHORIZED = process.env.MAIL_TLS_REJECT_UNAUTHORIZED !== 'false';

  if (!MAIL_HOST || !MAIL_USER || !MAIL_PASS) {
    if (process.env.ENABLE_DEV_EMAILS === 'true') {
      console.warn('sendEmail: SMTP no configurado. Usando cuenta de prueba (Ethereal) para desarrollo.');
      sendEmail = async ({ to, subject, html, text, replyTo }) => {
        if (!to) throw new Error('Missing "to" address');
        const testAccount = await nodemailer.createTestAccount();
        const transporter = nodemailer.createTransport({
          host: testAccount.smtp.host,
          port: testAccount.smtp.port,
          secure: testAccount.smtp.secure,
          auth: { user: testAccount.user, pass: testAccount.pass },
        });

        const info = await transporter.sendMail({
          from: MAIL_FROM,
          to,
          subject: subject || 'Mensaje desde SWES (DEV)',
          html: html || undefined,
          text: text || undefined,
          replyTo: replyTo || undefined,
        });

        const previewUrl = nodemailer.getTestMessageUrl(info);
        console.log('sendEmail (dev) preview URL:', previewUrl);
        return { info, previewUrl };
      };
    } else {
      console.warn('sendEmail: SMTP no configurado. Los correos no se enviarán.');
      sendEmail = async (opts) => {
        throw new Error('SMTP no configurado. Define MAIL_HOST, MAIL_USER y MAIL_PASS en backend/.env.');
      };
    }
  } else {
    const transporter = nodemailer.createTransport({
      host: MAIL_HOST,
      port: MAIL_PORT,
      secure: MAIL_SECURE,
      auth: { user: MAIL_USER, pass: MAIL_PASS },
      tls: {
        rejectUnauthorized: MAIL_TLS_REJECT_UNAUTHORIZED,
      },
    });

    sendEmail = async ({ to, subject, html, text, replyTo }) => {
      if (!to) throw new Error('Missing "to" address');

      const info = await transporter.sendMail({
        from: MAIL_FROM,
        to,
        subject: subject || 'Mensaje desde SWES',
        html: html || undefined,
        text: text || undefined,
        replyTo: replyTo || undefined,
      });

      return info;
    };
  }
} catch (err) {
  console.warn('sendEmail: nodemailer no disponible, fallback noop.', err && err.message);
  sendEmail = async (opts) => {
    console.log('sendEmail fallback noop:', opts && { to: opts.to, subject: opts.subject });
    return { info: 'noop' };
  };
}

module.exports = { sendEmail };
