import { useEffect, useState, useMemo } from "react";

// ===================== TYPES =====================

interface Category {
    id: number;
    name: string;
    status: number;
}

interface PageData {
    content: Category[];
    page_no: number;
    page_size: number;
    total_elements: number;
    total_pages: number;
    is_last: boolean;
}

interface ApiResponse {
    code: number;
    message: string;
    data: PageData;
}

// ===================== HELPERS =====================

const getAuthHeaders = () => {
    const token = localStorage.getItem("adminToken");
    const tokenType = localStorage.getItem("adminTokenType") || "Bearer";
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `${tokenType} ${token}` } : {}),
    };
};

// ===================== COMPONENT =====================

export default function CategoryList() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [page, setPage] = useState(0); // 0-based
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // Modal thêm / sửa
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formName, setFormName] = useState("");
    const [saving, setSaving] = useState(false);

    // ========================
    // LẤY DANH SÁCH DANH MỤC
    // ========================
    const fetchCategories = async (pageNum = 0, size = pageSize) => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `http://localhost:8080/api/v1/categories?page=${pageNum}&size=${size}`,
                { headers: getAuthHeaders() }
            );

            if (!response.ok) {
                const errJson = await response.json().catch(() => null);
                throw new Error(
                    errJson?.message || `Lỗi tải danh mục. HTTP ${response.status}`
                );
            }

            const result: ApiResponse = await response.json();

            setCategories(result.data.content || []);
            // Backend trả page_no = 1-based (page.getNumber() + 1)
            const currentP =
                result.data.page_no > 0 ? result.data.page_no - 1 : 0;
            setPage(currentP);
            setTotalPages(result.data.total_pages);
            setTotalElements(result.data.total_elements);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Không thể tải danh sách danh mục"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories(0, pageSize);
    }, [pageSize]);

    // Lọc theo từ khóa tìm kiếm trên trang hiện tại
    const filteredCategories = useMemo(() => {
        if (!searchTerm.trim()) return categories;
        const lower = searchTerm.toLowerCase();
        return categories.filter(
            (c) =>
                c.name.toLowerCase().includes(lower) ||
                String(c.id).includes(lower)
        );
    }, [categories, searchTerm]);

    // ========================
    // MỞ MODAL THÊM MỚI
    // ========================
    const handleOpenAdd = () => {
        setEditingCategory(null);
        setFormName("");
        setShowModal(true);
    };

    // ========================
    // MỞ MODAL SỬA
    // ========================
    const handleOpenEdit = (category: Category) => {
        setEditingCategory(category);
        setFormName(category.name);
        setShowModal(true);
    };

    // ========================
    // LƯU (THÊM / SỬA)
    // ========================
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = formName.trim();
        if (!trimmed) {
            alert("Vui lòng nhập tên danh mục!");
            return;
        }

        try {
            setSaving(true);
            const isEdit = !!editingCategory;
            const url = isEdit
                ? `http://localhost:8080/api/v1/categories/${editingCategory!.id}`
                : `http://localhost:8080/api/v1/categories`;

            const response = await fetch(url, {
                method: isEdit ? "PUT" : "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify({ name: trimmed }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Lưu danh mục thất bại");
            }

            alert(
                isEdit
                    ? "Cập nhật danh mục thành công!"
                    : "Thêm danh mục thành công!"
            );
            setShowModal(false);
            fetchCategories(page, pageSize);
        } catch (err) {
            alert(
                err instanceof Error
                    ? err.message
                    : "Có lỗi xảy ra khi lưu danh mục"
            );
        } finally {
            setSaving(false);
        }
    };

    // ========================
    // XÓA DANH MỤC
    // ========================
    const handleDelete = async (category: Category) => {
        const confirmed = window.confirm(
            `Bạn có chắc chắn muốn xóa danh mục "${category.name}" (ID: ${category.id})?`
        );
        if (!confirmed) return;

        try {
            const response = await fetch(
                `http://localhost:8080/api/v1/categories/${category.id}`,
                {
                    method: "DELETE",
                    headers: getAuthHeaders(),
                }
            );

            if (!response.ok) {
                const errJson = await response.json().catch(() => null);
                throw new Error(
                    errJson?.message || `Xóa danh mục thất bại. HTTP ${response.status}`
                );
            }

            alert("Xóa danh mục thành công!");

            // Nếu trang hiện tại chỉ còn 1 mục và đang ở trang > 0 thì lùi 1 trang
            if (categories.length === 1 && page > 0) {
                fetchCategories(page - 1, pageSize);
            } else {
                fetchCategories(page, pageSize);
            }
        } catch (err) {
            alert(
                err instanceof Error
                    ? err.message
                    : "Có lỗi xảy ra khi xóa danh mục"
            );
        }
    };

    // ========================
    // PHÂN TRANG
    // ========================
    const handlePageChange = (newPage: number) => {
        if (newPage < 0 || newPage >= totalPages || newPage === page) return;
        fetchCategories(newPage, pageSize);
    };

    // ========================
    // LOADING / ERROR
    // ========================
    if (loading && categories.length === 0) {
        return (
            <div>
                <div className="page-header">
                    <h1>Quản lý danh mục</h1>
                </div>
                <div className="admin-table-wrapper">
                    <p style={{ padding: "30px", textAlign: "center" }}>
                        Đang tải danh sách danh mục...
                    </p>
                </div>
            </div>
        );
    }

    if (error && categories.length === 0) {
        return (
            <div>
                <div className="page-header">
                    <h1>Quản lý danh mục</h1>
                </div>
                <div className="admin-table-wrapper">
                    <p
                        style={{
                            padding: "30px",
                            textAlign: "center",
                            color: "red",
                        }}
                    >
                        {error}
                    </p>
                    <div
                        style={{ textAlign: "center", paddingBottom: "20px" }}
                    >
                        <button
                            className="btn-add"
                            onClick={() => fetchCategories(0, pageSize)}
                        >
                            Thử lại
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ========================
    // RENDER
    // ========================
    return (
        <div>
            {/* HEADER */}
            <div className="page-header">
                <div>
                    <h1>Quản lý danh mục</h1>
                    <p style={{ margin: "4px 0 0", color: "#6b7280" }}>
                        Tổng số: <strong>{totalElements}</strong> danh mục
                    </p>
                </div>
                <button className="btn-add" onClick={handleOpenAdd}>
                    + Thêm danh mục
                </button>
            </div>

            {/* THANH TÌM KIẾM & CHỌN SIZE */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "12px",
                    marginBottom: "16px",
                }}
            >
                {/* Tìm kiếm */}
                <div style={{ flex: "1", minWidth: "240px", maxWidth: "360px" }}>
                    <input
                        type="text"
                        placeholder="🔍 Tìm kiếm danh mục theo tên hoặc ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "9px 14px",
                            borderRadius: "7px",
                            border: "1px solid #d1d5db",
                            fontSize: "14px",
                            outline: "none",
                        }}
                    />
                </div>

                {/* Chọn số dòng mỗi trang */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "14px",
                        color: "#4b5563",
                    }}
                >
                    <span>Hiển thị:</span>
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                        }}
                        style={{
                            padding: "6px 10px",
                            borderRadius: "6px",
                            border: "1px solid #d1d5db",
                            fontSize: "14px",
                        }}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                    <span>danh mục / trang</span>
                </div>
            </div>

            {/* TABLE */}
            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th style={{ width: "90px" }}>ID</th>
                            <th>Tên danh mục</th>
                            <th style={{ width: "180px" }}>Trạng thái</th>
                            <th style={{ width: "160px", textAlign: "right" }}>
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCategories.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={4}
                                    style={{
                                        textAlign: "center",
                                        padding: "36px",
                                        color: "#6b7280",
                                    }}
                                >
                                    {searchTerm
                                        ? "Không tìm thấy danh mục phù hợp"
                                        : "Chưa có danh mục nào"}
                                </td>
                            </tr>
                        ) : (
                            filteredCategories.map((cate) => (
                                <tr key={cate.id}>
                                    <td>
                                        <strong>#{cate.id}</strong>
                                    </td>
                                    <td>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "10px",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    width: "32px",
                                                    height: "32px",
                                                    borderRadius: "6px",
                                                    background: "#eff6ff",
                                                    color: "#2563eb",
                                                    fontWeight: 600,
                                                    fontSize: "14px",
                                                }}
                                            >
                                                📁
                                            </span>
                                            <strong
                                                style={{
                                                    fontSize: "15px",
                                                    color: "#111827",
                                                }}
                                            >
                                                {cate.name}
                                            </strong>
                                        </div>
                                    </td>
                                    <td>
                                        <span
                                            style={{
                                                display: "inline-block",
                                                padding: "4px 12px",
                                                borderRadius: "999px",
                                                fontSize: "12px",
                                                fontWeight: 600,
                                                background:
                                                    cate.status === 0
                                                        ? "#dcfce7"
                                                        : "#fee2e2",
                                                color:
                                                    cate.status === 0
                                                        ? "#15803d"
                                                        : "#dc2626",
                                            }}
                                        >
                                            {cate.status === 0
                                                ? "Hoạt động"
                                                : "Đã ẩn"}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                                        <button
                                            className="btn-edit"
                                            style={{ marginRight: "6px" }}
                                            onClick={() => handleOpenEdit(cate)}
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            className="btn-delete"
                                            onClick={() => handleDelete(cate)}
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
                <div className="admin-pagination">
                    <button
                        disabled={page === 0}
                        onClick={() => handlePageChange(page - 1)}
                    >
                        ← Trước
                    </button>
                    <span>
                        Trang <strong>{page + 1}</strong> /{" "}
                        <strong>{totalPages}</strong>
                    </span>
                    <button
                        disabled={page >= totalPages - 1}
                        onClick={() => handlePageChange(page + 1)}
                    >
                        Sau →
                    </button>
                </div>
            )}

            {/* ===== MODAL THÊM / SỬA DANH MỤC ===== */}
            {showModal && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal" style={{ maxWidth: "440px" }}>
                        <div className="admin-modal-header">
                            <h2>
                                {editingCategory
                                    ? "Chỉnh sửa danh mục"
                                    : "Thêm danh mục mới"}
                            </h2>
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                            >
                                ×
                            </button>
                        </div>

                        <form className="admin-form" onSubmit={handleSave}>
                            <div className="form-group">
                                <label>Tên danh mục *</label>
                                <input
                                    type="text"
                                    value={formName}
                                    onChange={(e) => setFormName(e.target.value)}
                                    placeholder="VD: Giày thể thao, Áo thun, Phụ kiện..."
                                    maxLength={55}
                                    required
                                    autoFocus
                                />
                                <small style={{ color: "#6b7280" }}>
                                    Tối đa 55 ký tự. Tên danh mục dùng để phân loại sản phẩm.
                                </small>
                            </div>

                            <div className="admin-modal-footer">
                                <button
                                    type="button"
                                    className="btn-view"
                                    onClick={() => setShowModal(false)}
                                    disabled={saving}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="btn-edit"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Đang lưu..."
                                        : editingCategory
                                        ? "Lưu thay đổi"
                                        : "Tạo danh mục"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
