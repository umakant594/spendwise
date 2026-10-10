import { Router } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";

const r = Router();

/* GET ALL BUDGETS */
r.get("/", authenticate, async (req: AuthRequest, res) => {
  try {
    const budgets = await prisma.budget.findMany({
      where: {
        userId: req.user!.id,
      },
      orderBy: [
        { year: "desc" },
        { month: "desc" },
        { category: "asc" },
      ],
    });

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: req.user!.id,
        type: "Expense",
      },
    });

    const result = budgets.map((budget) => {
      const spent = transactions
        .filter((t) => {
          const date = new Date(t.date);

          return (
            t.category === budget.category &&
            date.getMonth() + 1 === budget.month &&
            date.getFullYear() === budget.year
          );
        })
        .reduce((sum, t) => sum + t.amount, 0);

      const remaining = budget.amount - spent;
      const percentage =
        budget.amount > 0 ? (spent / budget.amount) * 100 : 0;

      return {
        ...budget,
        spent,
        remaining,
        percentage: Math.round(percentage),
        isOverBudget: spent > budget.amount,
      };
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch budgets",
    });
  }
});

/* CREATE BUDGET */
r.post("/", authenticate, async (req: AuthRequest, res) => {
  try {
    const { category, amount, month, year } = req.body;

    if (!category || !amount || !month || !year) {
      return res.status(400).json({
        message: "Category, amount, month and year are required",
      });
    }

    const budget = await prisma.budget.upsert({
      where: {
        userId_category_month_year: {
          userId: req.user!.id,
          category,
          month: Number(month),
          year: Number(year),
        },
      },
      update: {
        amount: Number(amount),
      },
      create: {
        userId: req.user!.id,
        category,
        amount: Number(amount),
        month: Number(month),
        year: Number(year),
      },
    });

    res.status(201).json(budget);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create budget",
    });
  }
});

/* DELETE BUDGET */
r.delete("/:id", authenticate, async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);

    const budget = await prisma.budget.findFirst({
      where: {
        id,
        userId: req.user!.id,
      },
    });

    if (!budget) {
      return res.status(404).json({
        message: "Budget not found",
      });
    }

    await prisma.budget.delete({
      where: {
        id,
      },
    });

    res.json({
      message: "Budget deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to delete budget",
    });
  }
});

export default r;