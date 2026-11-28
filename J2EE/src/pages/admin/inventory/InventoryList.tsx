import { useEffect, useState, useMemo } from "react";

interface ProductVariant {
    id: number;
    colorId: number;
    colorName: string;
    sizeId: number;
    sizeName: string;
    price: number | null;
    stockQuantity: number;
    sku: string | null;
}

interface Product {
    id: number;
    name: string;
    image: string;
    price: number;
    categoryName?: string;
    brandName?: string;
    variants?: ProductVariant[];
}

export interface SkuInventoryItem {
    variantId: number;
    productId: number;
    productName: string;
    productImage: string;
    sku: string;
    colorName: string;
    sizeName: string;
    price: number;
    stockQuantity: number;
    categoryName?: string;
    brandName?: string;
}

type StockFilterType = "all" | "in_stock" | "low_stock" | "out_of_stock";

export default function InventoryList() {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [inventoryItems, setInventoryItems] = useState<SkuInventoryItem[]>([]);
    const [searchKeyword, setSearchKeyword] = useState<string>("");
    const [stockFilter, setStockFilter] = useState<StockFilterType>("all");
    const [copiedSku, setCopiedSku] = useState<string | null>(null);

    // Phân trang
    const [currentPage, setCurrentPage] = useState<number>(1);
    const pageSize = 15;

    // Lấy headers xác thực
    const getAuthHeaders = (): Record<string, string> => {
        const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
        const tokenType = localStorage.getItem("adminTokenType") || "Bearer";
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };
        if (token) {
            headers.Authorization = `${tokenType} ${token}`;
        }
        return headers;
    };

    // Tải danh sách sản phẩm và phân rã thành danh sách biến thể SKU
    const fetchInventory = async () => {
        try {
            setLoading(true);
            setError(null);

            // Lấy toàn bộ sản phẩm (kích thước trang lớn để lấy đủ SKU)
            const response = await fetch("http://localhost:8080/api/v1/products?page=0&size=1000", {
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                throw new Error("Không thể tải danh sách tồn kho sản phẩm");
            }

            const result = await response.json();
            const productList: Product[] = result?.data?.content || [];

            const flatItems: SkuInventoryItem[] = [];

            productList.forEach((prod) => {
                const variants = prod.variants || [];
                if (variants.length > 0) {
                    variants.forEach((v) => {
                        flatItems.push({
                            variantId: v.id,
                            productId: prod.id,
                            productName: prod.name,
                            productImage: prod.image,
                            sku: v.sku && v.sku.trim() !== "" ? v.sku : `SKU-${prod.id}-${v.id}`,
                            colorName: v.colorName || "Mặc định",
                            sizeName: v.sizeName || "Mặc định",
                            price: v.price ?? prod.price ?? 0,
                            stockQuantity: v.stockQuantity ?? 0,
                            categoryName: prod.categoryName,
                            brandName: prod.brandName,
                        });
                    });
                } else {
                    // Sản phẩm không có biến thể riêng -> coi chính nó là 1 SKU
                    flatItems.push({
                        variantId: prod.id,
                        productId: prod.id,
                        productName: prod.name,
                        productImage: prod.image,
                        sku: `SP-${prod.id}`,
                        colorName: "Tiêu chuẩn",
                        sizeName: "Tiêu chuẩn",
                        price: prod.price ?? 0,
                        stockQuantity: 0,
                        categoryName: prod.categoryName,
                        brandName: prod.brandName,
                    });
                }
            });

            setInventoryItems(flatItems);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    // Thống kê nhanh
    const stats = useMemo(() => {
        const total = inventoryItems.length;
        const inStock = inventoryItems.filter((i) => i.stockQuantity > 5).length;
        const lowStock = inventoryItems.filter((i) => i.stockQuantity > 0 && i.stockQuantity <= 5).length;
        const outOfStock = inventoryItems.filter((i) => i.stockQuantity === 0).length;
        return { total, inStock, lowStock, outOfStock };
    }, [inventoryItems]);

    // Lọc danh sách theo tìm kiếm và trạng thái tồn kho
    const filteredItems = useMemo(() => {
        return inventoryItems.filter((item) => {
            // Lọc theo từ khóa SKU hoặc Tên sản phẩm
            const keyword = searchKeyword.trim().toLowerCase();
            const matchesKeyword =
                !keyword ||
                item.sku.toLowerCase().includes(keyword) ||
                item.productName.toLowerCase().includes(keyword) ||
                item.colorName.toLowerCase().includes(keyword) ||
                item.sizeName.toLowerCase().includes(keyword);

            if (!matchesKeyword) return false;

            // Lọc theo trạng thái tồn kho
            if (stockFilter === "in_stock") return item.stockQuantity > 5;
            if (stockFilter === "low_stock") return item.stockQuantity > 0 && item.stockQuantity <= 5;
            if (stockFilter === "out_of_stock") return item.stockQuantity === 0;

            return true;
        });
    }, [inventoryItems, searchKeyword, stockFilter]);

    // Phân trang dữ liệu đã lọc
    const totalPages = Math.ceil(filteredItems.length / pageSize) || 1;
    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredItems.slice(start, start + pageSize);
    }, [filteredItems, currentPage, pageSize]);

    // Reset về trang 1 khi thay đổi bộ lọc
    useEffect(() => {
        setCurrentPage(1);
    }, [searchKeyword, stockFilter]);

    // Sao chép nhanh mã SKU
    const handleCopySku = (sku: string) => {
        navigator.clipboard.writeText(sku);
        setCopiedSku(sku);
        setTimeout(() => setCopiedSku(null), 2000);
    };

    // Format tiền tệ VNĐ
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);
    };

    return (
        <div style={{ padding: "8px 0" }}>
            {/* TIÊU ĐỀ TRANG */}
            <div className="page-header" style={{ marginBottom: "20px" }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: "26px", fontWeight: "700", color: "#111827" }}>
                        📋 Quản lý Tồn kho SKU
                    </h1>
                    <p style={{ margin: "4px 0 0 0", color: "#6b7280", fontSize: "14px" }}>
                        Tra cứu nhanh số lượng tồn kho theo từng mã biến thể SKU
                    </p>
                </div>
                <button
                    onClick={fetchInventory}
                    disabled={loading}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "8px 16px",
                        background: "#fff",
                        border: "1px solid #d1d5db",
                        borderRadius: "8px",
                        fontWeight: "600",
                        fontSize: "14px",
                        color: "#374151",
                        cursor: loading ? "not-allowed" : "pointer",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                    }}
                >
                    🔄 {loading ? "Đang tải..." : "Làm mới dữ liệu"}
                </button>
            </div>

            {/* THẺ THỐNG KÊ NHANH (KPI CARDS) */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "16px",
                    marginBottom: "24px",
                }}
            >
                {/* TỔNG SKU */}
                <div
                    onClick={() => setStockFilter("all")}
                    style={{
                        background: stockFilter === "all" ? "#eff6ff" : "#fff",
                        border: stockFilter === "all" ? "2px solid #3b82f6" : "1px solid #e5e7eb",
                        borderRadius: "12px",
                        padding: "16px 20px",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    }}
                >
                    <div style={{ fontSize: "13px", fontWeight: "600", color: "#6b7280", textTransform: "uppercase" }}>
                        📦 Tổng số mã SKU
                    </div>
                    <div style={{ fontSize: "28px", fontWeight: "700", color: "#111827", marginTop: "4px" }}>
                        {stats.total}
                    </div>
                    <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "2px" }}>Tất cả phân loại hàng</div>
                </div>

                {/* CÒN HÀNG */}
                <div
                    onClick={() => setStockFilter("in_stock")}
                    style={{
                        background: stockFilter === "in_stock" ? "#f0fdf4" : "#fff",
                        border: stockFilter === "in_stock" ? "2px solid #22c55e" : "1px solid #e5e7eb",
                        borderRadius: "12px",
                        padding: "16px 20px",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    }}
                >
                    <div style={{ fontSize: "13px", fontWeight: "600", color: "#16a34a", textTransform: "uppercase" }}>
                        🟢 Còn hàng (&gt; 5)
                    </div>
                    <div style={{ fontSize: "28px", fontWeight: "700", color: "#15803d", marginTop: "4px" }}>
                        {stats.inStock}
                    </div>
                    <div style={{ fontSize: "12px", color: "#16a34a", marginTop: "2px" }}>Đủ hàng bán</div>
                </div>

                {/* SẮP HẾT HÀNG */}
                <div
                    onClick={() => setStockFilter("low_stock")}
                    style={{
                        background: stockFilter === "low_stock" ? "#fffbeb" : "#fff",
                        border: stockFilter === "low_stock" ? "2px solid #f59e0b" : "1px solid #e5e7eb",
                        borderRadius: "12px",
                        padding: "16px 20px",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    }}
                >
                    <div style={{ fontSize: "13px", fontWeight: "600", color: "#d97706", textTransform: "uppercase" }}>
                        🟡 Sắp hết hàng (1 - 5)
                    </div>
                    <div style={{ fontSize: "28px", fontWeight: "700", color: "#b45309", marginTop: "4px" }}>
                        {stats.lowStock}
                    </div>
                    <div style={{ fontSize: "12px", color: "#d97706", marginTop: "2px" }}>Cần chuẩn bị nhập thêm</div>
                </div>

                {/* HẾT HÀNG */}
                <div
                    onClick={() => setStockFilter("out_of_stock")}
                    style={{
                        background: stockFilter === "out_of_stock" ? "#fef2f2" : "#fff",
                        border: stockFilter === "out_of_stock" ? "2px solid #ef4444" : "1px solid #e5e7eb",
                        borderRadius: "12px",
                        padding: "16px 20px",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    }}
                >
                    <div style={{ fontSize: "13px", fontWeight: "600", color: "#dc2626", textTransform: "uppercase" }}>
                        🔴 Hết hàng (= 0)
                    </div>
                    <div style={{ fontSize: "28px", fontWeight: "700", color: "#b91c1c", marginTop: "4px" }}>
                        {stats.outOfStock}
                    </div>
                    <div style={{ fontSize: "12px", color: "#dc2626", marginTop: "2px" }}>Cần nhập hàng gấp</div>
                </div>
            </div>

            {/* THANH TÌM KIẾM VÀ BỘ LỌC TABS */}
            <div
                style={{
                    background: "#fff",
                    borderRadius: "12px",
                    padding: "16px 20px",
                    marginBottom: "16px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                }}
            >
                {/* Ô TÌM KIẾM */}
                <div style={{ position: "relative", flex: "1 1 320px", maxWidth: "450px" }}>
                    <span
                        style={{
                            position: "absolute",
                            left: "12px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#9ca3af",
                            fontSize: "16px",
                        }}
                    >
                        🔍
                    </span>
                    <input
                        type="text"
                        placeholder="Tìm theo mã SKU, tên sản phẩm, màu sắc, size..."
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "10px 12px 10px 38px",
                            border: "1px solid #d1d5db",
                            borderRadius: "8px",
                            fontSize: "14px",
                            outline: "none",
                            transition: "border 0.2s",
                        }}
                    />
                    {searchKeyword && (
                        <button
                            onClick={() => setSearchKeyword("")}
                            style={{
                                position: "absolute",
                                right: "10px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                background: "none",
                                border: "none",
                                color: "#9ca3af",
                                cursor: "pointer",
                                fontSize: "14px",
                            }}
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* BỘ LỌC TABS */}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <button
                        onClick={() => setStockFilter("all")}
                        style={{
                            padding: "8px 14px",
                            borderRadius: "8px",
                            fontSize: "13px",
                            fontWeight: "600",
                            border: "none",
                            cursor: "pointer",
                            background: stockFilter === "all" ? "#1f2937" : "#f3f4f6",
                            color: stockFilter === "all" ? "#fff" : "#4b5563",
                        }}
                    >
                        Tất cả ({inventoryItems.length})
                    </button>
                    <button
                        onClick={() => setStockFilter("in_stock")}
                        style={{
                            padding: "8px 14px",
                            borderRadius: "8px",
                            fontSize: "13px",
                            fontWeight: "600",
                            border: "none",
                            cursor: "pointer",
                            background: stockFilter === "in_stock" ? "#16a34a" : "#f3f4f6",
                            color: stockFilter === "in_stock" ? "#fff" : "#4b5563",
                        }}
                    >
                        Còn hàng ({stats.inStock})
                    </button>
                    <button
                        onClick={() => setStockFilter("low_stock")}
                        style={{
                            padding: "8px 14px",
                            borderRadius: "8px",
                            fontSize: "13px",
                            fontWeight: "600",
                            border: "none",
                            cursor: "pointer",
                            background: stockFilter === "low_stock" ? "#d97706" : "#f3f4f6",
                            color: stockFilter === "low_stock" ? "#fff" : "#4b5563",
                        }}
                    >
                        Sắp hết ({stats.lowStock})
                    </button>
                    <button
                        onClick={() => setStockFilter("out_of_stock")}
                        style={{
                            padding: "8px 14px",
                            borderRadius: "8px",
                            fontSize: "13px",
                            fontWeight: "600",
                            border: "none",
                            cursor: "pointer",
                            background: stockFilter === "out_of_stock" ? "#dc2626" : "#f3f4f6",
                            color: stockFilter === "out_of_stock" ? "#fff" : "#4b5563",
                        }}
                    >
                        Hết hàng ({stats.outOfStock})
                    </button>
                </div>
            </div>

            {/* THÔNG BÁO LỖI HOẶC SAO CHÉP */}
            {error && (
                <div
                    style={{
                        padding: "12px 16px",
                        background: "#fee2e2",
                        color: "#b91c1c",
                        borderRadius: "8px",
                        marginBottom: "16px",
                        fontSize: "14px",
                    }}
                >
                    ⚠️ {error}
                </div>
            )}

            {copiedSku && (
                <div
                    style={{
                        position: "fixed",
                        bottom: "24px",
                        right: "24px",
                        background: "#10b981",
                        color: "#fff",
                        padding: "10px 18px",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        fontSize: "14px",
                        fontWeight: "600",
                        zIndex: 9999,
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                    }}
                >
                    ✅ Đã sao chép mã SKU: <span style={{ textDecoration: "underline" }}>{copiedSku}</span>
                </div>
            )}

            {/* BẢNG DỮ LIỆU TỒN KHO SKU */}
            <div
                style={{
                    background: "#fff",
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    overflow: "hidden",
                }}
            >
                <div style={{ overflowX: "auto" }}>
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            textAlign: "left",
                            fontSize: "14px",
                        }}
                    >
                        <thead>
                            <tr
                                style={{
                                    background: "#f9fafb",
                                    borderBottom: "1px solid #e5e7eb",
                                    color: "#4b5563",
                                    fontWeight: "600",
                                }}
                            >
                                <th style={{ padding: "14px 16px", width: "50px", textAlign: "center" }}>STT</th>
                                <th style={{ padding: "14px 16px", minWidth: "180px" }}>Mã SKU</th>
                                <th style={{ padding: "14px 16px", minWidth: "220px" }}>Sản phẩm</th>
                                <th style={{ padding: "14px 16px", minWidth: "120px" }}>Màu sắc</th>
                                <th style={{ padding: "14px 16px", minWidth: "100px" }}>Kích cỡ</th>
                                <th style={{ padding: "14px 16px", minWidth: "130px", textAlign: "right" }}>Đơn giá</th>
                                <th style={{ padding: "14px 16px", minWidth: "130px", textAlign: "center" }}>
                                    Số lượng tồn
                                </th>
                                <th style={{ padding: "14px 16px", minWidth: "130px", textAlign: "center" }}>
                                    Trạng thái
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={8} style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>
                                        ⏳ Đang tải dữ liệu tồn kho...
                                    </td>
                                </tr>
                            ) : paginatedItems.length === 0 ? (
                                <tr>
                                    <td colSpan={8} style={{ padding: "40px", textAlign: "center", color: "#9ca3af" }}>
                                        Không tìm thấy mã SKU nào phù hợp với điều kiện tìm kiếm.
                                    </td>
                                </tr>
                            ) : (
                                paginatedItems.map((item, idx) => {
                                    const indexNumber = (currentPage - 1) * pageSize + idx + 1;

                                    // Xác định màu trạng thái
                                    let badgeBg = "#f0fdf4";
                                    let badgeColor = "#15803d";
                                    let statusText = "Còn hàng";

                                    if (item.stockQuantity === 0) {
                                        badgeBg = "#fef2f2";
                                        badgeColor = "#b91c1c";
                                        statusText = "Hết hàng";
                                    } else if (item.stockQuantity <= 5) {
                                        badgeBg = "#fffbeb";
                                        badgeColor = "#b45309";
                                        statusText = "Sắp hết hàng";
                                    }

                                    return (
                                        <tr
                                            key={`${item.productId}-${item.variantId}-${idx}`}
                                            style={{
                                                borderBottom: "1px solid #f3f4f6",
                                                transition: "background 0.15s",
                                            }}
                                            onMouseEnter={(e) => (e.currentTarget.style.background = "#f9fafb")}
                                            onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
                                        >
                                            {/* STT */}
                                            <td style={{ padding: "12px 16px", textAlign: "center", color: "#9ca3af" }}>
                                                {indexNumber}
                                            </td>

                                            {/* MÃ SKU */}
                                            <td style={{ padding: "12px 16px" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                    <span
                                                        style={{
                                                            fontFamily: "monospace",
                                                            fontWeight: "700",
                                                            fontSize: "14px",
                                                            background: "#f3f4f6",
                                                            padding: "4px 8px",
                                                            borderRadius: "6px",
                                                            color: "#1f2937",
                                                            border: "1px solid #e5e7eb",
                                                        }}
                                                    >
                                                        {item.sku}
                                                    </span>
                                                    <button
                                                        onClick={() => handleCopySku(item.sku)}
                                                        title="Sao chép mã SKU này"
                                                        style={{
                                                            border: "none",
                                                            background: "transparent",
                                                            cursor: "pointer",
                                                            fontSize: "14px",
                                                            padding: "2px 4px",
                                                            borderRadius: "4px",
                                                        }}
                                                    >
                                                        📋
                                                    </button>
                                                </div>
                                            </td>

                                            {/* TÊN SẢN PHẨM & ẢNH */}
                                            <td style={{ padding: "12px 16px" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                    {item.productImage && (
                                                        <img
                                                            src={item.productImage}
                                                            alt={item.productName}
                                                            style={{
                                                                width: "36px",
                                                                height: "36px",
                                                                borderRadius: "6px",
                                                                objectFit: "cover",
                                                                border: "1px solid #e5e7eb",
                                                            }}
                                                            onError={(e) => (e.currentTarget.style.display = "none")}
                                                        />
                                                    )}
                                                    <div>
                                                        <div style={{ fontWeight: "600", color: "#111827" }}>
                                                            {item.productName}
                                                        </div>
                                                        <div style={{ fontSize: "12px", color: "#6b7280" }}>
                                                            Mã SP: #{item.productId}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* MÀU SẮC */}
                                            <td style={{ padding: "12px 16px", color: "#374151" }}>
                                                <span
                                                    style={{
                                                        background: "#f9fafb",
                                                        padding: "3px 8px",
                                                        borderRadius: "4px",
                                                        border: "1px solid #e5e7eb",
                                                        fontSize: "13px",
                                                    }}
                                                >
                                                    {item.colorName}
                                                </span>
                                            </td>

                                            {/* KÍCH CỠ */}
                                            <td style={{ padding: "12px 16px", color: "#374151" }}>
                                                <span
                                                    style={{
                                                        background: "#f9fafb",
                                                        padding: "3px 8px",
                                                        borderRadius: "4px",
                                                        border: "1px solid #e5e7eb",
                                                        fontSize: "13px",
                                                        fontWeight: "600",
                                                    }}
                                                >
                                                    {item.sizeName}
                                                </span>
                                            </td>

                                            {/* GIÁ BÁN */}
                                            <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: "600", color: "#111827" }}>
                                                {formatCurrency(item.price)}
                                            </td>

                                            {/* SỐ LƯỢNG TỒN KHO */}
                                            <td style={{ padding: "12px 16px", textAlign: "center" }}>
                                                <span
                                                    style={{
                                                        display: "inline-block",
                                                        minWidth: "48px",
                                                        padding: "4px 10px",
                                                        borderRadius: "20px",
                                                        fontWeight: "700",
                                                        fontSize: "15px",
                                                        background:
                                                            item.stockQuantity === 0
                                                                ? "#fef2f2"
                                                                : item.stockQuantity <= 5
                                                                ? "#fffbeb"
                                                                : "#f0fdf4",
                                                        color:
                                                            item.stockQuantity === 0
                                                                ? "#dc2626"
                                                                : item.stockQuantity <= 5
                                                                ? "#d97706"
                                                                : "#16a34a",
                                                        border: `1px solid ${
                                                            item.stockQuantity === 0
                                                                ? "#fecaca"
                                                                : item.stockQuantity <= 5
                                                                ? "#fde68a"
                                                                : "#bbf7d0"
                                                        }`,
                                                    }}
                                                >
                                                    {item.stockQuantity}
                                                </span>
                                            </td>

                                            {/* TRẠNG THÁI BADGE */}
                                            <td style={{ padding: "12px 16px", textAlign: "center" }}>
                                                <span
                                                    style={{
                                                        padding: "4px 10px",
                                                        borderRadius: "12px",
                                                        fontSize: "12px",
                                                        fontWeight: "600",
                                                        background: badgeBg,
                                                        color: badgeColor,
                                                    }}
                                                >
                                                    {statusText}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* THANH PHÂN TRANG */}
                {!loading && filteredItems.length > 0 && (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "14px 20px",
                            borderTop: "1px solid #e5e7eb",
                            background: "#f9fafb",
                            fontSize: "14px",
                            color: "#4b5563",
                        }}
                    >
                        <div>
                            Hiển thị <strong>{paginatedItems.length}</strong> / <strong>{filteredItems.length}</strong> mã SKU
                        </div>
                        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                style={{
                                    padding: "6px 12px",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "6px",
                                    background: currentPage === 1 ? "#f3f4f6" : "#fff",
                                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                                    color: currentPage === 1 ? "#9ca3af" : "#374151",
                                    fontWeight: "500",
                                }}
                            >
                                Trang trước
                            </button>
                            <span style={{ padding: "0 8px", fontWeight: "600" }}>
                                {currentPage} / {totalPages}
                            </span>
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                style={{
                                    padding: "6px 12px",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "6px",
                                    background: currentPage === totalPages ? "#f3f4f6" : "#fff",
                                    cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                                    color: currentPage === totalPages ? "#9ca3af" : "#374151",
                                    fontWeight: "500",
                                }}
                            >
                                Trang sau
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
