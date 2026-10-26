import type { Product } from '../types/Product';
const API_URL = 'http://localhost:8080/api/v1/products';
const BASE_URL = 'http://localhost:8080';
export interface BackendProduct {
    id: number; name: string; image?: string | null; description?: string | null;
    price: number; stock?: number | null;
    categoryName?: string | null; brandName?: string | null;
    colorNames?: string[] | null; sizeNames?: string[] | null;
    // Chỉ dùng khi API trả về danh sách biến thể tương ứng.
    details?: Array<{ colorName?: string | null; sizeName?: string | null; stockQuantity?: number }> | null;
}
interface ApiResponse<T> { code: number; message: string; data: T }
interface PageResponse<T> {
    content: T[]; total_pages?: number; totalPages?: number;
    total_elements?: number; totalElements?: number;
}
export interface CatalogItem { product: Product; metadata: BackendProduct }
const mapProduct = (item: BackendProduct): Product => ({
    id: String(item.id), name: item.name,
    imageUrl: !item.image ? '/placeholder.png' : /^https?:\/\//i.test(item.image)
        ? item.image : `${BASE_URL}/${item.image.replace(/^\/+/, '')}`,
    shortDescription: item.description ?? '', price: item.price,
    inStock: item.stock ?? 0
});
export async function getProductCatalog(signal?: AbortSignal): Promise<CatalogItem[]> {
    const items: CatalogItem[] = [];
    const size = 100;
    for (let page = 0; ; page++) {
        const response = await fetch(`${API_URL}?page=${page}&size=${size}`, { signal });
        if (!response.ok) throw new Error(`HTTP ${response.status}: Không thể tải sản phẩm`);
        const json: ApiResponse<PageResponse<BackendProduct>> = await response.json();
        if (!Array.isArray(json.data?.content)) throw new Error('Phản hồi API không có data.content');
        items.push(...json.data.content.map(item => ({ product: mapProduct(item), metadata: item })));
        const totalPages = json.data.total_pages ?? json.data.totalPages;
        if (totalPages !== undefined ? page + 1 >= totalPages : json.data.content.length < size) break;
        if (page >= 999) throw new Error('Vượt giới hạn số trang tải');
    }
    return items;
}
export async function getProducts(page = 0, size = 8): Promise<{
    products: Product[]; totalPages: number; totalElements: number;
}> {
    const response = await fetch(`${API_URL}?page=${page}&size=${size}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const json: ApiResponse<PageResponse<BackendProduct>> = await response.json();
    if (!Array.isArray(json.data?.content)) throw new Error('Phản hồi API không hợp lệ');
    return {
        products: json.data.content.map(mapProduct),
        totalPages: json.data.total_pages ?? json.data.totalPages ?? 0,
        totalElements: json.data.total_elements ?? json.data.totalElements ?? 0
    };
}

export const getProductById = async (
    id: string | number
): Promise<Product> => {
    const response = await fetch(`${API_URL}/${id}`);

    if (response.status === 404) {
        throw new Error("PRODUCT_NOT_FOUND");
    }

    if (!response.ok) {
        throw new Error(
            `Không thể lấy chi tiết sản phẩm: ${response.status}`
        );
    }

    const result: ApiResponse<BackendProduct> =
        await response.json();

    if (!result.data) {
        throw new Error("PRODUCT_NOT_FOUND");
    }

    return mapProduct(result.data);
};

