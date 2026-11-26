/**
 * Tự động sinh mã SKU theo cấu trúc chính xác: {productId}-{colorName}-{sizeName}
 * Giữ nguyên màu sắc và kích thước như khi chọn (không viết hoa, không bỏ dấu nếu không cần)
 * 
 * Ví dụ: 
 *   - id: 45, màu: "xanh", size: "m" -> "45-xanh-m"
 *   - id: 45, màu: "Trắng", size: "XL" -> "45-Trắng-XL"
 *   - Khi thêm mới chưa có id: dùng "SP" -> "SP-Trắng-XL"
 */
export function generateSku(
    _productName: string,
    colorName: string,
    sizeName: string,
    productId?: number | string
): string {
    const idPrefix = productId ? String(productId) : "SP";
    const c = (colorName || "").trim();
    const s = (sizeName || "").trim();

    return `${idPrefix}-${c}-${s}`;
}
