import { useEffect, useState, useMemo } from "react";

// ===================== TYPES =====================

interface Brand {
    id: number;
    name: string;
    description: string;
}

interface PageData {
    content: Brand[];
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

export default function BrandList() {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [page, setPage] = useState(0); // 0-based
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // Modal thêm / sửa
    const [showModal, setShowModal] = useState(false);
    const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });
    const [saving, setSaving] = useState(false);

    // ========================
    // LẤY DANH SÁCH THƯƠNG HIỆU
    // ========================
    const fetchBrands = async (pageNum = 0, size = pageSize) => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `http://localhost:8080/api/v1/brands?page=${pageNum}&size=${size}&sort=id,desc`,
                { headers: getAuthHeaders() }
            );

            if (!response.ok) {
                const errJson = await response.json().catch(() => null);
                throw new Error(
                    errJson?.message || `Lỗi tải thương hiệu. HTTP ${response.status}`
                );
            }

            const result: ApiResponse = await response.json();

            setBrands(result.data.content || []);
            const currentP =
                result.data.page_no > 0 ? result.data.page_no - 1 : 0;
            setPage(currentP);
            setTotalPages(result.data.total_pages);
            setTotalElements(result.data.total_elements);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Không thể tải danh sách thương hiệu"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBrands(0, pageSize);
    }, [pageSize]);

    // Lọc theo search term
    const filteredBrands = useMemo(() => {
        if (!searchTerm.trim()) return brands;
        const lower = searchTerm.toLowerCase();
        return brands.filter(
            (b) =>
                b.name.toLowerCase().includes(lower) ||
                (b.description && b.description.toLowerCase().includes(lower))
        );
    }, [brands, searchTerm]);

    // ========================
    // THAO TÁC MODAL
    // ========================
    const handleOpenAdd = () => {
        setEditingBrand(null);
        setFormData({
            name: "",
            description: "",
        });
        setShowModal(true);
    };

    const handleOpenEdit = (brand: Brand) => {
        setEditingBrand(brand);
        setFormData({
            name: brand.name || "",
            description: brand.description || "",
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingBrand(null);
    };

    // ========================
    // LƯU (THÊM / CẬP NHẬT)
    // ========================
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            alert("Vui lòng nhập tên thương hiệu!");
            return;
        }

        try {
            setSaving(true);
            const isEdit = Boolean(editingBrand);
            const url = isEdit
                ? `http://localhost:8080/api/v1/brands/${editingBrand!.id}`
                : `http://localhost:8080/api/v1/brands`;
            const method = isEdit ? "PUT" : "POST";

            const payload = {
                name: formData.name.trim(),
                description: formData.description.trim(),
            };

            const res = await fetch(url, {
                method,
                headers: getAuthHeaders(),
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errJson = await res.json().catch(() => null);
                throw new Error(
                    errJson?.message || `Lỗi khi lưu thương hiệu (HTTP ${res.status})`
                );
            }

            alert(isEdit ? "Cập nhật thương hiệu thành công!" : "Thêm thương hiệu mới thành công!");
            handleCloseModal();
            fetchBrands(page, pageSize);
        } catch (err) {
            alert(err instanceof Error ? err.message : "Đã xảy ra lỗi khi lưu");
        } finally {
            setSaving(false);
        }
    };

    // ========================
    // XÓA THƯƠNG HIỆU
    // ========================
    const handleDelete = async (id: number, name: string) => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa thương hiệu "${name}"?`)) {
            return;
        }

        try {
            const res = await fetch(`http://localhost:8080/api/v1/brands/${id}`, {
                method: "DELETE",
                headers: getAuthHeaders(),
            });

            if (!res.ok) {
                const errJson = await res.json().catch(() => null);
                throw new Error(
                    errJson?.message || `Lỗi khi xóa thương hiệu (HTTP ${res.status})`
                );
            }

            alert("Xóa thương hiệu thành công!");
            fetchBrands(page, pageSize);
        } catch (err) {
            alert(err instanceof Error ? err.message : "Không thể xóa thương hiệu");
        }
    };

    return (
        <div style={{ padding: "24px" }}>
            {/* TIÊU ĐỀ & NÚT THÊM */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "24px",
                }}
            >
                <div>
                    <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
                        Quản lý thương hiệu
                    </h1>
                    <p style={{ color: "#666", marginTop: "4px", margin: 0 }}>
                        Tổng cộng {totalElements} thương hiệu trong hệ thống
                    </p>
                </div>

                <button
                    onClick={handleOpenAdd}
                    style={{
                        backgroundColor: "#2563eb",
                        color: "#fff",
                        padding: "10px 18px",
                        borderRadius: "6px",
                        border: "none",
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                    }}
                >
                    + Thêm thương hiệu
                </button>
            </div>

            {/* BỘ LỌC TÌM KIẾM */}
            <div
                style={{
                    backgroundColor: "#fff",
                    padding: "16px",
                    borderRadius: "8px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    marginBottom: "20px",
                    display: "flex",
                    gap: "16px",
                    alignItems: "center",
                }}
            >
                <input
                    type="text"
                    placeholder="Tìm theo tên hoặc mô tả thương hiệu..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        flex: 1,
                        padding: "10px 14px",
                        borderRadius: "6px",
                        border: "1px solid #d1d5db",
                        outline: "none",
                    }}
                />
                <button
                    onClick={() => fetchBrands(page, pageSize)}
                    style={{
                        padding: "10px 16px",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        background: "#f9fafb",
                        cursor: "pointer",
                    }}
                >
                    Làm mới
                </button>
            </div>

            {/* HIỂN THỊ LỖI */}
            {error && (
                <div
                    style={{
                        padding: "12px 16px",
                        backgroundColor: "#fee2e2",
                        color: "#dc2626",
                        borderRadius: "6px",
                        marginBottom: "16px",
                    }}
                >
                    {error}
                </div>
            )}

            {/* BẢNG DỮ LIỆU */}
            <div
                style={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    overflowX: "auto",
                }}
            >
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                        <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                            <th style={{ padding: "14px 16px", fontWeight: 600, color: "#475569", width: "80px" }}>
                                ID
                            </th>
                            <th style={{ padding: "14px 16px", fontWeight: 600, color: "#475569" }}>
                                Tên thương hiệu
                            </th>
                            <th style={{ padding: "14px 16px", fontWeight: 600, color: "#475569" }}>
                                Mô tả
                            </th>
                            <th style={{ padding: "14px 16px", fontWeight: 600, color: "#475569", width: "160px", textAlign: "center" }}>
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={4} style={{ padding: "32px", textAlign: "center", color: "#64748b" }}>
                                    Đang tải dữ liệu...
                                </td>
                            </tr>
                        ) : filteredBrands.length === 0 ? (
                            <tr>
                                <td colSpan={4} style={{ padding: "32px", textAlign: "center", color: "#64748b" }}>
                                    Không có thương hiệu nào
                                </td>
                            </tr>
                        ) : (
                            filteredBrands.map((brand) => (
                                <tr
                                    key={brand.id}
                                    style={{
                                        borderBottom: "1px solid #f1f5f9",
                                        transition: "background 0.2s",
                                    }}
                                >
                                    <td style={{ padding: "14px 16px", color: "#64748b" }}>
                                        #{brand.id}
                                    </td>
                                    <td style={{ padding: "14px 16px", fontWeight: 600, color: "#1e293b" }}>
                                        {brand.name}
                                    </td>
                                    <td style={{ padding: "14px 16px", color: "#475569" }}>
                                        {brand.description || <span style={{ color: "#94a3b8" }}>(Không có mô tả)</span>}
                                    </td>
                                    <td style={{ padding: "14px 16px", textAlign: "center" }}>
                                        <button
                                            onClick={() => handleOpenEdit(brand)}
                                            style={{
                                                padding: "6px 12px",
                                                marginRight: "8px",
                                                backgroundColor: "#fef3c7",
                                                color: "#b45309",
                                                border: "none",
                                                borderRadius: "4px",
                                                cursor: "pointer",
                                                fontWeight: 500,
                                            }}
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            onClick={() => handleDelete(brand.id, brand.name)}
                                            style={{
                                                padding: "6px 12px",
                                                backgroundColor: "#fee2e2",
                                                color: "#dc2626",
                                                border: "none",
                                                borderRadius: "4px",
                                                cursor: "pointer",
                                                fontWeight: 500,
                                            }}
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

            {/* PHÂN TRANG */}
            {totalPages > 1 && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "16px",
                    }}
                >
                    <div style={{ color: "#64748b", fontSize: "14px" }}>
                        Trang {page + 1} / {totalPages}
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                        <button
                            disabled={page === 0}
                            onClick={() => fetchBrands(page - 1, pageSize)}
                            style={{
                                padding: "8px 14px",
                                border: "1px solid #d1d5db",
                                borderRadius: "6px",
                                background: page === 0 ? "#f3f4f6" : "#fff",
                                cursor: page === 0 ? "not-allowed" : "pointer",
                            }}
                        >
                            &laquo; Trước
                        </button>
                        <button
                            disabled={page >= totalPages - 1}
                            onClick={() => fetchBrands(page + 1, pageSize)}
                            style={{
                                padding: "8px 14px",
                                border: "1px solid #d1d5db",
                                borderRadius: "6px",
                                background: page >= totalPages - 1 ? "#f3f4f6" : "#fff",
                                cursor: page >= totalPages - 1 ? "not-allowed" : "pointer",
                            }}
                        >
                            Sau &raquo;
                        </button>
                    </div>
                </div>
            )}

            {/* MODAL THÊM / SỬA THƯƠNG HIỆU */}
            {showModal && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "#fff",
                            borderRadius: "8px",
                            width: "100%",
                            maxWidth: "480px",
                            padding: "24px",
                            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                        }}
                    >
                        <h2 style={{ margin: "0 0 16px 0", fontSize: "20px" }}>
                            {editingBrand ? "Chỉnh sửa thương hiệu" : "Thêm thương hiệu mới"}
                        </h2>

                        <form onSubmit={handleSave}>
                            <div style={{ marginBottom: "16px" }}>
                                <label style={{ display: "block", marginBottom: "6px", fontWeight: 500 }}>
                                    Tên thương hiệu <span style={{ color: "red" }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    placeholder="Nhập tên thương hiệu (VD: Nike, Adidas...)"
                                    style={{
                                        width: "100%",
                                        padding: "10px",
                                        borderRadius: "6px",
                                        border: "1px solid #d1d5db",
                                        boxSizing: "border-box",
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: "20px" }}>
                                <label style={{ display: "block", marginBottom: "6px", fontWeight: 500 }}>
                                    Mô tả
                                </label>
                                <textarea
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    placeholder="Mô tả về thương hiệu..."
                                    style={{
                                        width: "100%",
                                        padding: "10px",
                                        borderRadius: "6px",
                                        border: "1px solid #d1d5db",
                                        boxSizing: "border-box",
                                    }}
                                />
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    gap: "12px",
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    disabled={saving}
                                    style={{
                                        padding: "10px 18px",
                                        border: "1px solid #d1d5db",
                                        borderRadius: "6px",
                                        background: "#fff",
                                        cursor: "pointer",
                                    }}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    style={{
                                        padding: "10px 20px",
                                        borderRadius: "6px",
                                        border: "none",
                                        background: "#2563eb",
                                        color: "#fff",
                                        fontWeight: 600,
                                        cursor: saving ? "not-allowed" : "pointer",
                                    }}
                                >
                                    {saving ? "Đang lưu..." : "Lưu"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
