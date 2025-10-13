
export interface Credentials {
    name: string;
    phone: string;
    password: string;
  }
  
  export interface FormState {
    success: boolean;
    message: string;
    credentials?: Credentials;
    errors?: Record<string, string[] | undefined>;
  }
  
  export const initialState: FormState = {
    success: false,
    message: '',
    errors: {},
  };
  