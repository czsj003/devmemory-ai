export type User = {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export type TokenResponse = {
  access_token: string;
  token_type: string;
};
