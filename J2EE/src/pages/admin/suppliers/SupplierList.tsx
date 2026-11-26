import { useEffect, useState, useMemo } from "react";

// ===================== TYPES =====================

interface Supplier {
    id: number;
    name: string;
    address: string;
    phone: string;
    email: string;
    status: number;
}

interface PageData {
    content: Supplier[];
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

export default function SupplierList() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [page, setPage] = useState(0); // 0-based
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // Modal thêm / sửa
    const [showModal, setShowModal] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
    });
    const [saving, setSaving] = useState(false);

    // ========================
    // LẤY DANH SÁCH NHÀ CUNG CẤP
    // ========================
    const fetchSuppliers = async (pageNum = 0, size = pageSize) => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `http://localhost:8080/api/v1/suppliers?page=${pageNum}&size=${size}&sort=id,desc`,
                { headers: getAuthHeaders() }
            );

            if (!response.ok) {
                const errJson = await response.json().catch(() => null);
                throw new Error(
                    errJson?.message || `Lỗi tải nhà cung cấp. HTTP ${response.status}`
                );
            }

            const result: ApiResponse = await response.json();

            setSuppliers(result.data.content || []);
            const currentP =
                result.data.page_no > 0 ? result.data.page_no - 1 : 0;
            setPage(currentP);
            setTotalPages(result.data.total_pages);
            setTotalElements(result.data.total_elements);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Không thể tải danh sách nhà cung cấp"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSuppliers(0, pageSize);
    }, [pageSize]);

    // Lọc theo từ khóa tìm kiếm
    const filteredSuppliers = useMemo(() => {
        if (!searchTerm.trim()) return suppliers;
        const lower = searchTerm.toLowerCase();
        return suppliers.filter(
            (s) =>
                s.name.toLowerCase().includes(lower) ||
                s.email.toLowerCase().includes(lower) ||
                s.phone.includes(lower) ||
                s.address.toLowerCase().includes(lower) ||
                String(s.id).includes(lower)
        );
    }, [suppliers, searchTerm]);

    // ========================
    // MỞ MODAL THÊM MỚI
    // ========================
    const handleOpenAdd = () => {
        setEditingSupplier(null);
        setFormData({
            name: "",
            email: "",
            phone: "",
            address: "",
        });
        setShowModal(true);
    };

    // ========================
    // MỞ MODAL SỬA
    // ========================
    const handleOpenEdit = (supplier: Supplier) => {
        setEditingSupplier(supplier);
        setFormData({
            name: supplier.name,
            email: supplier.email,
            phone: supplier.phone,
            address: supplier.address,
        });
        setShowModal(true);
    };

    // ========================
    // LƯU (THÊM / SỬA)
    // ========================
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !formData.name.trim() ||
            !formData.email.trim() ||
            !formData.phone.trim() ||
            !formData.address.trim()
        ) {
            alert("Vui lòng điền đầy đủ tất cả các trường thông tin!");
            return;
        }

        try {
            setSaving(true);
            const isEdit = !!editingSupplier;
            const url = isEdit
                ? `http://localhost:8080/api/v1/suppliers/${editingSupplier!.id}`
                : `http://localhost:8080/api/v1/suppliers`;

            const payload = {
                name: formData.name.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                address: formData.address.trim(),
            };

            const response = await fetch(url, {
                method: isEdit ? "PUT" : "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Lưu nhà cung cấp thất bại");
            }

            alert(
                isEdit
                    ? "Cập nhật nhà cung cấp thành công!"
                    : "Thêm nhà cung cấp thành công!"
            );
            setShowModal(false);
            fetchSuppliers(page, pageSize);
        } catch (err) {
            alert(
                err instanceof Error
                    ? err.message
                    : "Có lỗi xảy ra khi lưu nhà cung cấp"
            );
        } finally {
            setSaving(false);
        }
    };

    // ========================
    // XÓA NHÀ CUNG CẤP
    // ========================
    const handleDelete = async (supplier: Supplier) => {
        const confirmed = window.confirm(
            `Bạn có chắc chắn muốn xóa nhà cung cấp "${supplier.name}" (ID: ${supplier.id})?`
        );
        if (!confirmed) return;

        try {
            const response = await fetch(
                `http://localhost:8080/api/v1/suppliers/${supplier.id}`,
                {
                    method: "DELETE",
                    headers: getAuthHeaders(),
                }
            );

            if (!response.ok) {
                const errJson = await response.json().catch(() => null);
                throw new Error(
                    errJson?.message || `Xóa nhà cung cấp thất bại. HTTP ${response.status}`
                );
            }

            alert("Xóa nhà cung cấp thành công!");

            if (suppliers.length === 1 && page > 0) {
                fetchSuppliers(page - 1, pageSize);
            } else {
                fetchSuppliers(page, pageSize);
            }
        } catch (err) {
            alert(
                err instanceof Error
                    ? err.message
                    : "Có lỗi xảy ra khi xóa nhà cung cấp"
            );
        }
    };

    // ========================
    // PHÂN TRANG
    // ========================
    const handlePageChange = (newPage: number) => {
        if (newPage < 0 || newPage >= totalPages || newPage === page) return;
        fetchSuppliers(newPage, pageSize);
    };

    // ========================
    // LOADING / ERROR
    // ========================
    if (loading && suppliers.length === 0) {
        return (
            <div>
                <div className="page-header">
                    <h1>Quản lý nhà cung cấp</h1>
                </div>
                <div className="admin-table-wrapper">
                    <p style={{ padding: "30px", textAlign: "center" }}>
                        Đang tải danh sách nhà cung cấp...
                    </p>
                </div>
            </div>
        );
    }

    if (error && suppliers.length === 0) {
        return (
            <div>
                <div className="page-header">
                    <h1>Quản lý nhà cung cấp</h1>
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
                            onClick={() => fetchSuppliers(0, pageSize)}
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
                    <h1>Quản lý nhà cung cấp</h1>
                    <p style={{ margin: "4px 0 0", color: "#6b7280" }}>
                        Tổng số: <strong>{totalElements}</strong> nhà cung cấp
                    </p>
                </div>
                <button className="btn-add" onClick={handleOpenAdd}>
                    + Thêm nhà cung cấp
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
                <div style={{ flex: "1", minWidth: "260px", maxWidth: "420px" }}>
                    <input
                        type="text"
                        placeholder="🔍 Tìm theo tên, email, SĐT hoặc địa chỉ..."
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
                        onChange={(e) => setPageSize(Number(e.target.value))}
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
                    <span>nhà cung cấp / trang</span>
                </div>
            </div>

            {/* TABLE */}
            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th style={{ width: "80px" }}>ID</th>
                            <th>Nhà cung cấp</th>
                            <th>Liên hệ</th>
                            <th>Địa chỉ</th>
                            <th style={{ width: "130px" }}>Trạng thái</th>
                            <th style={{ width: "160px", textAlign: "right" }}>
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSuppliers.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    style={{
                                        textAlign: "center",
                                        padding: "36px",
                                        color: "#6b7280",
                                    }}
                                >
                                    {searchTerm
                                        ? "Không tìm thấy nhà cung cấp phù hợp"
                                        : "Chưa có nhà cung cấp nào"}
                                </td>
                            </tr>
                        ) : (
                            filteredSuppliers.map((sup) => (
                                <tr key={sup.id}>
                                    <td>
                                        <strong>#{sup.id}</strong>
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
                                                    width: "34px",
                                                    height: "34px",
                                                    borderRadius: "8px",
                                                    background: "#ecfdf5",
                                                    color: "#059669",
                                                    fontWeight: 600,
                                                    fontSize: "16px",
                                                }}
                                            >
                                                🏢
                                            </span>
                                            <div>
                                                <strong
                                                    style={{
                                                        fontSize: "15px",
                                                        color: "#111827",
                                                        display: "block",
                                                    }}
                                                >
                                                    {sup.name}
                                                </strong>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: "13px", lineHeight: "1.6" }}>
                                            <div>
                                                <span style={{ color: "#6b7280" }}>✉️ </span>
                                                <a
                                                    href={`mailto:${sup.email}`}
                                                    style={{ color: "#2563eb", textDecoration: "none" }}
                                                >
                                                    {sup.email}
                                                </a>
                                            </div>
                                            <div>
                                                <span style={{ color: "#6b7280" }}>📞 </span>
                                                <strong>{sup.phone}</strong>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div
                                            style={{
                                                maxWidth: "280px",
                                                fontSize: "13px",
                                                color: "#4b5563",
                                                lineHeight: "1.4",
                                            }}
                                            title={sup.address}
                                        >
                                            📍 {sup.address}
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
                                                    sup.status === 0
                                                        ? "#dcfce7"
                                                        : "#fee2e2",
                                                color:
                                                    sup.status === 0
                                                        ? "#15803d"
                                                        : "#dc2626",
                                            }}
                                        >
                                            {sup.status === 0
                                                ? "Hoạt động"
                                                : "Đã ẩn"}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                                        <button
                                            className="btn-edit"
                                            style={{ marginRight: "6px" }}
                                            onClick={() => handleOpenEdit(sup)}
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            className="btn-delete"
                                            onClick={() => handleDelete(sup)}
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

            {/* ===== MODAL THÊM / SỬA NHÀ CUNG CẤP ===== */}
            {showModal && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal" style={{ maxWidth: "520px" }}>
                        <div className="admin-modal-header">
                            <h2>
                                {editingSupplier
                                    ? "Chỉnh sửa nhà cung cấp"
                                    : "Thêm nhà cung cấp mới"}
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
                                <label>Tên nhà cung cấp *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        })
                                    }
                                    placeholder="VD: Công ty TNHH Thời Trang ABC..."
                                    maxLength={255}
                                    required
                                    autoFocus
                                />
                            </div>

                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: "12px",
                                }}
                            >
                                <div className="form-group">
                                    <label>Email liên hệ *</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                email: e.target.value,
                                            })
                                        }
                                        placeholder="contact@supplier.com"
                                        maxLength={255}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Số điện thoại *</label>
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                phone: e.target.value,
                                            })
                                        }
                                        placeholder="0901234567"
                                        maxLength={20}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Địa chỉ trụ sở / kho hàng *</label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            address: e.target.value,
                                        })
                                    }
                                    placeholder="Số nhà, đường, quận/huyện, tỉnh/thành phố..."
                                    maxLength={255}
                                    required
                                />
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
                                        : editingSupplier
                                        ? "Lưu thay đổi"
                                        : "Tạo nhà cung cấp"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
