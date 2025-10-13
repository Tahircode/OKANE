"use server";
import db from "@repo/db/client";
import bcrypt from "bcrypt";
// import { z } from 'zod';

import { FormState, Credentials } from "../types/form";

// const SignupSchema = z.object({
//   phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format.'),
//   password: z.string().min(8, 'Password must be at least 8 characters.'),
//   confirmPassword: z.string(),
// }).refine(data => data.password === data.confirmPassword, {
//   message: "Passwords don't match.",
//   path: ["confirmPassword"],
// });


export async function signUpAction(prevState: FormState, formData: FormData): Promise<FormState> {
    const data = Object.fromEntries(formData.entries()) as unknown as Credentials;
    //   const parsed = SignupSchema.safeParse(data);
const {name,phone,password} = data as Credentials;
// const name = formData.get('name') as string;
// const phone = formData.get('phone') as string;
// const password = formData.get('password') as string;

//   if (!parsed.success) {
//     return {
//       success: false,
//       message: 'Validation failed. Please check your inputs.',
//       errors: parsed.error.flatten().fieldErrors,
//     };
//   }

//   const { phone, password } = parsed.data;
if (!name || !phone || !password) {
    return {
      success: false,
      message: 'Please fill in all fields.',
      errors: { name: !name ? ['Name is required.'] : undefined, phone: !phone ? ['Phone is required.'] : undefined, password: !password ? ['Password is required.'] : undefined },
    };
  }
  if (!/^\d{10}$/.test(phone)) {
    return {
        success: false,
        message: 'Phone number must be exactly 10 digits',
        errors: {  phone:  ['Phone Number must be 10 digits.']},
      };
  }

  try {
    // Check if the phone number is already registered
    const existingUser = await db.user.findUnique({ where: { phone } });
    if (existingUser) {
        return { 
            success: false, 
            message: 'A user with this phone number already exists.', 
            errors: { phone: ["This number is already in use."] } 
        };
    }
    
    // 1. Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. Use a transaction to ensure both User and Account creation succeed or fail together
    await db.$transaction(async (tx  ) => {
        // Create the new User record
        const user = await tx.user.create({ 
            data: { phone, name, email: null, image: null } // Only providing required/unique fields
        });
        
        // create balance record
        const rs=1000;
        const paisa=rs*100;
        await tx.balance.create({
            data:{
                amount: paisa,
                locked: 0,
                userId : user.id,
            }
        })

        // Create the linked Account record with the password hash
        await tx.account.create({
            data: {
                type: 'credentials', 
                provider: 'credentials',
                providerAccountId: phone, 
                password_hash: hashedPassword,
                userId: user.id, // Link the user ID immediately
            },
        });
        
        
        // Note: No need for a separate update, as the user ID is linked on creation within the transaction.
    });


    // On success, return the credentials. The client will use this to call signIn().
    return { 
        success: true, 
        message: 'Account successfully created! Logging you in...', 
        credentials: { name, phone, password }
    };

  } catch (e) {
    console.error('Sign Up Database Error:', e);
    return { success: false, message: 'An unexpected database error occurred during sign up.', errors: {} };
  }
}

