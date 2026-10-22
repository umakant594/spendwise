import express from "express";
import auth from "./routes/auth";
import dashboard from "./routes/dashboard";
import transactions from "./routes/transactions";
import accounts from "./routes/accounts";
import budgets from "./routes/budgets";

const app = express();

app.use(express.json());
app.get("/", (_req, res) =>
  res.json({ message: "SpendWise API is running", status: "success" })
);
app.get("/api/health", (_req, res) =>
  res.json({ status: "ok", service: "SpendWise API" })
);
app.use("/api/auth", auth);
app.use("/api/dashboard", dashboard);
app.use("/api/transactions", transactions);
app.use("/api/accounts", accounts);
app.use("/api/budgets", budgets);
app.use((_req, res) => res.status(404).json({ message: "API route not found" }));

export default app;
