export interface JwtModel {
    id: string;
    name: string;
    email: string;
    role: string;
    permissions: {
      create: boolean;
      update: boolean;
      delete: boolean;
    };
    expirationTime: number;
    issuer: string;
    audience: string;
  }