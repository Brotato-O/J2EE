import type { Product } from './Product';

export interface Order {
    id: string;
    date: string;
    status: 'completed' | 'shipping' | 'cancelled';
    statusText: string;
    products: {
        product: Product;
        quantity: number;
    }[];
    totalAmount: string;
}

