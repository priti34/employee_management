import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      _id?: string;
      isVerified?: boolean;
      isAcceptingMessages?: boolean;
      username?: string;
    } & DefaultSession['user'];
  }
// At the top of the file or in a types.ts file
import { AxiosError } from 'axios';

// Define the structure of your error response
interface CustomErrorResponse {
  message?: string; // Optional to avoid TypeScript errors
}

// Extend AxiosError to use the custom error response type
interface CustomAxiosError extends AxiosError {
  response?: {
    data: CustomErrorResponse;
  };
}

  interface User {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    username?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    username?: string;
  }
}
