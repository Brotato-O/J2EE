import { FiShoppingCart, FiHeart, FiTruck, FiShield, FiRotateCcw, FiStar } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../components/Auth/AuthContext';
import { toast } from 'react-toastify';
import styles from './../ProductDetailPage.module.css';
import type { Product } from '../../../types/Product';

interface ProductDetailPageProps {
  product: Product;
}

function ProductDetailInfor({ product }: ProductDetailPageProps) {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();

    // Gallery ảnh (tận dụng imageUrl sẵn có và tạo danh sách ảnh xem trước)

    const [quantity, setQuantity] = useState<number>(1);
    const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
    const productImages = [
        product.imageUrl,
        'https://picsum.photos/400/300?random=10',
        'https://picsum.photos/400/300?random=11',
        'https://picsum.photos/400/300?random=12',
    ];
    const handleQuantityChange = (type: 'increase' | 'decrease') => {
        if (type === 'decrease' && quantity > 1) {
            setQuantity(quantity - 1);
        } else if (type === 'increase' && quantity < product.inStock) {
            setQuantity(quantity + 1);
        }
    };

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            toast.info('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.');
            navigate('/login');
            return;
        }

        // Thêm sản phẩm vào giỏ hàng theo số lượng đã chọn
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
        toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
    };

    const handleToggleWishlist = () => {
        if (!isAuthenticated) {
            toast.info('Vui lòng đăng nhập để sử dụng danh sách yêu thích.');
            navigate('/login');
            return;
        }
        setIsWishlisted(!isWishlisted);
        toast.success(!isWishlisted ? 'Đã thêm vào yêu thích' : 'Đã xóa khỏi yêu thích');
    };


    const [selectedImg, setSelectedImg] = useState<string>(productImages[0]);
    return (<div className={styles.productCard}>
        {/* CỘT TRÁI: GALLERY ẢNH */}
        <div className={styles.gallerySection}>
            <div className={styles.mainImageWrapper}>
                <img src={selectedImg} alt={product.name} className={styles.mainImage} />
                <button
                    type="button"
                    className={styles.wishlistBtn}
                    onClick={handleToggleWishlist}
                    title={isWishlisted ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
                >
                    {isWishlisted ? <FaHeart color="#f04d26" /> : <FiHeart />}
                </button>
            </div>
            <div className={styles.thumbList}>
                {productImages.map((img, idx) => (
                    <img
                        key={idx}
                        src={img}
                        alt={`thumb-${idx}`}
                        className={`${styles.thumbItem} ${selectedImg === img ? styles.activeThumb : ''}`}
                        onClick={() => setSelectedImg(img)}
                    />
                ))}
            </div>
        </div>

        {/* CỘT PHẢI: THÔNG TIN VÀ THAO TÁC */}
        <div className={styles.infoSection}>
            <h1 className={styles.title}>{product.name}</h1>

            <div className={styles.ratingRow}>
                <div className={styles.stars}>
                    <FiStar className={styles.starIcon} />
                    <span>4.8</span>
                </div>
                <span className={styles.divider}>|</span>
                <span className={styles.reviews}>24 đánh giá</span>
                <span className={styles.divider}>|</span>
                <span className={styles.stockText}>Kho: {product.inStock} sản phẩm</span>
            </div>

            <div className={styles.priceBox}>
                <span className={styles.currentPrice}>
                    {product.price.toLocaleString('vi-VN')} đ
                </span>
                <span className={styles.originalPrice}>
                    {(product.price * 1.15).toLocaleString('vi-VN')} đ
                </span>
            </div>

            {/* CHỌN SỐ LƯỢNG */}
            <div className={styles.quantitySection}>
                <span className={styles.label}>Số lượng:</span>
                <div className={styles.quantityControl}>
                    <button type="button" onClick={() => handleQuantityChange('decrease')}>-</button>
                    <input type="text" value={quantity} readOnly />
                    <button type="button" onClick={() => handleQuantityChange('increase')}>+</button>
                </div>
            </div>

            {/* NÚT BẤM */}
            <div className={styles.actionButtons}>
                <button className={styles.addToCartBtn} onClick={handleAddToCart}>
                    <FiShoppingCart /> Thêm vào giỏ hàng
                </button>
                <button
                    className={styles.buyNowBtn}
                    onClick={() => {
                        handleAddToCart();
                        navigate('/checkout');
                    }}
                >
                    Mua ngay
                </button>
            </div>

            {/* CAM KẾT / ƯU ĐÃI */}
            <div className={styles.policyGrid}>
                <div className={styles.policyItem}>
                    <FiTruck className={styles.policyIcon} />
                    <span>Miễn phí vận chuyển đơn từ 500k</span>
                </div>
                <div className={styles.policyItem}>
                    <FiShield className={styles.policyIcon} />
                    <span>Bảo hành chính hãng 12 tháng</span>
                </div>
                <div className={styles.policyItem}>
                    <FiRotateCcw className={styles.policyIcon} />
                    <span>Đổi trả 1-1 trong 30 ngày</span>
                </div>
            </div>
        </div>
    </div>)
}

export default ProductDetailInfor