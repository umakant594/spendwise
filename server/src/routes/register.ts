import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";

const r = Router();

function createToken(userId: number) {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || "spendwise_super_secret_key",
    { expiresIn: "7d" }
  );
}

r.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    if (String(password).length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return res.status(409).json({
        message: "An account with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(String(password), 10);

    const user = await prisma.user.create({
      data: {
        name: String(name).trim(),
        email: normalizedEmail,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      message: "Account created successfully",
      token: createToken(user.id),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        currency: user.currency,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create account" });
  }
});

export default r;
