import { Router } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";

const r = Router();

/* GET ALL ACCOUNTS */
r.get("/", authenticate, async (req: AuthRequest, res) => {
  try {
    const accounts = await prisma.account.findMany({
      where: {
        userId: req.user!.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    res.json(accounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch accounts",
    });
  }
});

/* CREATE ACCOUNT */
r.post("/", authenticate, async (req: AuthRequest, res) => {
  try {
    const { name, type, balance } = req.body;

    if (!name || !type) {
      return res.status(400).json({
        message: "Account name and type are required",
      });
    }

    const account = await prisma.account.create({
      data: {
        userId: req.user!.id,
        name,
        type,
        balance: Number(balance || 0),
      },
    });

    res.status(201).json(account);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create account",
    });
  }
});

/* DELETE ACCOUNT */
r.delete("/:id", authenticate, async (req: AuthRequest, res) => {
  try {
    const accountId = Number(req.params.id);

    if (!Number.isInteger(accountId)) {
      return res.status(400).json({
        message: "Invalid account ID",
      });
    }

    /* Make sure account belongs to logged-in user */
    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
        userId: req.user!.id,
      },
    });

    if (!account) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    /*
      Delete the account.

      Your Prisma schema has:
      onDelete: Cascade

      for Account -> Transaction, so transactions belonging
      to this account will also be removed.
    */
    await prisma.account.delete({
      where: {
        id: accountId,
      },
    });

    res.json({
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("DELETE ACCOUNT ERROR:", error);

    res.status(500).json({
      message: "Failed to delete account",
    });
  }
});

export default r;