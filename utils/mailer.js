const nodemailer = require('nodemailer');

const from = '"MyMovie" <info@myMovie.com>'

function setup() {
    return nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
                }
            });
}

module.exports = {
    sendConfirmationEmail: (user) => {
        const transport = setup();
        const email = {
            from,
            to: user.get('email'),
            subject: "Witamy w MyMovie",
            text: `
            Witamy w MyMovie. Aby kontynuować pracę na naszym serwisie proszę potwierdzić adres email.

            ${process.env.HOST}/confirmation/${user.get('confirmationToken')}
            `,
            html: `
            <p>Witamy w MyMovie. Aby kontynuować pracę na naszym serwisie proszę potwierdzić adres email.</p>

            <a href=${process.env.HOST}/confirmation/${user.get('confirmationToken')}>Link aktywacyjny</a>
            `
        }

        transport.sendMail(email);
    },

    sendResetPasswordEmail: (user) => {
        const transport = setup();
        const email = {
            from,
            to: user.get('email'),
            subject: "Resetowanie hasła",
            text: `
            Aby zresetować hasło kliknij w poniższy link

            ${process.env.HOST}/resetPassword/${user.get('resetPasswordToken')}
            `,
            html: `
            <p>Aby zresetować hasło kliknij w poniższy link</p>

            <a href=${process.env.HOST}/resetPassword/${user.get('resetPasswordToken')}>Reset hasła</a>
            `
        }

        transport.sendMail(email);
    }
}