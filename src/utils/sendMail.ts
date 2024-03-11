import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAILSENDER,
        pass: process.env.GMAILPASSWORD,
    },
});

async function sendMail(receiver: string, link: string) {
    const info = await transporter.sendMail({
        from: process.env.EMAILSENDER,
        to: receiver,
        subject: "Update your password",
        text: "Use the following link to update your password ",
        html: `<a href="${link}">Update Password</a>`,
    });
    return info;
}

export { sendMail };
