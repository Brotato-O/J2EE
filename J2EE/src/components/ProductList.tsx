
import React from "react";
import ProductCard from "./ProductCard";
import styles from "./ProductList.module.css";
import type { Product } from "../types/Product";

interface ProductListProps {
  products: Product[];
  title?: string;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  title = "Danh sách sản phẩm",
}) => {
  return (
    <section>
      <h2 className={styles.heading}>{title}</h2>

      {products.length === 0 ? (
        <p>Chưa có sản phẩm nào.</p>
      ) : (
        <div className={styles.list}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductList;
