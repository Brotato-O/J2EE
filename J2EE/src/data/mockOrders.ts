import type { Order } from '../types/Order';
export const mockOrders: Order[] = [
    {
        id: 'ORD-2026-8891',
        date: '12/09/2026',
        status: 'shipping',
        statusText: 'Đang giao hàng',
        products: [
            {
                product: {
                    id: '1',
                    name: 'Laptop Gaming ASUS',
                    price: 25000000,
                    imageUrl: 'https://picsum.photos/400/300?random=1',
                    shortDescription: 'Laptop mạnh mẽ cho game thủ và đồ họa.',
                    inStock: 5,
                },
                quantity: 2
            },
            {
                product: {
                    id: '2',
                    name: 'iPhone 15 Pro',
                    price: 28000000,
                    imageUrl: 'https://picsum.photos/400/300?random=2',
                    shortDescription: 'Siêu phẩm smartphone mới nhất từ Apple.',
                    inStock: 12,
                },
                quantity: 3
            },
        ],
        totalAmount: '25.000.000 đ',
    },
    {
        id: 'ORD-2026-7720',
        date: '28/08/2026',
        status: 'completed',
        statusText: 'Giao hàng thành công',
        products: [
            {
                product: {
                    id: '3',
                    name: 'Tai nghe Sony WH-1000XM5',
                    price: 8500000,
                    imageUrl: 'https://picsum.photos/400/300?random=3',
                    shortDescription: 'Chống ồn đỉnh cao, âm thanh trung thực.',
                    inStock: 20,
                },
                quantity: 1
            },
        ],
        totalAmount: '4.440.000 đ',
    },
    {
        id: 'ORD-2026-6102',
        date: '15/07/2026',
        status: 'cancelled',
        statusText: 'Đã hủy',
        products: [
            {
                product: {
                    id: '4',
                    name: 'Bàn phím cơ Keychron Q1',
                    price: 4200000,
                    imageUrl: 'https://picsum.photos/400/300?random=4',
                    shortDescription: 'Trải nghiệm gõ phím tuyệt vời.',
                    inStock: 8,
                },
                quantity: 1
            },
            {
                product: {
                    id: '5',
                    name: 'Chuột Logitech G Pro X',
                    price: 3100000,
                    imageUrl: 'https://picsum.photos/400/300?random=5',
                    shortDescription: 'Trọng lượng siêu nhẹ cho game thủ chuyên nghiệp.',
                    inStock: 15,
                },
                quantity: 2
            },
        ],
        totalAmount: '1.890.000 đ',
    },
];