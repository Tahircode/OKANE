// lib/types/user.ts
export type User = {
    id: string;        // Keep as string since we're converting it
    name: string | null;
    phone: string | null;
    email: string | null;
    image: string | null;
  };