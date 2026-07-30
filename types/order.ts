export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type OrderItem = {
  id?: string;
  variantId: string;
  productId?: string;
  productName?: string;
  size?: string;
  quantity: number;
  price: number;
};

export type Order = {
  id: string;
  status: OrderStatus | string;
  total: number;
  created_at: string;
  items?: OrderItem[];
};