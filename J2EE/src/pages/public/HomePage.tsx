
import React, { useEffect, useState } from 'react';
import ProductList from '../../components/ProductList';
import styles from './HomePage.module.css';
import Footer from '../../components/Footer';
import { getProducts } from '../../api/productApi';
import type { Product } from '../../types/Product';

const PAGE_SIZE = 8;

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await getProducts(page, PAGE_SIZE);

        if (!cancelled) {
          setProducts(data.products);
          setTotalPages(data.totalPages);
        }
      } catch (err) {
        console.error('Lỗi tải sản phẩm:', err);

        if (!cancelled) {
          setError('Không thể tải danh sách sản phẩm.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [page]);

  const handlePageChange = (newPage: number) => {
    if (
      newPage < 0 ||
      newPage >= totalPages ||
      newPage === page
    ) {
      return;
    }

    setPage(newPage);
  };

  return (
    <div>
      <header className={styles.hero}>
        <h1 className={styles.title}>
          Chào mừng đến với J2EE Store
        </h1>

        <p className={styles.subtitle}>
          Khám phá danh sách sản phẩm mới nhất của chúng tôi
        </p>
      </header>

      <main>
        {loading ? (
          <p className={styles.message}>
            Đang tải sản phẩm...
          </p>
        ) : error ? (
          <p className={styles.message}>
            {error}
          </p>
        ) : (
          <>
            <ProductList
              products={products}
              title="Sản phẩm mới nhất"
            />

            {totalPages > 1 && (
              <nav
                className={styles.pagination}
                aria-label="Phân trang sản phẩm"
              >
                <button
                  type="button"
                  disabled={page === 0}
                  onClick={() => handlePageChange(page - 1)}
                >
                  Trước
                </button>

                {Array.from(
                  { length: totalPages },
                  (_, index) => (
                    <button
                      type="button"
                      key={index}
                      className={
                        page === index
                          ? styles.activePage
                          : ''
                      }
                      aria-current={
                        page === index ? 'page' : undefined
                      }
                      onClick={() => handlePageChange(index)}
                    >
                      {index + 1}
                    </button>
                  )
                )}

                <button
                  type="button"
                  disabled={page === totalPages - 1}
                  onClick={() => handlePageChange(page + 1)}
                >
                  Sau
                </button>
              </nav>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
