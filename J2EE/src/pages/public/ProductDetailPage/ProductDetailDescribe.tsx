import { useState } from 'react';
import type { Product } from '../../../types/Product';
import styles from './../ProductDetailPage.module.css';
interface ProductDetailPageProps {
  product: Product;
}
function ProductDetailDescribe({ product }: ProductDetailPageProps)  {
    
  const [activeTab, setActiveTab] = useState<'desc' | 'specs'>('desc');
  return (
    <div className={styles.detailsTabCard}>
          <div className={styles.tabHeader}>
            <button
              className={`${styles.tabBtn} ${activeTab === 'desc' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('desc')}
            >
              Mô tả sản phẩm
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === 'specs' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('specs')}
            >
              Thông tin chi tiết
            </button>
          </div>

          <div className={styles.tabBody}>
            {activeTab === 'desc' ? (
              <p className={styles.descContent}>{product.shortDescription}</p>
            ) : (
              <table className={styles.specsTable}>
                <tbody>
                  <tr>
                    <td className={styles.specKey}>Tên sản phẩm</td>
                    <td className={styles.specVal}>{product.name}</td>
                  </tr>
                  <tr>
                    <td className={styles.specKey}>Mã sản phẩm</td>
                    <td className={styles.specVal}>{product.id}</td>
                  </tr>
                  <tr>
                    <td className={styles.specKey}>Tình trạng kho</td>
                    <td className={styles.specVal}>{product.inStock > 0 ? 'Còn hàng' : 'Hết hàng'}</td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </div>)
}

export default ProductDetailDescribe;