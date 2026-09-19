import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getProducts,
    deleteProduct,
} from "../../../data/productStorage";

import type {
    Product,
} from "../../../data/productStorage";

export default function ProductList() {
    const navigate = useNavigate();

    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        setProducts(getProducts());
    }, []);

    const handleDelete = (id: number) => {
        const product = products.find(
            (p) => p.id === id
        );

        if (!product) return;

        const confirmed = window.confirm(
            `Bạn có chắc muốn xóa sản phẩm "${product.name}"?`
        );

        if (!confirmed) return;

        deleteProduct(id);

        setProducts(getProducts());
    };

    return (
        <div>
            {/* Header */}
            <div className="page-header">
                <h1>Quản lý sản phẩm</h1>

                <button
                    className="btn-add"
                    onClick={() =>
                        navigate("/admin/products/add")
                    }
                >
                    + Thêm sản phẩm
                </button>
            </div>

            {/* Table */}
            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên sản phẩm</th>
                            <th>Giá</th>
                            <th>Tồn kho</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    style={{
                                        textAlign: "center",
                                        padding: "30px",
                                    }}
                                >
                                    Chưa có sản phẩm
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.id}</td>

                                    <td>
                                        <strong>
                                            {product.name}
                                        </strong>
                                    </td>

                                    <td>
                                        {product.price.toLocaleString(
                                            "vi-VN"
                                        )}{" "}
                                        đ
                                    </td>

                                    <td>
                                        {product.stock}
                                    </td>

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
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}