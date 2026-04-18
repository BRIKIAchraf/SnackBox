export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  IN_PREPARATION = 'IN_PREPARATION',
  BAKING = 'BAKING',
  READY = 'READY',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  AUTHORIZED = 'AUTHORIZED',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  KITCHEN = 'KITCHEN',
  DELIVERY = 'DELIVERY',
  CLIENT = 'CLIENT',
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  statusCode: number;
}

export interface UserDTO {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface ProductDTO {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
}

export interface CategoryDTO {
  id: string;
  name: string;
  products?: ProductDTO[];
}

export interface CreateOrderDTO {
  items: {
    productId: string;
    quantity: number;
  }[];
  deliveryAddress: string;
  customerPhone: string;
  customerName: string;
}

export interface OrderDTO {
  id: string;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  items: any[];
  createdAt: string;
  deliveryAddress: string;
}
