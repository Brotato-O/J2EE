import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    getProductById,
    updateProduct,
} from "../../../data/productStorage";

export default function EditProduct() {
    const navigate = useNavigate();

    const { id } = useParams();

    const productId = Number(id);

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");

    useEffect(() => {
        const product =
            getProductById(productId);

        if (!product) {
            alert("Không tìm thấy sản phẩm");

            navigate("/admin/products");

            return;
        }

        setName(product.name);
        setPrice(String(product.price));
        setStock(String(product.stock));
    }, [productId, navigate]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!name.trim()) {
            alert("Vui lòng nhập tên sản phẩm");
            return;
        }

        if (!price || Number(price) <= 0) {
            alert("Giá sản phẩm không hợp lệ");
            return;
        }

        if (!stock || Number(stock) < 0) {
            alert("Số lượng tồn kho không hợp lệ");
            return;
        }

        updateProduct(productId, {
            name: name.trim(),
            price: Number(price),
            stock: Number(stock),
        });

        alert("Cập nhật sản phẩm thành công!");

        navigate("/admin/products");
    };

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
                    <div className="form-group">
                        <label>
                            Tên sản phẩm
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            Giá sản phẩm
                        </label>

                        <input
                            type="number"
                            value={price}
                            onChange={(e) =>
                                setPrice(e.target.value)
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            Số lượng tồn kho
                        </label>

                        <input
                            type="number"
                            value={stock}
                            onChange={(e) =>
                                setStock(e.target.value)
                            }
                        />
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={() =>
                                navigate(
                                    "/admin/products"
                                )
                            }
                        >
                            Hủy
                        </button>

                        <button
                            type="submit"
                            className="btn-save"
                        >
                            Lưu thay đổi
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}