export interface PayloadRefreshToken {
  token: string;
  exp: Date;
}

export interface Tokens {
  accesToken: string;
  refreshToken: PayloadRefreshToken;
}
