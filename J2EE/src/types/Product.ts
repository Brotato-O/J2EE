export interface ProductVariant {
  id: number;
  colorId: number | null;
  colorName: string | null;
  sizeId: number | null;
  sizeName: string | null;
  price: number | null;
  stockQuantity: number | null;
  sku: string | null;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  shortDescription: string;
  inStock: number;
  variants: ProductVariant[];
}