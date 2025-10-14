import express from 'express';
import db from "@repo/db/client";
import {Prisma } from '@prisma/client';
import cors from 'cors' 


// --- Environment Variables ---
const PORT = process.env.PORT || 3004;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3001";

const app = express();
app.use(express.json());
app.use(cors({
  origin: ["FRONTEND_URL"], 
  methods: ["GET", "POST"],
  }
))

// Define payment info interface
interface PaymentInfo {
  token: string;
}

app.get("/hdfcwebhook" ,async (req,res)=>{
  res.status(200).send("HDFC Webhook is active and listening.");
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

    const result = await db.$transaction(async (tx : Prisma.TransactionClient) => {
      // Check transaction status first

      const transaction = await tx.onRampTransaction.findFirst({
        where: {
          token: paymentInfo.token,
        },
        select: {
          amount: true,
          userId: true,
          status: true,
        },
      });


      // Handle invalid transaction
      if (!transaction) {
        console.warn(`Invalid webhook token received: ${paymentInfo.token}`);
        return { success: false, message: "Invalid Transaction" };
      }

      if (transaction.status === "Success") {
        return { success: false, message: "Transaction already processed" };
      }
      // Update transaction status
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

      return { success: true, message: "Captured" };
    });

    if (result.success) {
      res.status(200).json({ message: result.message });
    } else {
      const statusCode = result.message.includes("already processed") ? 409 : 400;
      res.status(statusCode).json({ message: result.message });
    }
  } catch (e) {
    console.error("Webhook processing failed:", e);
    res.status(500).json({ message: "Internal server error during webhook processing." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 HDFC Webhook server started on port ${PORT}`);
});