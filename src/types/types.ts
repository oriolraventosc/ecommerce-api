import type { JwtPayload } from "jsonwebtoken";
export interface Product {
  name: string;
  price: string;
  id: string;
  quantity: number;
  image: string;
}

export interface Credentials {
  username: string;
  password: string;
}

export interface UserTokenPayload extends JwtPayload {
  id: string;
  username: string;
}

export interface CheckoutData {
  name: string;
  email: string;
  pendingProducts: Product[];
}

export interface AdminData {
  username: string;
  password: string;
  id: string;
  pendingOrders: Product[];
  finishedOrders: Product[];
}
