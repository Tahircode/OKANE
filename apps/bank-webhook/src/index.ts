import "dotenv/config";
import express from 'express';
import { db } from "@repo/db";
import cors from 'cors'
import { invalidateBalance } from '@repo/db'
import { addonRampHistory } from '@repo/db'
const app = express();
app.use(express.json());

app.use(cors({
  origin: ["http://localhost:3001", "https://okane.vercel.app"],
  methods: ["GET", "POST"],
}
))

// Define payment info interface
interface PaymentInfo {
  token: string;
}

app.get("/hdfcwebhook", async (req, res) => {
  res.send("HDFC PAGE Auto Verifiing payment is Upppp!!!")
})


app.post("/hdfcwebhook", async (req, res) => {
  try {
    const paymentInfo: PaymentInfo = {
      token: req.body.token,
    };

    // Validate input
    if (!paymentInfo.token) {
      return res.status(400).json({
        message: "Token is required",
      });
    }    
    
      const transaction = await db.onRampTransaction.findFirst({
        where: {
          token: paymentInfo.token,
        },
        select: {
          id : true,
          amount: true,
          userId: true,
          status: true,
          provider: true,
          timestamp: true,
        },
      });

      // Handle invalid transaction
      if (!transaction) {
        return { success: false, message: "Invalid Transaction" };
      }

      // Handle already processed transaction
      if (transaction.status === "Success") {
        return { success: false, message: "Transaction already processed" };
      }

    const result = await db.$transaction(async (tx: any) => {
      await tx.onRampTransaction.update({
        where: {
          token: paymentInfo.token,
        },
        data: {
          status: "Success",
        },
      });

      // Update balance
      await tx.balance.update({
        where: {
          userId: transaction.userId,
        },
        data: {
          amount: {
            increment: transaction.amount,
          },
        },
      });
      return { success: true, message: "Captured", newBalance: "updated" };
    });
    await Promise.all([
      invalidateBalance(transaction.userId),
      addonRampHistory(transaction.userId, {
        id: transaction.id,
        amount: transaction.amount,
        provider: transaction.provider,
        userId: transaction.userId,
        timestamp: transaction.timestamp,
        status: "Success" as const,
        type: "CREDIT" as const,
      })
    ]);
    if (result.success) {
      res.json({
        message: result.message,
      });
    } else {
      res.status(200).json({
        message: result.message,
      });
    }

  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: e instanceof Error ? e.message : "Internal server error",
    });
  }


});

app.listen(3004, () => {
  console.log("Web Bank started on port 3004");
});