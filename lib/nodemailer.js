import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // Sesuaikan dengan layanan email Anda
  auth: {
    user: process.env.EMAIL_USER, // Alamat email Anda
    pass: process.env.EMAIL_PASS, // Password aplikasi atau sandi email
  },
});

export const sendOTP = async (to, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Kode OTP Anda",
    text: `Kode OTP Anda adalah ${otp}. Jangan berikan kode ini kepada siapa pun.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP berhasil dikirim!");
    return true;
  } catch (error) {
    console.error("Gagal mengirim OTP:", error);
    return false;
  }
};
