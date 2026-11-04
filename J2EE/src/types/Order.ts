export interface OrderRequest {
    address: string;
}

export interface OrderItem {
    orderDetailId: number;
    productId: number;
    productName: string;
    colorName: string;
    sizeName: string;
    quantity: number;
    price: number;
    totalPrice: number;
}

export interface OrderResponse {
    orderId: number;
    customerId: number;
    customerName: string;
    orderDate: string;
    status: string;
    address: string;
    totalPrice: number;
    items: OrderItem[];
}