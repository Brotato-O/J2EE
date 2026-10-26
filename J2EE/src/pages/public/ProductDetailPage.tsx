
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import styles from './ProductDetailPage.module.css';

import ProductDetailInfor from './ProductDetailPage/ProductDetailInfor';
import ProductDetailDescribe from './ProductDetailPage/ProductDetailDescribe';

import { getProductById } from '../../api/productApi';
import type { Product } from '../../types/Product';

function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const fetchProductDetail = async () => {
      if (!id || !/^\d+$/.test(id)) {
        setProduct(null);
        setError('ID sản phẩm không hợp lệ');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        setProduct(null);

        const data = await getProductById(id);

        if (!cancelled) {
          setProduct(data);
        }
      } catch (err) {
        console.error('Lỗi lấy chi tiết sản phẩm:', err);

        if (!cancelled) {
          setError(
            err instanceof Error &&
              err.message === 'PRODUCT_NOT_FOUND'
              ? 'Không tìm thấy sản phẩm'
              : 'Không thể tải thông tin sản phẩm'
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProductDetail();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <p style={{ textAlign: 'center', padding: '50px' }}>
          Đang tải thông tin sản phẩm...
        </p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles.pageContainer}>
        <p
          style={{
            textAlign: 'center',
            padding: '50px',
            color: '#dc2626',
          }}
        >
          {error || 'Không tìm thấy sản phẩm'}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <main className={styles.mainContent}>
        <ProductDetailInfor product={product} />

        <ProductDetailDescribe product={product} />
      </main>
    </div>
  );
}

export default ProductDetailPage;
