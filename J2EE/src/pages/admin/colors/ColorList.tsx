import { useEffect, useState } from "react";

// ===================== TYPES =====================

interface Color {
    id: number;
    name: string;
    code: string;   // backend field là "code", không phải "hexCode"
}

interface PageData {
    content: Color[];
    page_no: number;        // 0-based
    page_size: number;
    total_elements: number;
    total_pages: number;
    is_last: boolean;
}

// ColorController: GET /colors → ApiResponse<PageResponse<ColorResponse>>
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

export default function ColorList() {
    const [colors, setColors] = useState<Color[]>([]);
    const [page, setPage] = useState(0);                 // 0-based
    const [pageSize] = useState(20);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Modal thêm / sửa
    const [showModal, setShowModal] = useState(false);
    const [editingColor, setEditingColor] = useState<Color | null>(null);
    const [formName, setFormName] = useState("");
    const [formCode, setFormCode] = useState("#000000");
    const [saving, setSaving] = useState(false);

    // ========================
    // LẤY DANH SÁCH MÀU
    // ApiResponse<PageResponse<ColorResponse>>
    // ========================
    const fetchColors = async (pageNum = 0) => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `http://localhost:8080/api/v1/colors?page=${pageNum}&size=${pageSize}`,
                { headers: getAuthHeaders() }
            );

            const result: ApiResponse = await response.json();

            if (!response.ok) {
                throw new Error(result.message || `HTTP ${response.status}`);
            }

            setColors(result.data.content || []);
            setPage(result.data.page_no);          // 0-based
            setTotalPages(result.data.total_pages);
            setTotalElements(result.data.total_elements);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Không thể tải danh sách màu"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchColors(0);
    }, []);

    // ========================
    // MỞ MODAL THÊM MỚI
    // ========================
    const handleOpenAdd = () => {
        setEditingColor(null);
        setFormName("");
        setFormCode("#000000");
        setShowModal(true);
    };

    // ========================
    // MỞ MODAL SỬA
    // ========================
    const handleOpenEdit = (color: Color) => {
        setEditingColor(color);
        setFormName(color.name);
        setFormCode(color.code || "#000000");
        setShowModal(true);
    };

    // ========================
    // LƯU (THÊM / SỬA)
    // Request body: { name, code }   ← backend dùng "code"
    // ========================
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formName.trim()) {
            alert("Vui lòng nhập tên màu");
            return;
        }
        try {
            setSaving(true);

            const isEdit = !!editingColor;
            const url = isEdit
                ? `http://localhost:8080/api/v1/colors/${editingColor!.id}`
                : `http://localhost:8080/api/v1/colors`;

            const response = await fetch(url, {
                method: isEdit ? "PUT" : "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify({ name: formName.trim(), code: formCode }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Lưu thất bại");
            }

            alert(isEdit ? "Cập nhật màu thành công!" : "Thêm màu thành công!");
            setShowModal(false);
            fetchColors(page);
        } catch (err) {
            alert(err instanceof Error ? err.message : "Có lỗi xảy ra");
        } finally {
            setSaving(false);
        }
    };

    // ========================
    // XÓA MÀU
    // ========================
    const handleDelete = async (color: Color) => {
        if (!window.confirm(`Bạn có chắc muốn xóa màu "${color.name}"?`)) return;

        try {
            const response = await fetch(
                `http://localhost:8080/api/v1/colors/${color.id}`,
                { method: "DELETE", headers: getAuthHeaders() }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Xóa thất bại");
            }

            alert("Xóa màu thành công!");

            if (colors.length === 1 && page > 0) {
                fetchColors(page - 1);
            } else {
                fetchColors(page);
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
        fetchColors(newPage);
    };

    // ========================
    // LOADING / ERROR
    // ========================
    if (loading) {
        return (
            <div>
                <div className="page-header"><h1>Quản lý màu sắc</h1></div>
                <div className="admin-table-wrapper">
                    <p style={{ padding: "30px", textAlign: "center" }}>Đang tải danh sách màu...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <div className="page-header"><h1>Quản lý màu sắc</h1></div>
                <div className="admin-table-wrapper">
                    <p style={{ padding: "30px", textAlign: "center", color: "red" }}>{error}</p>
                    <div style={{ textAlign: "center", paddingBottom: "20px" }}>
                        <button className="btn-add" onClick={() => fetchColors(page)}>Thử lại</button>
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
                    <h1>Quản lý màu sắc</h1>
                    <p style={{ margin: "4px 0 0", color: "#6b7280" }}>
                        Tổng số: <strong>{totalElements}</strong> màu
                    </p>
                </div>
                <button className="btn-add" onClick={handleOpenAdd}>
                    + Thêm màu
                </button>
            </div>

            {/* TABLE */}
            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên màu</th>
                            <th>Màu xem trước</th>
                            <th>Mã màu</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {colors.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ textAlign: "center", padding: "30px" }}>
                                    Chưa có màu nào
                                </td>
                            </tr>
                        ) : (
                            colors.map((color) => (
                                <tr key={color.id}>
                                    <td>{color.id}</td>
                                    <td><strong>{color.name}</strong></td>
                                    <td>
                                        {color.code ? (
                                            <span
                                                style={{
                                                    display: "inline-block",
                                                    width: "32px",
                                                    height: "32px",
                                                    borderRadius: "6px",
                                                    background: color.code,
                                                    border: "1px solid #e5e7eb",
                                                    verticalAlign: "middle",
                                                }}
                                                title={color.code}
                                            />
                                        ) : (
                                            <span style={{ color: "#aaa" }}>—</span>
                                        )}
                                    </td>
                                    <td>
                                        <code style={{ fontSize: "13px", color: "#374151" }}>
                                            {color.code || "—"}
                                        </code>
                                    </td>
                                    <td style={{ whiteSpace: "nowrap" }}>
                                        <button
                                            className="btn-edit"
                                            style={{ marginRight: "6px" }}
                                            onClick={() => handleOpenEdit(color)}
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            className="btn-delete"
                                            onClick={() => handleDelete(color)}
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
                    <div className="admin-modal" style={{ maxWidth: "420px" }}>
                        <div className="admin-modal-header">
                            <h2>{editingColor ? "Sửa màu" : "Thêm màu mới"}</h2>
                            <button onClick={() => setShowModal(false)}>×</button>
                        </div>

                        <form className="admin-form" onSubmit={handleSave}>
                            <div className="form-group">
                                <label>Tên màu *</label>
                                <input
                                    type="text"
                                    value={formName}
                                    onChange={(e) => setFormName(e.target.value)}
                                    placeholder="VD: Đỏ, Xanh navy, Trắng..."
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Mã màu (code) *</label>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <input
                                        type="color"
                                        value={/^#[0-9A-Fa-f]{6}$/.test(formCode) ? formCode : "#000000"}
                                        onChange={(e) => setFormCode(e.target.value)}
                                        style={{
                                            width: "48px",
                                            height: "40px",
                                            border: "1px solid #d1d5db",
                                            borderRadius: "7px",
                                            padding: "2px",
                                            cursor: "pointer",
                                            flexShrink: 0,
                                        }}
                                    />
                                    <input
                                        type="text"
                                        value={formCode}
                                        onChange={(e) => setFormCode(e.target.value)}
                                        placeholder="#000000"
                                        required
                                        style={{ flex: 1 }}
                                    />
                                </div>
                                <small style={{ color: "#6b7280" }}>
                                    Nhập mã hex VD: #FF5733 hoặc tên màu CSS VD: red
                                </small>
                            </div>

                            <div className="admin-modal-footer">
                                <button type="button" className="btn-view" onClick={() => setShowModal(false)}>
                                    Hủy
                                </button>
                                <button type="submit" className="btn-edit" disabled={saving}>
                                    {saving ? "Đang lưu..." : editingColor ? "Lưu thay đổi" : "Thêm màu"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
