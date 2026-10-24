import {
    useEffect,
    useState,
    type CSSProperties,
    type FormEvent,
} from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8080/api/v1";

// =====================================================
// TYPES
// =====================================================

interface Brand {
    id: number;
    name: string;
}

interface Category {
    id: number;
    name: string;
}

interface Supplier {
    id: number;
    name: string;
}

interface Color {
    id: number;
    name: string;
    code: string;
}

interface Size {
    id: number;
    name: string;
}

interface Variant {
    colorId: string;
    sizeId: string;
    price: string;
    stockQuantity: string;
    sku: string;
}

// Dùng riêng cho AddProduct
// Backend trả danh sách ở data.content
interface LookupPageData<T> {
    content: T[];
    page_no: number;
    page_size: number;
    total_elements: number;
    total_pages: number;
    is_last: boolean;
}

interface ApiResponse<T> {
    code: number;
    message: string;
    data: T;
}

// =====================================================
// COMPONENT
// =====================================================

function AddProduct() {
    const navigate = useNavigate();

    // =================================================
    // PRODUCT
    // =================================================

    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [brandId, setBrandId] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [supplierId, setSupplierId] = useState("");
    const [stock, setStock] = useState("");

    // =================================================
    // LOOKUP DATA
    // =================================================

    const [brands, setBrands] = useState<Brand[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [colors, setColors] = useState<Color[]>([]);
    const [sizes, setSizes] = useState<Size[]>([]);

    // =================================================
    // VARIANTS
    // =================================================

    const [variants, setVariants] = useState<Variant[]>([
        {
            colorId: "",
            sizeId: "",
            price: "",
            stockQuantity: "",
            sku: "",
        },
    ]);

    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState("");

    // =================================================
    // AUTH
    // =================================================

    const getAuthHeaders = (): Record<string, string> => {
        const token = localStorage.getItem("adminToken");
        const tokenType =
            localStorage.getItem("adminTokenType") || "Bearer";

        if (!token) {
            return {
                "Content-Type": "application/json",
            };
        }

        return {
            "Content-Type": "application/json",
            Authorization: `${tokenType} ${token}`,
        };
    };

    // =================================================
    // LOAD LOOKUP DATA
    // =================================================

    useEffect(() => {
        const token = localStorage.getItem("adminToken");

        if (!token) {
            navigate("/admin/login", { replace: true });
            return;
        }

        const adminUserRaw =
            localStorage.getItem("adminUser");

        if (adminUserRaw) {
            try {
                const adminUser = JSON.parse(adminUserRaw);

                if (
                    adminUser.roleName &&
                    adminUser.roleName.toUpperCase() !== "ADMIN"
                ) {
                    navigate("/admin/login", { replace: true });
                    return;
                }
            } catch (err) {
                console.error(
                    "Không đọc được adminUser:",
                    err
                );
            }
        }

        const loadData = async () => {
            try {
                setLoadingData(true);
                setError("");

                const headers = getAuthHeaders();

                const [
                    brandRes,
                    categoryRes,
                    supplierRes,
                    colorRes,
                    sizeRes,
                ] = await Promise.all([
                    fetch(
                        `${API_URL}/brands?page=0&size=100`,
                        {
                            headers,
                        }
                    ),

                    fetch(
                        `${API_URL}/categories?page=0&size=100`,
                        {
                            headers,
                        }
                    ),

                    fetch(
                        `${API_URL}/suppliers?page=0&size=100`,
                        {
                            headers,
                        }
                    ),

                    fetch(
                        `${API_URL}/colors?page=0&size=100`,
                        {
                            headers,
                        }
                    ),

                    fetch(
                        `${API_URL}/sizes?page=0&size=100`,
                        {
                            headers,
                        }
                    ),
                ]);

                // =========================================
                // CHECK RESPONSE
                // =========================================

                if (!brandRes.ok) {
                    throw new Error(
                        "Không thể tải danh sách thương hiệu"
                    );
                }

                if (!categoryRes.ok) {
                    throw new Error(
                        "Không thể tải danh sách danh mục"
                    );
                }

                if (!supplierRes.ok) {
                    throw new Error(
                        "Không thể tải danh sách nhà cung cấp"
                    );
                }

                if (!colorRes.ok) {
                    throw new Error(
                        "Không thể tải danh sách màu sắc"
                    );
                }

                if (!sizeRes.ok) {
                    throw new Error(
                        "Không thể tải danh sách kích thước"
                    );
                }

                // =========================================
                // PARSE JSON
                // =========================================

                const brandJson:
                    ApiResponse<LookupPageData<Brand>> =
                    await brandRes.json();

                const categoryJson:
                    ApiResponse<LookupPageData<Category>> =
                    await categoryRes.json();

                const supplierJson:
                    ApiResponse<LookupPageData<Supplier>> =
                    await supplierRes.json();

                const colorJson:
                    ApiResponse<LookupPageData<Color>> =
                    await colorRes.json();

                const sizeJson:
                    ApiResponse<LookupPageData<Size>> =
                    await sizeRes.json();

                // =========================================
                // BACKEND TRẢ data.content
                // =========================================

                setBrands(
                    brandJson.data?.content || []
                );

                setCategories(
                    categoryJson.data?.content || []
                );

                setSuppliers(
                    supplierJson.data?.content || []
                );

                setColors(
                    colorJson.data?.content || []
                );

                setSizes(
                    sizeJson.data?.content || []
                );

                // =========================================
                // DEBUG
                // =========================================

                console.log(
                    "BRANDS:",
                    brandJson.data?.content
                );

                console.log(
                    "CATEGORIES:",
                    categoryJson.data?.content
                );

                console.log(
                    "SUPPLIERS:",
                    supplierJson.data?.content
                );

                console.log(
                    "COLORS:",
                    colorJson.data?.content
                );

                console.log(
                    "SIZES:",
                    sizeJson.data?.content
                );

            } catch (err) {
                console.error(
                    "Load lookup data error:",
                    err
                );

                setError(
                    err instanceof Error
                        ? err.message
                        : "Không thể tải dữ liệu"
                );
            } finally {
                setLoadingData(false);
            }
        };

        loadData();
    }, [navigate]);

    // =================================================
    // VARIANT
    // =================================================

    const addVariant = () => {
        setVariants((prev) => [
            ...prev,
            {
                colorId: "",
                sizeId: "",
                price: "",
                stockQuantity: "",
                sku: "",
            },
        ]);
    };

    const removeVariant = (index: number) => {
        if (variants.length === 1) {
            alert(
                "Sản phẩm phải có ít nhất một biến thể"
            );
            return;
        }

        setVariants((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };

    const updateVariant = (
        index: number,
        field: keyof Variant,
        value: string
    ) => {
        setVariants((prev) =>
            prev.map((variant, i) =>
                i === index
                    ? {
                        ...variant,
                        [field]: value,
                    }
                    : variant
            )
        );
    };

    // =================================================
    // VALIDATE
    // =================================================

    const validateForm = () => {
        if (!name.trim()) {
            alert("Vui lòng nhập tên sản phẩm");
            return false;
        }

        if (!image.trim()) {
            alert("Vui lòng nhập ảnh sản phẩm");
            return false;
        }

        if (!price || Number(price) < 0) {
            alert("Giá sản phẩm không hợp lệ");
            return false;
        }

        if (!description.trim()) {
            alert("Vui lòng nhập mô tả sản phẩm");
            return false;
        }

        if (!brandId) {
            alert("Vui lòng chọn thương hiệu");
            return false;
        }

        if (!categoryId) {
            alert("Vui lòng chọn danh mục");
            return false;
        }

        if (!supplierId) {
            alert("Vui lòng chọn nhà cung cấp");
            return false;
        }

        if (!stock || Number(stock) < 0) {
            alert("Tồn kho không hợp lệ");
            return false;
        }

        if (variants.length === 0) {
            alert(
                "Sản phẩm phải có ít nhất một biến thể"
            );
            return false;
        }

        for (let i = 0; i < variants.length; i++) {
            const variant = variants[i];

            if (!variant.colorId) {
                alert(
                    `Vui lòng chọn màu cho biến thể ${i + 1
                    }`
                );
                return false;
            }

            if (!variant.sizeId) {
                alert(
                    `Vui lòng chọn kích thước cho biến thể ${i + 1
                    }`
                );
                return false;
            }

            if (
                variant.price !== "" &&
                Number(variant.price) < 0
            ) {
                alert(
                    `Giá biến thể ${i + 1
                    } không hợp lệ`
                );
                return false;
            }

            if (
                variant.stockQuantity === "" ||
                Number(variant.stockQuantity) < 0
            ) {
                alert(
                    `Số lượng tồn kho biến thể ${i + 1
                    } không hợp lệ`
                );
                return false;
            }
        }

        return true;
    };

    // =================================================
    // SUBMIT
    // =================================================

    const handleSubmit = async (
        e: FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const token =
            localStorage.getItem("adminToken");

        if (!token) {
            alert("Bạn chưa đăng nhập admin");

            navigate("/admin/login");

            return;
        }

        try {
            setLoading(true);
            setError("");

            const body = {
                name: name.trim(),

                image: image.trim(),

                price: Number(price),

                description:
                    description.trim(),

                brandId: Number(brandId),

                categoryId: Number(categoryId),

                supplierId: Number(
                    supplierId
                ),

                stock: Number(stock),

                variants: variants.map(
                    (variant) => ({
                        colorId: Number(
                            variant.colorId
                        ),

                        sizeId: Number(
                            variant.sizeId
                        ),

                        price:
                            variant.price === ""
                                ? null
                                : Number(
                                    variant.price
                                ),

                        stockQuantity:
                            Number(
                                variant.stockQuantity
                            ),

                        sku:
                            variant.sku.trim() ||
                            null,
                    })
                ),
            };

            console.log(
                "POST PRODUCT:",
                body
            );

            const response =
                await fetch(
                    `${API_URL}/products`,
                    {
                        method: "POST",

                        headers:
                            getAuthHeaders(),

                        body: JSON.stringify(
                            body
                        ),
                    }
                );

            const text =
                await response.text();

            let result:
                ApiResponse<unknown> | null =
                null;

            try {
                result = text
                    ? JSON.parse(text)
                    : null;
            } catch {
                throw new Error(
                    `Server trả về dữ liệu không hợp lệ: ${text}`
                );
            }

            if (!response.ok) {
                console.error(
                    "Create product error:",
                    result
                );

                const data =
                    result?.data;

                if (
                    data &&
                    typeof data ===
                    "object"
                ) {
                    const messages =
                        Object.entries(
                            data
                        )
                            .map(
                                ([
                                    key,
                                    value,
                                ]) =>
                                    `${key}: ${String(
                                        value
                                    )}`
                            )
                            .join("\n");

                    throw new Error(
                        messages ||
                        result?.message ||
                        "Tạo sản phẩm thất bại"
                    );
                }

                throw new Error(
                    result?.message ||
                    `Tạo sản phẩm thất bại (${response.status})`
                );
            }

            alert(
                "Tạo sản phẩm thành công!"
            );

            navigate(
                "/admin/products"
            );
        } catch (err) {
            console.error(err);

            setError(
                err instanceof Error
                    ? err.message
                    : "Có lỗi xảy ra khi tạo sản phẩm"
            );
        } finally {
            setLoading(false);
        }
    };

    // =================================================
    // LOADING
    // =================================================

    if (loadingData) {
        return (
            <div style={styles.loading}>
                Đang tải dữ liệu...
            </div>
        );
    }

    // =================================================
    // UI
    // =================================================

    return (
        <div style={styles.container}>
            {/* =========================================
                HEADER
            ========================================= */}

            <div style={styles.header}>
                <div>
                    <h1
                        style={styles.title}
                    >
                        Thêm sản phẩm
                    </h1>

                    <p
                        style={
                            styles.subtitle
                        }
                    >
                        Tạo sản phẩm mới
                        trong hệ thống
                    </p>
                </div>

                <button
                    type="button"
                    style={
                        styles.backButton
                    }
                    onClick={() =>
                        navigate(
                            "/admin/products"
                        )
                    }
                >
                    ← Quay lại
                </button>
            </div>

            {/* =========================================
                ERROR
            ========================================= */}

            {error && (
                <div
                    style={
                        styles.error
                    }
                >
                    <strong>
                        Lỗi:
                    </strong>

                    <pre
                        style={
                            styles.errorText
                        }
                    >
                        {error}
                    </pre>
                </div>
            )}

            {/* =========================================
                FORM
            ========================================= */}

            <form
                onSubmit={
                    handleSubmit
                }
            >
                {/* =====================================
                    PRODUCT INFO
                ===================================== */}

                <div
                    style={styles.card}
                >
                    <h2
                        style={
                            styles.sectionTitle
                        }
                    >
                        Thông tin sản phẩm
                    </h2>

                    <div
                        style={
                            styles.grid
                        }
                    >
                        {/* NAME */}

                        <div
                            style={
                                styles.fieldFull
                            }
                        >
                            <label
                                style={
                                    styles.label
                                }
                            >
                                Tên sản phẩm *
                            </label>

                            <input
                                type="text"
                                value={
                                    name
                                }
                                onChange={(
                                    e
                                ) =>
                                    setName(
                                        e
                                            .target
                                            .value
                                    )
                                }
                                placeholder="Nhập tên sản phẩm"
                                style={
                                    styles.input
                                }
                            />
                        </div>

                        {/* IMAGE */}

                        <div
                            style={
                                styles.fieldFull
                            }
                        >
                            <label
                                style={
                                    styles.label
                                }
                            >
                                Hình ảnh *
                            </label>

                            <input
                                type="text"
                                value={
                                    image
                                }
                                onChange={(
                                    e
                                ) =>
                                    setImage(
                                        e
                                            .target
                                            .value
                                    )
                                }
                                placeholder="Ví dụ: clothes_1.jpg"
                                style={
                                    styles.input
                                }
                            />

                            <small
                                style={
                                    styles.hint
                                }
                            >
                                Nhập tên
                                file ảnh
                                hoặc đường
                                dẫn ảnh.
                            </small>
                        </div>

                        {/* PRICE */}

                        <div
                            style={
                                styles.field
                            }
                        >
                            <label
                                style={
                                    styles.label
                                }
                            >
                                Giá sản phẩm *
                            </label>

                            <input
                                type="number"
                                min="0"
                                value={
                                    price
                                }
                                onChange={(
                                    e
                                ) =>
                                    setPrice(
                                        e
                                            .target
                                            .value
                                    )
                                }
                                placeholder="0"
                                style={
                                    styles.input
                                }
                            />
                        </div>

                        {/* STOCK */}

                        <div
                            style={
                                styles.field
                            }
                        >
                            <label
                                style={
                                    styles.label
                                }
                            >
                                Tồn kho *
                            </label>

                            <input
                                type="number"
                                min="0"
                                value={
                                    stock
                                }
                                onChange={(
                                    e
                                ) =>
                                    setStock(
                                        e
                                            .target
                                            .value
                                    )
                                }
                                placeholder="0"
                                style={
                                    styles.input
                                }
                            />
                        </div>

                        {/* BRAND */}

                        <div
                            style={
                                styles.field
                            }
                        >
                            <label
                                style={
                                    styles.label
                                }
                            >
                                Thương hiệu *
                            </label>

                            <select
                                value={
                                    brandId
                                }
                                onChange={(
                                    e
                                ) =>
                                    setBrandId(
                                        e
                                            .target
                                            .value
                                    )
                                }
                                style={
                                    styles.input
                                }
                            >
                                <option value="">
                                    -- Chọn
                                    thương
                                    hiệu --
                                </option>

                                {brands.map(
                                    (
                                        brand
                                    ) => (
                                        <option
                                            key={
                                                brand.id
                                            }
                                            value={
                                                brand.id
                                            }
                                        >
                                            {
                                                brand.name
                                            }
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        {/* CATEGORY */}

                        <div
                            style={
                                styles.field
                            }
                        >
                            <label
                                style={
                                    styles.label
                                }
                            >
                                Danh mục *
                            </label>

                            <select
                                value={
                                    categoryId
                                }
                                onChange={(
                                    e
                                ) =>
                                    setCategoryId(
                                        e
                                            .target
                                            .value
                                    )
                                }
                                style={
                                    styles.input
                                }
                            >
                                <option value="">
                                    -- Chọn
                                    danh mục --
                                </option>

                                {categories.map(
                                    (
                                        category
                                    ) => (
                                        <option
                                            key={
                                                category.id
                                            }
                                            value={
                                                category.id
                                            }
                                        >
                                            {
                                                category.name
                                            }
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        {/* SUPPLIER */}

                        <div
                            style={
                                styles.fieldFull
                            }
                        >
                            <label
                                style={
                                    styles.label
                                }
                            >
                                Nhà cung cấp *
                            </label>

                            <select
                                value={
                                    supplierId
                                }
                                onChange={(
                                    e
                                ) =>
                                    setSupplierId(
                                        e
                                            .target
                                            .value
                                    )
                                }
                                style={
                                    styles.input
                                }
                            >
                                <option value="">
                                    -- Chọn
                                    nhà cung
                                    cấp --
                                </option>

                                {suppliers.map(
                                    (
                                        supplier
                                    ) => (
                                        <option
                                            key={
                                                supplier.id
                                            }
                                            value={
                                                supplier.id
                                            }
                                        >
                                            {
                                                supplier.name
                                            }
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        {/* DESCRIPTION */}

                        <div
                            style={
                                styles.fieldFull
                            }
                        >
                            <label
                                style={
                                    styles.label
                                }
                            >
                                Mô tả *
                            </label>

                            <textarea
                                value={
                                    description
                                }
                                onChange={(
                                    e
                                ) =>
                                    setDescription(
                                        e
                                            .target
                                            .value
                                    )
                                }
                                placeholder="Nhập mô tả sản phẩm"
                                rows={5}
                                style={
                                    styles.textarea
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* =====================================
                    VARIANTS
                ===================================== */}

                <div
                    style={styles.card}
                >
                    <div
                        style={
                            styles.variantHeader
                        }
                    >
                        <div>
                            <h2
                                style={
                                    styles.sectionTitle
                                }
                            >
                                Biến thể sản phẩm
                            </h2>

                            <p
                                style={
                                    styles.hint
                                }
                            >
                                Sản phẩm phải
                                có ít nhất
                                một biến thể.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={
                                addVariant
                            }
                            style={
                                styles.addButton
                            }
                        >
                            + Thêm biến thể
                        </button>
                    </div>

                    {variants.map(
                        (
                            variant,
                            index
                        ) => (
                            <div
                                key={
                                    index
                                }
                                style={
                                    styles.variantCard
                                }
                            >
                                <div
                                    style={
                                        styles.variantTitle
                                    }
                                >
                                    <strong>
                                        Biến thể #
                                        {index +
                                            1}
                                    </strong>

                                    {variants.length >
                                        1 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeVariant(
                                                        index
                                                    )
                                                }
                                                style={
                                                    styles.deleteButton
                                                }
                                            >
                                                Xóa
                                            </button>
                                        )}
                                </div>

                                <div
                                    style={
                                        styles.grid
                                    }
                                >
                                    {/* COLOR */}

                                    <div
                                        style={
                                            styles.field
                                        }
                                    >
                                        <label
                                            style={
                                                styles.label
                                            }
                                        >
                                            Màu sắc *
                                        </label>

                                        <select
                                            value={
                                                variant.colorId
                                            }
                                            onChange={(
                                                e
                                            ) =>
                                                updateVariant(
                                                    index,
                                                    "colorId",
                                                    e
                                                        .target
                                                        .value
                                                )
                                            }
                                            style={
                                                styles.input
                                            }
                                        >
                                            <option value="">
                                                -- Chọn
                                                màu --
                                            </option>

                                            {colors.map(
                                                (
                                                    color
                                                ) => (
                                                    <option
                                                        key={
                                                            color.id
                                                        }
                                                        value={
                                                            color.id
                                                        }
                                                    >
                                                        {
                                                            color.name
                                                        }
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>

                                    {/* SIZE */}

                                    <div
                                        style={
                                            styles.field
                                        }
                                    >
                                        <label
                                            style={
                                                styles.label
                                            }
                                        >
                                            Kích thước *
                                        </label>

                                        <select
                                            value={
                                                variant.sizeId
                                            }
                                            onChange={(
                                                e
                                            ) =>
                                                updateVariant(
                                                    index,
                                                    "sizeId",
                                                    e
                                                        .target
                                                        .value
                                                )
                                            }
                                            style={
                                                styles.input
                                            }
                                        >
                                            <option value="">
                                                -- Chọn
                                                kích
                                                thước --
                                            </option>

                                            {sizes.map(
                                                (
                                                    size
                                                ) => (
                                                    <option
                                                        key={
                                                            size.id
                                                        }
                                                        value={
                                                            size.id
                                                        }
                                                    >
                                                        {
                                                            size.name
                                                        }
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>

                                    {/* VARIANT PRICE */}

                                    <div
                                        style={
                                            styles.field
                                        }
                                    >
                                        <label
                                            style={
                                                styles.label
                                            }
                                        >
                                            Giá biến thể
                                        </label>

                                        <input
                                            type="number"
                                            min="0"
                                            value={
                                                variant.price
                                            }
                                            onChange={(
                                                e
                                            ) =>
                                                updateVariant(
                                                    index,
                                                    "price",
                                                    e
                                                        .target
                                                        .value
                                                )
                                            }
                                            placeholder="Để trống nếu dùng giá sản phẩm"
                                            style={
                                                styles.input
                                            }
                                        />
                                    </div>

                                    {/* VARIANT STOCK */}

                                    <div
                                        style={
                                            styles.field
                                        }
                                    >
                                        <label
                                            style={
                                                styles.label
                                            }
                                        >
                                            Số lượng *
                                        </label>

                                        <input
                                            type="number"
                                            min="0"
                                            value={
                                                variant.stockQuantity
                                            }
                                            onChange={(
                                                e
                                            ) =>
                                                updateVariant(
                                                    index,
                                                    "stockQuantity",
                                                    e
                                                        .target
                                                        .value
                                                )
                                            }
                                            placeholder="0"
                                            style={
                                                styles.input
                                            }
                                        />
                                    </div>

                                    {/* SKU */}

                                    <div
                                        style={
                                            styles.fieldFull
                                        }
                                    >
                                        <label
                                            style={
                                                styles.label
                                            }
                                        >
                                            SKU
                                        </label>

                                        <input
                                            type="text"
                                            value={
                                                variant.sku
                                            }
                                            onChange={(
                                                e
                                            ) =>
                                                updateVariant(
                                                    index,
                                                    "sku",
                                                    e
                                                        .target
                                                        .value
                                                )
                                            }
                                            placeholder="Ví dụ: CAP-BLACK-XL"
                                            style={
                                                styles.input
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </div>

                {/* =====================================
                    BUTTONS
                ===================================== */}

                <div
                    style={styles.actions}
                >
                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/admin/products"
                            )
                        }
                        style={
                            styles.cancelButton
                        }
                        disabled={loading}
                    >
                        Hủy
                    </button>

                    <button
                        type="submit"
                        style={
                            styles.submitButton
                        }
                        disabled={loading}
                    >
                        {loading
                            ? "Đang tạo..."
                            : "Tạo sản phẩm"}
                    </button>
                </div>
            </form>
        </div>
    );
}

// =====================================================
// STYLES
// =====================================================

const styles: Record<
    string,
    CSSProperties
> = {
    container: {
        padding: "24px",
        maxWidth: "1200px",
        margin: "0 auto",
    },

    loading: {
        padding: "40px",
        textAlign: "center",
        fontSize: "18px",
    },

    header: {
        display: "flex",
        justifyContent:
            "space-between",
        alignItems: "center",
        marginBottom: "24px",
    },

    title: {
        margin: 0,
        fontSize: "28px",
    },

    subtitle: {
        marginTop: "6px",
        color: "#666",
    },

    backButton: {
        padding: "10px 16px",
        border: "1px solid #ddd",
        background: "#fff",
        borderRadius: "6px",
        cursor: "pointer",
    },

    card: {
        background: "#fff",
        border: "1px solid #e5e5e5",
        borderRadius: "10px",
        padding: "24px",
        marginBottom: "20px",
    },

    sectionTitle: {
        margin: "0 0 20px",
        fontSize: "20px",
    },

    grid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(2, minmax(0, 1fr))",
        gap: "18px",
    },

    field: {
        display: "flex",
        flexDirection: "column",
    },

    fieldFull: {
        display: "flex",
        flexDirection: "column",
        gridColumn: "1 / -1",
    },

    label: {
        fontWeight: 600,
        marginBottom: "7px",
    },

    input: {
        width: "100%",
        boxSizing: "border-box",
        padding: "11px 12px",
        border: "1px solid #d5d5d5",
        borderRadius: "6px",
        fontSize: "14px",
    },

    textarea: {
        width: "100%",
        boxSizing: "border-box",
        padding: "11px 12px",
        border: "1px solid #d5d5d5",
        borderRadius: "6px",
        fontSize: "14px",
        resize: "vertical",
    },

    hint: {
        color: "#777",
        fontSize: "13px",
        marginTop: "5px",
    },

    error: {
        background: "#fff1f0",
        border: "1px solid #ffccc7",
        borderRadius: "6px",
        padding: "12px",
        marginBottom: "20px",
        color: "#cf1322",
    },

    errorText: {
        whiteSpace: "pre-wrap",
        margin: "6px 0 0",
        fontFamily: "inherit",
    },

    variantHeader: {
        display: "flex",
        justifyContent:
            "space-between",
        alignItems: "flex-start",
        marginBottom: "20px",
    },

    addButton: {
        padding: "10px 16px",
        background: "#1677ff",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
    },

    variantCard: {
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "18px",
        marginBottom: "15px",
        background: "#fafafa",
    },

    variantTitle: {
        display: "flex",
        justifyContent:
            "space-between",
        alignItems: "center",
        marginBottom: "18px",
    },

    deleteButton: {
        padding: "6px 12px",
        border: "1px solid #ff4d4f",
        background: "#fff",
        color: "#ff4d4f",
        borderRadius: "5px",
        cursor: "pointer",
    },

    actions: {
        display: "flex",
        justifyContent:
            "flex-end",
        gap: "10px",
        marginBottom: "30px",
    },

    cancelButton: {
        padding: "11px 22px",
        border: "1px solid #ddd",
        background: "#fff",
        borderRadius: "6px",
        cursor: "pointer",
    },

    submitButton: {
        padding: "11px 24px",
        border: "none",
        background: "#1677ff",
        color: "#fff",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: 600,
    },
};

export default AddProduct;