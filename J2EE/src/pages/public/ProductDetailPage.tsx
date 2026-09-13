
import styles from './ProductDetailPage.module.css';
import ProductDetailInfor from './ProductDetailPage/ProductDetailInfor';
import ProductDetailDescribe from './ProductDetailPage/ProductDetailDescribe';
import { mockProducts } from '../../data/mockProducts';
import { useParams } from 'react-router-dom';

function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();

  const product = mockProducts.find((p) => p.id === id);

  if (!product) {
    return <div>Không tìm thấy sản phẩm</div>;
  }
 
  return (
    <div className={styles.pageContainer}>

      {/* MAIN DETAILS */}
      <main className={styles.mainContent}>
        
        <ProductDetailInfor product={product} />
        

        <ProductDetailDescribe  product={product}/>
        
      </main>
    </div>
  );
};

export default ProductDetailPage;