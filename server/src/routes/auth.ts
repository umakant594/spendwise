import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";
import { getJwtSecret } from "../lib/jwt-secret";

const r = Router();
const SECRET = getJwtSecret();
r.post("/login", async (req, res) => {
 try {
   const { email, password } = req.body;
   if (!email || !password) {
     return res.status(400).json({ message: "Email and password are required" });
   }

   const user = await prisma.user.findUnique({
     where: { email: email.toLowerCase().trim() },
   });

   if (!user || !(await bcrypt.compare(password, user.password))) {
     return res.status(401).json({ message: "Invalid email or password" });
   }

   const token = jwt.sign(
     { id: user.id, email: user.email, role: user.role },
     SECRET,
     { expiresIn: "7d" }
   );

   return res.json({
     message: "Login successful",
     token,
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
   return res.status(500).json({ message: "Failed to login" });
 }
});

r.post("/register", async (req, res) => {
 try {
   const { name, email, password } = req.body;
   if (!name || !email || !password) {
     return res.status(400).json({
       message: "Name, email and password are required",
     });
   }

   const normalizedEmail = email.toLowerCase().trim();
   if (await prisma.user.findUnique({ where: { email: normalizedEmail } })) {
     return res.status(409).json({
       message: "An account with this email already exists",
     });
   }

   const user = await prisma.user.create({
     data: {
       name: name.trim(),
       email: normalizedEmail,
       password: await bcrypt.hash(password, 10),
     },
   });

   const token = jwt.sign(
     { id: user.id, email: user.email, role: user.role },
     SECRET,
     { expiresIn: "7d" }
   );

   return res.status(201).json({
     message: "Account created successfully",
     token,
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
   return res.status(500).json({ message: "Failed to create account" });
 }
});

export default r;
