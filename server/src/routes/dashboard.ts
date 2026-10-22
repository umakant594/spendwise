import { Router } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";

const r = Router();

r.get("/", authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const [accounts, transactions, budgets] = await Promise.all([
      prisma.account.findMany({
        where: { userId },
        orderBy: { createdAt: "asc" },
      }),
      prisma.transaction.findMany({
        where: { userId },
        include: { account: true },
        orderBy: { date: "desc" },
        take: 100,
      }),
      prisma.budget.findMany({
        where: { userId },
        orderBy: { category: "asc" },
      }),
    ]);

    const income = transactions
      .filter((transaction) => transaction.type === "Income")
      .reduce((total, transaction) => total + transaction.amount, 0);
    const expenses = transactions
      .filter((transaction) => transaction.type === "Expense")
      .reduce((total, transaction) => total + transaction.amount, 0);
    const totalBalance = accounts.reduce(
      (total, account) => total + account.balance,
      0
    );
    const now = new Date();
    const monthlyExpenses = transactions
      .filter((transaction) => {
        const date = new Date(transaction.date);
        return (
          transaction.type === "Expense" &&
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        );
      })
      .reduce((total, transaction) => total + transaction.amount, 0);

    const expensesByCategory: Record<string, number> = {};
    for (const transaction of transactions.filter(
      (item) => item.type === "Expense"
    )) {
      expensesByCategory[transaction.category] =
        (expensesByCategory[transaction.category] || 0) + transaction.amount;
    }

    const categoryBreakdown = Object.entries(expensesByCategory)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);

    res.json({
      summary: {
        totalBalance,
        income,
        expenses,
        savings: income - expenses,
        monthlyExpenses,
      },
      accounts,
      budgets,
      categoryBreakdown,
      recentTransactions: transactions.slice(0, 8),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load dashboard" });
  }
});

export default r;
