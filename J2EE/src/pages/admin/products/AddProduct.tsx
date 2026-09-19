import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { addProduct } from "../../../data/productStorage";

export default function AddProduct() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");

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

        addProduct({
            name: name.trim(),
            price: Number(price),
            stock: Number(stock),
        });

        alert("Thêm sản phẩm thành công!");

        navigate("/admin/products");
    };

    return (
        <div>
            <div className="page-header">
                <h1>Thêm sản phẩm</h1>
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
                            placeholder="Nhập tên sản phẩm"
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
                            placeholder="Nhập giá"
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
                            placeholder="Nhập số lượng"
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
                            className="btn-add"
                        >
                            Thêm sản phẩm
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}