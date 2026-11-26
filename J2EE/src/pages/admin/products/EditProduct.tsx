import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface ProductVariant {
    id: number | null;
    colorId: number;
    colorName: string;
    sizeId: number;
    sizeName: string;
    price: number | null;
    stockQuantity: number;
    sku: string | null;
}

interface VariantRequest {
    id: number | null;
    colorId: number;
    sizeId: number;
    price: number;
    stockQuantity: number;
    sku: string;
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

interface ApiResponse {
    code: number;
    message: string;
    data: Product;
}

export default function EditProduct() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    // ==============================
    // THÔNG TIN SẢN PHẨM
    // ==============================
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [variants, setVariants] = useState<ProductVariant[]>([]);
    // ==============================
    // ID LIÊN KẾT
    // ==============================
    const [brandId, setBrandId] = useState<number | null>(null);
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [supplierId, setSupplierId] = useState<number | null>(null);

    // Tên để hiển thị
    const [brandName, setBrandName] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [supplierName, setSupplierName] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // ==============================
    // LẤY THÔNG TIN SẢN PHẨM
    // ==============================
    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) {
                alert("ID sản phẩm không hợp lệ");
                navigate("/admin/products");
                return;
            }

            try {
                setLoading(true);

<<<<<<< HEAD
                const token =
                    localStorage.getItem("adminToken");

                const tokenType =
                    localStorage.getItem(
                        "adminTokenType"
                    ) || "Bearer";

                const headers: HeadersInit = {
                    "Content-Type": "application/json",
                };

                if (token) {
                    headers.Authorization = `${tokenType} ${token}`;
=======
                const token = localStorage.getItem("adminToken");
                const tokenType = localStorage.getItem("adminTokenType") || "Bearer";

                if (!token) {
                    throw new Error("Bạn chưa đăng nhập admin hoặc token đã hết hạn.");
>>>>>>> d8593f618069b4861c43c17747dfb752c93884bc
                }

                const response = await fetch(
                    `http://localhost:8080/api/v1/products/${id}`,
                    {
<<<<<<< HEAD
                        headers,
=======
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `${tokenType} ${token}`,
                        },
>>>>>>> d8593f618069b4861c43c17747dfb752c93884bc
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        "Không thể lấy thông tin sản phẩm"
                    );
                }

                const result: ApiResponse =
                    await response.json();

                if (result.code !== 200 || !result.data) {
                    throw new Error(
                        result.message ||
                        "Không tìm thấy sản phẩm"
                    );
                }

                const product = result.data;

                // ==============================
                // THÔNG TIN CƠ BẢN
                // ==============================
                setName(product.name);
                setPrice(String(product.price));
                setStock(String(product.stock));
                setDescription(product.description || "");
                setImage(product.image || "");

                // ==============================
                // LƯU ID LIÊN KẾT
                // ==============================
                setBrandId(product.brandId);
                setCategoryId(product.categoryId);
                setSupplierId(product.supplierId);

                // ==============================
                // LƯU TÊN ĐỂ HIỂN THỊ
                // ==============================
                setBrandName(product.brandName || "");
                setCategoryName(product.categoryName || "");
                setSupplierName(product.supplierName || "");
                setVariants(
                    (product.variants || []).map((variant) => ({
                        ...variant,
                        price: variant.price ?? product.price
                    }))
                );
            } catch (error) {
                console.error(error);

                alert(
                    error instanceof Error
                        ? error.message
                        : "Không thể tải sản phẩm"
                );

                navigate("/admin/products");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, navigate]);

    // ==============================
    // CẬP NHẬT SẢN PHẨM
    // ==============================
    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!id) {
            alert("ID sản phẩm không hợp lệ");
            return;
        }

        if (!name.trim()) {
            alert("Vui lòng nhập tên sản phẩm");
            return;
        }

        if (!price || Number(price) <= 0) {
            alert("Giá sản phẩm không hợp lệ");
            return;
        }

        if (stock === "" || Number(stock) < 0) {
            alert("Số lượng tồn kho không hợp lệ");
            return;
        }

        // ==============================
        // KIỂM TRA ID LIÊN KẾT
        // ==============================
        if (brandId === null) {
            alert("Thương hiệu không được để trống");
            return;
        }

        if (categoryId === null) {
            alert("Danh mục không được để trống");
            return;
        }

        if (supplierId === null) {
            alert("Nhà cung cấp không được để trống");
            return;
        }

        try {
            setSaving(true);

            // ==============================
            // LẤY JWT ADMIN
            // ==============================
            const token =
                localStorage.getItem("adminToken");

            const tokenType =
                localStorage.getItem("adminTokenType") ||
                "Bearer";

            if (!token) {
                alert(
                    "Bạn chưa đăng nhập admin hoặc token đã hết hạn."
                );
                return;
            }

            // ==============================
            // DEBUG
            // ==============================
            console.log("===== UPDATE PRODUCT =====");
            console.log("Product ID:", id);
            console.log("brandId:", brandId);
            console.log("categoryId:", categoryId);
            console.log("supplierId:", supplierId);

            // ==============================
            // GỌI API UPDATE
            // ==============================
            const response = await fetch(
                `http://localhost:8080/api/v1/products/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `${tokenType} ${token}`,
                    },

                    body: JSON.stringify({
                        name: name.trim(),
                        price: Number(price),
                        stock: Number(stock),
                        description: description.trim(),
                        image: image.trim(),

                        brandId,
                        categoryId,
                        supplierId,

                        variants: variants.map((variant) => ({
                            id: variant.id,
                            colorId: variant.colorId,
                            sizeId: variant.sizeId,

                            price: variant.price ?? Number(price),

                            stockQuantity: variant.stockQuantity,

                            sku: variant.sku?.trim() || ""
                        }))
                    }),
                }
            );

            // ==============================
            // XỬ LÝ HTTP ERROR
            // ==============================
            if (!response.ok) {
                const errorText =
                    await response.text();

                console.error(
                    "HTTP ERROR:",
                    response.status,
                    errorText
                );

                if (response.status === 401) {
                    alert(
                        "Token không hợp lệ hoặc đã hết hạn."
                    );
                    return;
                }

                if (response.status === 403) {
                    alert(
                        "Tài khoản admin không có quyền cập nhật sản phẩm."
                    );
                    return;
                }

                throw new Error(
                    errorText ||
                    `Cập nhật thất bại (${response.status})`
                );
            }

            // ==============================
            // ĐỌC RESPONSE
            // ==============================
            const result = await response.json();

            console.log(
                "Update product response:",
                result
            );

            if (result.code !== 200) {
                throw new Error(
                    result.message ||
                    "Cập nhật sản phẩm thất bại"
                );
            }

            // ==============================
            // THÀNH CÔNG
            // ==============================
            alert(
                "Cập nhật sản phẩm thành công!"
            );

            navigate("/admin/products");

        } catch (error) {
            console.error(error);

            alert(
                error instanceof Error
                    ? error.message
                    : "Có lỗi xảy ra khi cập nhật sản phẩm"
            );
        } finally {
            setSaving(false);
        }
    };
    // Thêm biến thể mới
    const handleAddVariant = () => {
        setVariants((prev) => [
            ...prev,
            {
                id: null,
                colorId: 0,
                colorName: "",
                sizeId: 0,
                sizeName: "",
                price: Number(price) || 0,
                stockQuantity: 0,
                sku: ""
            }
        ]);
    };

    // Cập nhật một biến thể
    const handleVariantChange = (
        index: number,
        field: keyof ProductVariant,
        value: string | number
    ) => {
        setVariants((prev) =>
            prev.map((variant, i) =>
                i === index
                    ? { ...variant, [field]: value }
                    : variant
            )
        );
    };

    // Xóa biến thể
    const handleRemoveVariant = (index: number) => {
        if (variants.length <= 1) {
            alert("Sản phẩm phải có ít nhất một biến thể");
            return;
        }

        setVariants((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };
    // ==============================
    // LOADING
    // ==============================
    if (loading) {
        return (
            <div className="admin-form-card">
                <p>
                    Đang tải thông tin sản phẩm...
                </p>
            </div>
        );
    }

    // ==============================
    // FORM
    // ==============================
    return (
        <div>
            <div className="page-header">
                <h1>Sửa sản phẩm</h1>
            </div>

            <div className="admin-form-card">
                <form
                    className="admin-form"
                    onSubmit={handleSubmit}
                >
                    {/* TÊN */}
                    <div className="form-group">
                        <label htmlFor="name">
                            Tên sản phẩm
                        </label>

                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            disabled={saving}
                        />
                    </div>

                    {/* GIÁ */}
                    <div className="form-group">
                        <label htmlFor="price">
                            Giá sản phẩm
                        </label>

                        <input
                            id="price"
                            type="number"
                            min="0"
                            value={price}
                            onChange={(e) =>
                                setPrice(e.target.value)
                            }
                            disabled={saving}
                        />
                    </div>

                    {/* TỒN KHO */}
                    <div className="form-group">
                        <label htmlFor="stock">
                            Số lượng tồn kho
                        </label>

                        <input
                            id="stock"
                            type="number"
                            min="0"
                            value={stock}
                            onChange={(e) =>
                                setStock(e.target.value)
                            }
                            disabled={saving}
                        />
                    </div>

                    {/* HÌNH ẢNH */}
                    <div className="form-group">
                        <label htmlFor="image">
                            Hình ảnh
                        </label>

                        <input
                            id="image"
                            type="text"
                            value={image}
                            onChange={(e) =>
                                setImage(e.target.value)
                            }
                            disabled={saving}
                        />
                    </div>

                    {/* MÔ TẢ */}
                    <div className="form-group">
                        <label htmlFor="description">
                            Mô tả sản phẩm
                        </label>

                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) =>
                                setDescription(
                                    e.target.value
                                )
                            }
                            rows={5}
                            disabled={saving}
                        />
                    </div>

                    {/* THƯƠNG HIỆU */}
                    <div className="form-group">
                        <label>
                            Thương hiệu
                        </label>

                        <input
                            type="text"
                            value={brandName}
                            disabled
                        />
                    </div>

                    {/* DANH MỤC */}
                    <div className="form-group">
                        <label>
                            Danh mục
                        </label>

                        <input
                            type="text"
                            value={categoryName}
                            disabled
                        />
                    </div>

                    {/* NHÀ CUNG CẤP */}
                    <div className="form-group">
                        <label>
                            Nhà cung cấp
                        </label>

                        <input
                            type="text"
                            value={supplierName}
                            disabled
                        />
                    </div>
                    {/* QUẢN LÝ BIẾN THỂ */}
                    <div className="variant-section">

                        <div className="variant-header">
                            <div>
                                <h3>Danh sách biến thể</h3>
                                <p>Quản lý màu sắc, kích thước, giá và tồn kho</p>
                            </div>

                            <button
                                type="button"
                                className="btn-add-variant"
                                onClick={handleAddVariant}
                                disabled={saving}
                            >
                                + Thêm biến thể
                            </button>
                        </div>

                        {variants.map((variant, index) => (
                            <div className="variant-card" key={variant.id ?? `new-${index}`}>

                                <div className="variant-card-header">
                                    <strong>
                                        Biến thể #{index + 1}
                                        {variant.id !== null && ` (ID: ${variant.id})`}
                                    </strong>

                                    <button
                                        type="button"
                                        className="btn-remove-variant"
                                        onClick={() => handleRemoveVariant(index)}
                                        disabled={saving || variants.length <= 1}
                                    >
                                        Xóa
                                    </button>
                                </div>

                                <div className="variant-grid">

                                    {/* COLOR ID */}
                                    <div className="form-group">
                                        <label>Mã màu (Color ID)</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={variant.colorId || ""}
                                            onChange={(e) =>
                                                handleVariantChange(
                                                    index,
                                                    "colorId",
                                                    Number(e.target.value)
                                                )
                                            }
                                            disabled={saving}
                                        />
                                        {variant.colorName && (
                                            <small>Hiện tại: {variant.colorName}</small>
                                        )}
                                    </div>

                                    {/* SIZE ID */}
                                    <div className="form-group">
                                        <label>Mã kích thước (Size ID)</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={variant.sizeId || ""}
                                            onChange={(e) =>
                                                handleVariantChange(
                                                    index,
                                                    "sizeId",
                                                    Number(e.target.value)
                                                )
                                            }
                                            disabled={saving}
                                        />
                                        {variant.sizeName && (
                                            <small>Hiện tại: {variant.sizeName}</small>
                                        )}
                                    </div>

                                    {/* GIÁ BIẾN THỂ */}
                                    <div className="form-group">
                                        <label>Giá biến thể</label>
                                        <input
                                            type="text"
                                            value={`${Number(price).toLocaleString("vi-VN")} đ`}
                                            disabled
                                        />
                                        <small>Giá được lấy từ giá sản phẩm</small>
                                    </div>

                                    {/* STOCK */}
                                    <div className="form-group">
                                        <label>Số lượng tồn kho</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={variant.stockQuantity}
                                            onChange={(e) =>
                                                handleVariantChange(
                                                    index,
                                                    "stockQuantity",
                                                    Number(e.target.value)
                                                )
                                            }
                                            disabled={saving}
                                        />
                                    </div>

                                    {/* SKU */}
                                    <div className="form-group variant-sku">
                                        <label>Mã SKU</label>
                                        <input
                                            type="text"
                                            value={variant.sku || ""}
                                            onChange={(e) =>
                                                handleVariantChange(
                                                    index,
                                                    "sku",
                                                    e.target.value
                                                )
                                            }
                                            disabled={saving}
                                        />
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>

                    {/* BUTTON */}
                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={() =>
                                navigate(
                                    "/admin/products"
                                )
                            }
                            disabled={saving}
                        >
                            Hủy
                        </button>

                        <button
                            type="submit"
                            className="btn-save"
                            disabled={saving}
                        >
                            {saving
                                ? "Đang lưu..."
                                : "Lưu thay đổi"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}