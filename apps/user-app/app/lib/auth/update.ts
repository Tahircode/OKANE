"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import {db} from "@repo/db"
import { updateUserProfileCache } from "@repo/db";

interface UpdateProfileState {
  success: boolean;
  message: string;
  user?: {
    email?: string | null;
    phone?: string | null;
  };
}

export async function updateProfileAction(
  prevState: UpdateProfileState,
  formData: FormData
): Promise<UpdateProfileState> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return {
        success: false,
        message: "You must be logged in to update your profile.",
      };
    }

    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;

    // Validate that at least one field is provided
    if (!email && !phone) {
      return {
        success: false,
        message: "Please provide either an email or phone number.",
      };
    }

    // Validate email if provided
    if (email) {
       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return {
          success: false,
          message: "Please provide a valid email address.",
        };
      }
    }

    // Validate phone if provided
    if (phone) {
         const phoneRegex = /^\+?[\d\s\-()]{10,}$/;
      if (!phoneRegex.test(phone)) {
        return {
          success: false,
          message: "Please provide a valid phone number (e.g., +1 555 123 4567).",
        };
      }
    }
    // Update user in database - replace this with your actual database logic
    const updateResult = await updateUserInDatabase(session.user.id, { email, phone });
    await updateUserProfileCache(session.user.id, {email,phone});

    if (!updateResult.success) {
      return {
        success: false,
        message: updateResult.message || "Failed to update profile. Please try again.",
      };
    }

    return {
      success: true,
      message: "Profile updated successfully!",
      user: {
        email: email || session.user.email,
        phone: phone || (session.user).phone,
      },
    };

  } catch (error) {
    console.error("Profile update error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}

async function updateUserInDatabase(
  userId: string, 
  updates: { email?: string; phone?: string }
): Promise<{ success: boolean; message?: string }> {
  try {

      await db.user.update({
            where :{
                id: userId
            },
            data:{
                ...(updates.email && { email: updates.email }),
        ...(updates.phone && { phone: updates.phone }),
        emailVerified: updates.email ? null : undefined,
            }
      })
    
    // Simulate database operation
    await new Promise(resolve => setTimeout(resolve, 500));

    return { success: true };
  } catch (error) {
    console.error("Database update error:", error);
    return {
      success: false,
      message: "Database update failed.",
    };
  }
}