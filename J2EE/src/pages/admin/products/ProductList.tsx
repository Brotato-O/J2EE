import {
    useEffect,
    useState,
    type ChangeEvent,
} from "react";
import { useNavigate } from "react-router-dom";

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
    description: string;
    brandId: number;
    brandName: string;
    categoryId: number;
    categoryName: string;
    supplierId: number;
    supplierName: string;
    stock: number;
    status: number;
    viewer: number;
    variants: ProductVariant[];
}

interface ProductApiResponse {
    code: number;
    message: string;
    data: {
        content: Product[];
        page_no: number;
        page_size: number;
        total_elements: number;
        total_pages: number;
        is_last: boolean;
    };
}

export default function ProductList() {
    const navigate = useNavigate();

    const [products, setProducts] = useState<Product[]>([]);

    // Trang hiện tại - backend dùng page bắt đầu từ 0
    const [currentPage, setCurrentPage] = useState(0);

    // Số sản phẩm / trang
    const [pageSize, setPageSize] = useState(10);

    // Tổng số trang
    const [totalPages, setTotalPages] = useState(0);

    // Tổng số sản phẩm
    const [totalElements, setTotalElements] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =========================
    // LẤY DANH SÁCH SẢN PHẨM
    // =========================

    const fetchProducts = async (
        page: number = currentPage,
        size: number = pageSize
    ) => {
        try {
            setLoading(true);
            setError("");

            console.log(
                "Đang lấy trang:",
                page + 1,
                "size:",
                size
            );

            const response = await fetch(
                `http://localhost:8080/api/v1/products?page=${page}&size=${size}`
            );

            if (!response.ok) {
                throw new Error(
                    `Không thể lấy danh sách sản phẩm. HTTP ${response.status}`
                );
            }

            const result: ProductApiResponse =
                await response.json();

            console.log("Products API:", result);

            if (result.code !== 200) {
                throw new Error(
                    result.message ||
                    "Lấy danh sách sản phẩm thất bại"
                );
            }

            setProducts(result.data.content || []);

            // Backend response page_no bắt đầu từ 1
            // Frontend currentPage bắt đầu từ 0
            setCurrentPage(
                result.data.page_no - 1
            );

            setTotalPages(
                result.data.total_pages
            );

            setTotalElements(
                result.data.total_elements
            );

            setPageSize(
                result.data.page_size
            );
        } catch (err) {
            console.error(
                "Lỗi lấy sản phẩm:",
                err
            );

            setError(
                err instanceof Error
                    ? err.message
                    : "Có lỗi xảy ra khi lấy sản phẩm"
            );
        } finally {
            setLoading(false);
        }
    };
    // =========================
    // LOAD TRANG ĐẦU
    // =========================

    useEffect(() => {
        fetchProducts(0, pageSize);
    }, []);

    // =========================
    // CHUYỂN TRANG
    // =========================

    const handlePageChange = (page: number) => {
        if (
            page < 0 ||
            page >= totalPages ||
            page === currentPage
        ) {
            return;
        }

        fetchProducts(page, pageSize);
    };

    // =========================
    // ĐỔI SỐ SẢN PHẨM / TRANG
    // =========================

    const handlePageSizeChange = (
        e: ChangeEvent<HTMLSelectElement>
    ) => {
        const newSize = Number(e.target.value);

        setPageSize(newSize);

        // Đổi số lượng -> về trang đầu
        fetchProducts(0, newSize);
    };

    // =========================
    // XÓA SẢN PHẨM
    // =========================

    const handleDelete = async (id: number) => {
        const product = products.find(
            (p) => p.id === id
        );

        if (!product) return;

        const confirmed = window.confirm(
            `Bạn có chắc muốn xóa sản phẩm "${product.name}"?`
        );

        if (!confirmed) return;

        try {
            const token =
                localStorage.getItem("adminToken");

            const tokenType =
                localStorage.getItem(
                    "adminTokenType"
                ) || "Bearer";

            const headers: HeadersInit = {};

            if (token) {
                headers.Authorization = `${tokenType} ${token}`;
            }

            const response = await fetch(
                `http://localhost:8080/api/v1/products/${id}`,
                {
                    method: "DELETE",
                    headers,
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Xóa sản phẩm thất bại. HTTP ${response.status}`
                );
            }

            alert("Xóa sản phẩm thành công!");

            // Nếu xóa sản phẩm cuối cùng của trang
            // thì quay về trang trước
            if (
                products.length === 1 &&
                currentPage > 0
            ) {
                fetchProducts(
                    currentPage - 1,
                    pageSize
                );
            } else {
                fetchProducts(
                    currentPage,
                    pageSize
                );
            }
        } catch (err) {
            console.error(
                "Lỗi xóa sản phẩm:",
                err
            );

            alert(
                err instanceof Error
                    ? err.message
                    : "Có lỗi xảy ra khi xóa sản phẩm"
            );
        }
    };

    // =========================
    // TẠO CÁC NÚT PHÂN TRANG
    // =========================

    const getPaginationPages = () => {
        const pages: (number | string)[] = [];

        // Ít trang -> hiển thị toàn bộ
        if (totalPages <= 7) {
            for (let i = 0; i < totalPages; i++) {
                pages.push(i);
            }

            return pages;
        }

        // Trang đầu
        pages.push(0);

        // Đang ở gần đầu
        if (currentPage <= 3) {
            pages.push(1);
            pages.push(2);
            pages.push(3);
            pages.push(4);
            pages.push("...");
            pages.push(totalPages - 1);

            return pages;
        }

        // Đang ở gần cuối
        if (currentPage >= totalPages - 4) {
            pages.push("...");

            pages.push(totalPages - 5);
            pages.push(totalPages - 4);
            pages.push(totalPages - 3);
            pages.push(totalPages - 2);
            pages.push(totalPages - 1);

            return pages;
        }

        // Đang ở giữa
        pages.push("...");

        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);

        pages.push("...");
        pages.push(totalPages - 1);

        return pages;
    };

    // =========================
    // PAGINATION
    // =========================

    const renderPagination = () => {
        if (totalPages <= 1) {
            return null;
        }

        const pages = getPaginationPages();

        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "6px",
                    marginTop: "20px",
                    marginBottom: "20px",
                }}
            >
                {/* TRANG TRƯỚC */}
                <button
                    disabled={currentPage === 0}
                    onClick={() =>
                        handlePageChange(
                            currentPage - 1
                        )
                    }
                    style={{
                        minWidth: "40px",
                        height: "38px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        background:
                            currentPage === 0
                                ? "#f5f5f5"
                                : "#fff",
                        color:
                            currentPage === 0
                                ? "#aaa"
                                : "#333",
                        cursor:
                            currentPage === 0
                                ? "not-allowed"
                                : "pointer",
                        fontSize: "18px",
                    }}
                >
                    ‹
                </button>

                {/* CÁC TRANG */}
                {pages.map((page, index) => {
                    // Dấu ...
                    if (page === "...") {
                        return (
                            <span
                                key={`dots-${index}`}
                                style={{
                                    minWidth: "30px",
                                    textAlign: "center",
                                    color: "#666",
                                }}
                            >
                                ...
                            </span>
                        );
                    }

                    return (
                        <button
                            key={page}
                            onClick={() =>
                                handlePageChange(
                                    page as number
                                )
                            }
                            style={{
                                minWidth: "40px",
                                height: "38px",
                                padding: "0 10px",
                                border: "1px solid #ddd",
                                borderRadius: "6px",
                                cursor:
                                    currentPage === page
                                        ? "default"
                                        : "pointer",
                                background:
                                    currentPage === page
                                        ? "#007bff"
                                        : "#fff",
                                color:
                                    currentPage === page
                                        ? "#fff"
                                        : "#333",
                                fontWeight:
                                    currentPage === page
                                        ? "bold"
                                        : "normal",
                            }}
                        >
                            {(page as number) + 1}
                        </button>
                    );
                })}

                {/* TRANG SAU */}
                <button
                    disabled={
                        currentPage ===
                        totalPages - 1
                    }
                    onClick={() =>
                        handlePageChange(
                            currentPage + 1
                        )
                    }
                    style={{
                        minWidth: "40px",
                        height: "38px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        background:
                            currentPage ===
                                totalPages - 1
                                ? "#f5f5f5"
                                : "#fff",
                        color:
                            currentPage ===
                                totalPages - 1
                                ? "#aaa"
                                : "#333",
                        cursor:
                            currentPage ===
                                totalPages - 1
                                ? "not-allowed"
                                : "pointer",
                        fontSize: "18px",
                    }}
                >
                    ›
                </button>
            </div>
        );
    };

    // =========================
    // LOADING
    // =========================

    if (loading) {
        return (
            <div>
                <div className="page-header">
                    <h1>Quản lý sản phẩm</h1>
                </div>

                <div className="admin-table-wrapper">
                    <p
                        style={{
                            padding: "30px",
                            textAlign: "center",
                        }}
                    >
                        Đang tải danh sách sản phẩm...
                    </p>
                </div>
            </div>
        );
    }

    // =========================
    // ERROR
    // =========================

    if (error) {
        return (
            <div>
                <div className="page-header">
                    <h1>Quản lý sản phẩm</h1>
                </div>

                <div className="admin-table-wrapper">
                    <div
                        style={{
                            padding: "30px",
                            textAlign: "center",
                            color: "red",
                        }}
                    >
                        <p>{error}</p>

                        <button
                            className="btn-add"
                            onClick={() =>
                                fetchProducts(
                                    currentPage,
                                    pageSize
                                )
                            }
                        >
                            Thử lại
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // =========================
    // GIAO DIỆN
    // =========================

    return (
        <div>
            {/* HEADER */}
            <div className="page-header">
                <h1>Quản lý sản phẩm</h1>

                <button
                    className="btn-add"
                    onClick={() =>
                        navigate(
                            "/admin/products/add"
                        )
                    }
                >
                    + Thêm sản phẩm
                </button>
            </div>

            {/* THÔNG TIN PHÂN TRANG */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "15px",
                }}
            >
                <div>
                    Tổng số sản phẩm:{" "}
                    <strong>{totalElements}</strong>
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                    }}
                >
                    <span>Hiển thị:</span>

                    <select
                        value={pageSize}
                        onChange={
                            handlePageSizeChange
                        }
                        style={{
                            padding: "6px 10px",
                            borderRadius: "5px",
                            border: "1px solid #ddd",
                        }}
                    >
                        <option value={5}>
                            5
                        </option>

                        <option value={10}>
                            10
                        </option>

                        <option value={20}>
                            20
                        </option>

                        <option value={50}>
                            50
                        </option>
                    </select>

                    <span>
                        sản phẩm / trang
                    </span>
                </div>
            </div>

            {/* TABLE */}
            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Hình ảnh</th>
                            <th>Tên sản phẩm</th>
                            <th>Thương hiệu</th>
                            <th>Danh mục</th>
                            <th>Giá</th>
                            <th>Tồn kho</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={9}
                                    style={{
                                        textAlign:
                                            "center",
                                        padding: "30px",
                                    }}
                                >
                                    Chưa có sản phẩm
                                </td>
                            </tr>
                        ) : (
                            products.map(
                                (product) => (
                                    <tr
                                        key={
                                            product.id
                                        }
                                    >
                                        <td>
                                            {
                                                product.id
                                            }
                                        </td>

                                        {/* Hình ảnh */}
                                        <td>
                                            {product.image ? (
                                                <img
                                                    src={
                                                        product.image.startsWith(
                                                            "http"
                                                        )
                                                            ? product.image
                                                            : `http://localhost:8080/${product.image}`
                                                    }
                                                    alt={
                                                        product.name
                                                    }
                                                    style={{
                                                        width: "70px",
                                                        height: "70px",
                                                        objectFit:
                                                            "cover",
                                                        borderRadius:
                                                            "8px",
                                                    }}
                                                    onError={(
                                                        e
                                                    ) => {
                                                        e.currentTarget.style.display =
                                                            "none";
                                                    }}
                                                />
                                            ) : (
                                                <span>
                                                    Không
                                                    có
                                                    ảnh
                                                </span>
                                            )}
                                        </td>

                                        {/* Tên */}
                                        <td>
                                            <strong>
                                                {
                                                    product.name
                                                }
                                            </strong>
                                        </td>

                                        {/* Brand */}
                                        <td>
                                            {
                                                product.brandName
                                            }
                                        </td>

                                        {/* Category */}
                                        <td>
                                            {
                                                product.categoryName
                                            }
                                        </td>

                                        {/* Price */}
                                        <td>
                                            {product.price.toLocaleString(
                                                "vi-VN"
                                            )}{" "}
                                            đ
                                        </td>

                                        {/* Stock */}
                                        <td>
                                            {
                                                product.stock
                                            }
                                        </td>

                                        {/* Status */}
                                        <td>
                                            {product.status ===
                                                0 ? (
                                                <span
                                                    style={{
                                                        color: "green",
                                                    }}
                                                >
                                                    Đang
                                                    bán
                                                </span>
                                            ) : (
                                                <span
                                                    style={{
                                                        color: "red",
                                                    }}
                                                >
                                                    Ngừng
                                                    bán
                                                </span>
                                            )}
                                        </td>

                                        {/* Actions */}
                                        <td>
                                            <button
                                                className="btn-edit"
                                                onClick={() =>
                                                    navigate(
                                                        `/admin/products/${product.id}/edit`
                                                    )
                                                }
                                            >
                                                Sửa
                                            </button>

                                            <button
                                                className="btn-delete"
                                                onClick={() =>
                                                    handleDelete(
                                                        product.id
                                                    )
                                                }
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                )
                            )
                        )}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
            {renderPagination()}
        </div>
    );
}