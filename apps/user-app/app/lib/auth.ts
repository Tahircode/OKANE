import db from "@repo/db/client";
import { PrismaClient } from "@prisma/client";
import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { AdapterUser } from "next-auth/adapters";


const CustomPrismaAdapter = (prisma: PrismaClient) => {
    const adapter = PrismaAdapter(prisma);
  
    return {
      ...adapter,
  
      async createUser(userData: Omit<AdapterUser, "id">): Promise<AdapterUser> {
        return await db.$transaction(async (tx ) => {
          // Create the user
          const user = await tx.user.create({
            data: userData,
          });
  
          //  Create associated balance
          const rs=1000;
          const paisa=rs*100;
          await tx.balance.create({
              data:{
                  amount: paisa,
                  locked: 0,
                  userId : user.id,
              }
          })
  
          // Optionally create an account
        //   await tx.account.create({
        //     data: {
        //       type: "oauth",
        //       provider: "google",
        //       providerAccountId:
        //         user.email ?? user.phone ?? user.id.toString(),
        //       userId: user.id,
        //     },
        //   });
  
          return user as AdapterUser;
        });
      },
    };
  };

export const authOptions: NextAuthOptions = ({
    adapter: CustomPrismaAdapter(db),
     providers:[
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
           CredentialsProvider({
            name: "Phone and Password",
            credentials:{

                phone: { label :"Phone Number", type: "text", placeholder:"+918756381001"},
                password : { label : "Password", type:"password",}
            },
            async authorize(credentials){
                if(!credentials?.phone || !credentials.password){
                      console.log("Missing credentials");
                      return null;
                }
                try{
               
                    const account = await db.account.findUnique({
                        where: {
                            provider_providerAccountId: {
                                provider: 'credentials',
                                //  the phone number is the unique providerAccountId
                                providerAccountId: credentials.phone as string,
                            },
                        },
                        include: { user: true } // Eagerly load the linked User record
                    });

                    if(!account || !account.password_hash){
                        console.log("Account not found or no password hash set (e.g., OAuth account)");
                        return null; 
                    }
                    
                    const passwordIsValid = await bcrypt.compare(
                        credentials.password as string, 
                        account.password_hash
                    );
                    
                    if ( !passwordIsValid){
                        console.log("Invalid password");
                        return null;
                    }
                    
                    // .Return the linked User object
                    return account.user;

                }catch(e){
                    console.error("Authorize error: ", e)
                    return null;
                }
            }
           })
     ],
     session :{
        // strategy: "database",
        strategy: "jwt",

     },
     callbacks: {
        async session({ session, token }) {
          // Send properties to the client
          if (token) {
            session.user.id = token.id as string;
            session.user.name = token.name;
            session.user.email = token.email;
            session.user.image = token.picture;
            session.user.phone = token.phone as string; 
          }
          
          return session;
        },
        async jwt({ token, user, trigger, session }) {
          // Initial sign in
          if (user) {
            token.id = user.id;
            token.phone = user.phone;
          }
          
          if (trigger === "update" && session?.user) {
            token.name = session.user.name;
            token.email = session.user.email;
            token.picture = session.user.image;
            token.phone = session.user.phone;
          }
          
          return token;
        },
      },
     pages:{
        signIn: '/auth/signin'
     }

});
