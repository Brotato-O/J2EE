import { useEffect, useState } from "react";

// ===================== TYPES =====================

interface Size {
    id: number;
    name: string;
}

interface PageData {
    content: Size[];
    page_no: number;        // 0-based
    page_size: number;
    total_elements: number;
    total_pages: number;
    is_last: boolean;
}

// SizeController: GET /sizes → ApiResponse<PageResponse<SizeResponse>>
interface ApiResponse {
    code: number;
    message: string;
    data: PageData;
}

// ===================== HELPERS =====================

const getAuthHeaders = () => {
    const token = localStorage.getItem("adminToken");
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

// ===================== COMPONENT =====================

export default function SizeList() {
    const [sizes, setSizes] = useState<Size[]>([]);
    const [page, setPage] = useState(0);                 // 0-based
    const [pageSize] = useState(20);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Modal thêm / sửa
    const [showModal, setShowModal] = useState(false);
    const [editingSize, setEditingSize] = useState<Size | null>(null);
    const [formName, setFormName] = useState("");
    const [saving, setSaving] = useState(false);

    // ========================
    // LẤY DANH SÁCH SIZE
    // ApiResponse<PageResponse<SizeResponse>>
    // ========================
    const fetchSizes = async (pageNum = 0) => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `http://localhost:8080/api/v1/sizes?page=${pageNum}&size=${pageSize}`,
                { headers: getAuthHeaders() }
            );

            const result: ApiResponse = await response.json();

            if (!response.ok) {
                throw new Error(result.message || `HTTP ${response.status}`);
            }

            setSizes(result.data.content || []);
            setPage(result.data.page_no);          // 0-based
            setTotalPages(result.data.total_pages);
            setTotalElements(result.data.total_elements);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Không thể tải danh sách kích thước"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSizes(0);
    }, []);

    // ========================
    // MỞ MODAL THÊM MỚI
    // ========================
    const handleOpenAdd = () => {
        setEditingSize(null);
        setFormName("");
        setShowModal(true);
    };

    // ========================
    // MỞ MODAL SỬA
    // ========================
    const handleOpenEdit = (size: Size) => {
        setEditingSize(size);
        setFormName(size.name);
        setShowModal(true);
    };

    // ========================
    // LƯU (THÊM / SỬA)
    // Request body: { name }
    // ========================
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formName.trim()) {
            alert("Vui lòng nhập tên kích thước");
            return;
        }
        try {
            setSaving(true);

            const isEdit = !!editingSize;
            const url = isEdit
                ? `http://localhost:8080/api/v1/sizes/${editingSize!.id}`
                : `http://localhost:8080/api/v1/sizes`;

            const response = await fetch(url, {
                method: isEdit ? "PUT" : "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify({ name: formName.trim() }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Lưu thất bại");
            }

            alert(isEdit ? "Cập nhật kích thước thành công!" : "Thêm kích thước thành công!");
            setShowModal(false);
            fetchSizes(page);
        } catch (err) {
            alert(err instanceof Error ? err.message : "Có lỗi xảy ra");
        } finally {
            setSaving(false);
        }
    };

    // ========================
    // XÓA SIZE
    // ========================
    const handleDelete = async (size: Size) => {
        if (!window.confirm(`Bạn có chắc muốn xóa kích thước "${size.name}"?`)) return;

        try {
            const response = await fetch(
                `http://localhost:8080/api/v1/sizes/${size.id}`,
                { method: "DELETE", headers: getAuthHeaders() }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Xóa thất bại");
            }

            alert("Xóa kích thước thành công!");

            if (sizes.length === 1 && page > 0) {
                fetchSizes(page - 1);
            } else {
                fetchSizes(page);
            }
        } catch (err) {
            alert(err instanceof Error ? err.message : "Có lỗi xảy ra khi xóa");
        }
    };

    // ========================
    // PHÂN TRANG
    // ========================
    const handlePageChange = (newPage: number) => {
        if (newPage < 0 || newPage >= totalPages) return;
        fetchSizes(newPage);
    };

    // ========================
    // LOADING / ERROR
    // ========================
    if (loading) {
        return (
            <div>
                <div className="page-header"><h1>Quản lý kích thước</h1></div>
                <div className="admin-table-wrapper">
                    <p style={{ padding: "30px", textAlign: "center" }}>Đang tải danh sách kích thước...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <div className="page-header"><h1>Quản lý kích thước</h1></div>
                <div className="admin-table-wrapper">
                    <p style={{ padding: "30px", textAlign: "center", color: "red" }}>{error}</p>
                    <div style={{ textAlign: "center", paddingBottom: "20px" }}>
                        <button className="btn-add" onClick={() => fetchSizes(page)}>Thử lại</button>
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
                    <h1>Quản lý kích thước</h1>
                    <p style={{ margin: "4px 0 0", color: "#6b7280" }}>
                        Tổng số: <strong>{totalElements}</strong> kích thước
                    </p>
                </div>
                <button className="btn-add" onClick={handleOpenAdd}>
                    + Thêm kích thước
                </button>
            </div>

            {/* TABLE */}
            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên kích thước</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sizes.length === 0 ? (
                            <tr>
                                <td colSpan={3} style={{ textAlign: "center", padding: "30px" }}>
                                    Chưa có kích thước nào
                                </td>
                            </tr>
                        ) : (
                            sizes.map((size) => (
                                <tr key={size.id}>
                                    <td>{size.id}</td>
                                    <td>
                                        <span
                                            style={{
                                                display: "inline-block",
                                                padding: "4px 14px",
                                                borderRadius: "6px",
                                                background: "#f3f4f6",
                                                fontWeight: 600,
                                                fontSize: "14px",
                                                color: "#374151",
                                            }}
                                        >
                                            {size.name}
                                        </span>
                                    </td>
                                    <td style={{ whiteSpace: "nowrap" }}>
                                        <button
                                            className="btn-edit"
                                            style={{ marginRight: "6px" }}
                                            onClick={() => handleOpenEdit(size)}
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            className="btn-delete"
                                            onClick={() => handleDelete(size)}
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
                    <button disabled={page === 0} onClick={() => handlePageChange(page - 1)}>
                        ← Trước
                    </button>
                    <span>
                        Trang <strong>{page + 1}</strong> / <strong>{totalPages}</strong>
                    </span>
                    <button disabled={page >= totalPages - 1} onClick={() => handlePageChange(page + 1)}>
                        Sau →
                    </button>
                </div>
            )}

            {/* ===== MODAL THÊM / SỬA ===== */}
            {showModal && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal" style={{ maxWidth: "380px" }}>
                        <div className="admin-modal-header">
                            <h2>{editingSize ? "Sửa kích thước" : "Thêm kích thước mới"}</h2>
                            <button onClick={() => setShowModal(false)}>×</button>
                        </div>

                        <form className="admin-form" onSubmit={handleSave}>
                            <div className="form-group">
                                <label>Tên kích thước *</label>
                                <input
                                    type="text"
                                    value={formName}
                                    onChange={(e) => setFormName(e.target.value)}
                                    placeholder="VD: S, M, L, XL, 38, 39..."
                                    required
                                />
                            </div>

                            <div className="admin-modal-footer">
                                <button type="button" className="btn-view" onClick={() => setShowModal(false)}>
                                    Hủy
                                </button>
                                <button type="submit" className="btn-edit" disabled={saving}>
                                    {saving
                                        ? "Đang lưu..."
                                        : editingSize
                                        ? "Lưu thay đổi"
                                        : "Thêm kích thước"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
