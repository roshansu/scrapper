const nodemailer = require("nodemailer");
const otpTemplate = require("./otpTemplate");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: "roshanjaiswal.bca@gmail.com",
    pass: "mfwacaoezdnwrtxs",
  },
});

 async function sendOTP(otp, email) {
  const info = await transporter.sendMail({
    from: '"StudIN" <roshanjaiswal.bca@gmail.com>',
    to: email,
    subject: "Verify your OTP",
    text: "Password", 
    html: otpTemplate.replace("<otphere>", otp),
  });
  return info;
}

module.exports = sendOTP;