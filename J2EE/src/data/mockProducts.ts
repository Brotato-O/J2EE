import type { Product } from '../types/Product';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Laptop Gaming ASUS',
    price: 25000000,
    imageUrl: 'https://picsum.photos/400/300?random=1',
    shortDescription: 'Laptop mạnh mẽ cho game thủ và đồ họa.',
    inStock: 5,
  },
  {
    id: '2',
    name: 'iPhone 15 Pro',
    price: 28000000,
    imageUrl: 'https://picsum.photos/400/300?random=2',
    shortDescription: 'Siêu phẩm smartphone mới nhất từ Apple.',
    inStock: 12,
  },
  {
    id: '3',
    name: 'Tai nghe Sony WH-1000XM5',
    price: 8500000,
    imageUrl: 'https://picsum.photos/400/300?random=3',
    shortDescription: 'Chống ồn đỉnh cao, âm thanh trung thực.',
    inStock: 20,
  },
  {
    id: '4',
    name: 'Bàn phím cơ Keychron Q1',
    price: 4200000,
    imageUrl: 'https://picsum.photos/400/300?random=4',
    shortDescription: 'Trải nghiệm gõ phím tuyệt vời.',
    inStock: 8,
  },
  {
    id: '5',
    name: 'Chuột Logitech G Pro X',
    price: 3100000,
    imageUrl: 'https://picsum.photos/400/300?random=5',
    shortDescription: 'Trọng lượng siêu nhẹ cho game thủ chuyên nghiệp.',
    inStock: 15,
  },
];
