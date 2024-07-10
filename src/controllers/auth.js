import { serviceSignIn } from "../services/auth.js";
import { createUser } from "../services/users.js";
import { User } from "../models/user.js";
import crypto from "crypto";
import jwt from 'jsonwebtoken';
import { messageService } from "../services/message.js";

export async function registration(req, res) {
  const { username, password, phone, email } = req.body;
  try {
    let role = "regular";
    const adminPhoneNumbers = ["0502323574"];

    if (adminPhoneNumbers.includes(phone)) {
      role = "admin";
    }

    if (username && password && phone && email) {
      const createdUser = await createUser(
        username,
        password,
        phone,
        role,
        email
      );
      return res.status(201).json(createdUser);
    } else {
      return res.status(400).json({ message: "Invalid parameters provided" });
    }
  } catch (error) {
    console.error("Error creating user:", error);
    return res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
}

export async function signIn(req, res) {
  try {
    const { email, password } = req.body;
    const data = await serviceSignIn(email, password);
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function forgotPasswordPhone(req, res) {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const code = crypto.randomInt(100000, 999999).toString();
    user.resetPasswordToken = code;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    await messageService(
      user.username,
      process.env.ADMIN_MAIL_ADDRESS,
      "לחיצה על הלינק והכנסת הקוד המצורף יאפשרו איפוס סיסמה. בעוד שעה הקוד יפוג מתוקפו",
      code,
      user.email
    );

    res.status(200).json({
      body: `נשלח קוד עבור איפוס סיסמה למייל שצורף`,

    });

  } catch (err) {
    console.error("Error sending WhatsApp message", err);
    res.status(500).json({ message: "Failed to send WhatsApp message" });
  }
}

export async function resetPasswordPhone(req, res) {
  const { phone, code, newPassword } = req.body;
  try {
    const user = await User.findOne({
      phone,
      resetPasswordToken: code,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user)
      return res.status(400).json({ message: "Invalid code or code expired" });

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password has been reset" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res
      .status(500)
      .json({ message: "Error resetting password", error: error.message });
  }
}

export function isTokenExpired(req, res) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Token is missing' });
  }

  

  jwt.verify(authHeader, process.env.JWT_Secret_Key, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token is invalid or expired' });
    }
    return res.status(200).json({ message: 'Token is valid' });


  });
}