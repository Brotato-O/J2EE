export interface CartItem {
  id: number;
  variantId: number;
  sku: string;
  productId: number;
  productName: string;
  image: string;
  color: string;
  size: string;
  quantity: number;
  availableStock: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CartResponse {
  cartId: number;
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
}

export interface AddToCartRequest {
  variantId: number;
  quantity: number;
}export interface CartItem {
  id: number;
  variantId: number;
  sku: string;
  productId: number;
  productName: string;
  image: string;
  color: string;
  size: string;
  quantity: number;
  availableStock: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CartResponse {
  cartId: number;
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
}

export interface AddToCartRequest {
  variantId: number;
  quantity: number;
}