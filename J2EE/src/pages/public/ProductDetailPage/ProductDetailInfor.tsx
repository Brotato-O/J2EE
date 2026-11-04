import {
    FiShoppingCart,
    FiHeart,
    FiTruck,
    FiShield,
    FiRotateCcw,
    FiStar,
} from 'react-icons/fi';

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

    const { addVariantToCart } = useCart();
    const { isAuthenticated } = useAuth();

    const [quantity, setQuantity] = useState<number>(1);

    const [isWishlisted, setIsWishlisted] = useState<boolean>(false);

    const [selectedColor, setSelectedColor] = useState<string>('');
    const [selectedSize, setSelectedSize] = useState<string>('');

    const productImages = [
        product.imageUrl,
        'https://picsum.photos/400/300?random=10',
        'https://picsum.photos/400/300?random=11',
        'https://picsum.photos/400/300?random=12',
    ];

    const [selectedImg, setSelectedImg] = useState<string>(
        productImages[0]
    );

    // Danh sách biến thể
    const variants = product.variants ?? [];

    // Danh sách màu không trùng nhau
    const colors = Array.from(
        new Set(
            variants
                .map(variant => variant.colorName)
                .filter((color): color is string => Boolean(color))
        )
    );

    // Những biến thể thuộc màu đang chọn
    const availableVariants = variants.filter(
        variant => variant.colorName === selectedColor
    );

    // Danh sách size thuộc màu đang chọn
    const sizes = Array.from(
        new Set(
            availableVariants
                .map(variant => variant.sizeName)
                .filter((size): size is string => Boolean(size))
        )
    );

    // Tìm đúng biến thể theo màu và size
    const selectedVariant = variants.find(
        variant =>
            variant.colorName === selectedColor &&
            variant.sizeName === selectedSize
    );

    const variantStock = selectedVariant?.stockQuantity ?? 0;

    const variantPrice = selectedVariant?.price ?? product.price;

    // Thay đổi số lượng
    const handleQuantityChange = (
        type: 'increase' | 'decrease'
    ) => {
        if (type === 'decrease') {
            setQuantity(previous => Math.max(1, previous - 1));
            return;
        }

        if (!selectedVariant) {
            toast.info('Vui lòng chọn màu sắc và kích thước');
            return;
        }

        setQuantity(previous =>
            Math.min(variantStock, previous + 1)
        );
    };

    // Thêm sản phẩm vào giỏ hàng
    const handleAddToCart = async (): Promise<boolean> => {
        if (!isAuthenticated) {
            toast.info('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.');
            navigate('/login');
            return false;
        }

        if (!selectedColor || !selectedSize) {
            toast.warning('Vui lòng chọn màu sắc và kích thước.');
            return false;
        }

        if (!selectedVariant) {
            toast.error('Không tìm thấy biến thể sản phẩm.');
            return false;
        }

        if (variantStock <= 0) {
            toast.error('Biến thể này đã hết hàng.');
            return false;
        }

        if (quantity > variantStock) {
            toast.warning(
                `Số lượng vượt quá tồn kho. Hiện chỉ còn ${variantStock} sản phẩm.`
            );
            return false;
        }

        try {
            await addVariantToCart(selectedVariant.id, quantity);

            toast.success(
                `Đã thêm ${quantity} sản phẩm vào giỏ hàng!`
            );

            return true;
        } catch (error) {
            console.error('Lỗi thêm giỏ hàng:', error);

            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Không thể thêm sản phẩm vào giỏ hàng.'
            );

            return false;
        }
    };

    // Mua ngay: chỉ chuyển trang nếu thêm giỏ hàng thành công
    const handleBuyNow = async () => {
        const success = await handleAddToCart();

        if (success) {
            navigate('/checkout');
        }
    };

    // Yêu thích
    const handleToggleWishlist = () => {
        if (!isAuthenticated) {
            toast.info(
                'Vui lòng đăng nhập để sử dụng danh sách yêu thích.'
            );

            navigate('/login');
            return;
        }

        setIsWishlisted(previous => !previous);

        toast.success(
            !isWishlisted
                ? 'Đã thêm vào yêu thích'
                : 'Đã xóa khỏi yêu thích'
        );
    };

    return (
        <div className={styles.productCard}>

            {/* CỘT TRÁI: GALLERY ẢNH */}
            <div className={styles.gallerySection}>

                <div className={styles.mainImageWrapper}>
                    <img
                        src={selectedImg}
                        alt={product.name}
                        className={styles.mainImage}
                    />

                    <button
                        type="button"
                        className={styles.wishlistBtn}
                        onClick={handleToggleWishlist}
                        title={
                            isWishlisted
                                ? 'Xóa khỏi yêu thích'
                                : 'Thêm vào yêu thích'
                        }
                    >
                        {isWishlisted
                            ? <FaHeart color="#f04d26" />
                            : <FiHeart />
                        }
                    </button>
                </div>

                <div className={styles.thumbList}>
                    {productImages.map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            alt={`thumb-${index}`}
                            className={`
                                ${styles.thumbItem}
                                ${selectedImg === img ? styles.activeThumb : ''}
                            `}
                            onClick={() => setSelectedImg(img)}
                        />
                    ))}
                </div>
            </div>

            {/* CỘT PHẢI: THÔNG TIN SẢN PHẨM */}
            <div className={styles.infoSection}>

                <h1 className={styles.title}>
                    {product.name}
                </h1>

                {/* ĐÁNH GIÁ VÀ TỒN KHO */}
                <div className={styles.ratingRow}>

                    <div className={styles.stars}>
                        <FiStar className={styles.starIcon} />
                        <span>4.8</span>
                    </div>

                    <span className={styles.divider}>|</span>

                    <span className={styles.reviews}>
                        24 đánh giá
                    </span>

                    <span className={styles.divider}>|</span>

                    <span className={styles.stockText}>
                        Kho: {product.inStock} sản phẩm
                    </span>

                </div>

                {/* GIÁ SẢN PHẨM */}
                <div className={styles.priceBox}>

                    <span className={styles.currentPrice}>
                        {variantPrice.toLocaleString('vi-VN')} đ
                    </span>

                    <span className={styles.originalPrice}>
                        {(variantPrice * 1.15).toLocaleString('vi-VN')} đ
                    </span>

                </div>

                {/* CHỌN MÀU */}
                <div className={styles.variantSection}>

                    <span className={styles.label}>
                        Màu sắc:
                    </span>

                    <div className={styles.variantList}>

                        {colors.length > 0 ? (
                            colors.map(color => (
                                <button
                                    key={color}
                                    type="button"
                                    className={`
                                        ${styles.variantItem}
                                        ${selectedColor === color
                                            ? styles.variantActive
                                            : ''
                                        }
                                    `}
                                    onClick={() => {
                                        setSelectedColor(color);
                                        setSelectedSize('');
                                        setQuantity(1);
                                    }}
                                >
                                    {color}
                                </button>
                            ))
                        ) : (
                            <span>Không có thông tin màu sắc</span>
                        )}

                    </div>
                </div>

                {/* CHỌN SIZE */}
                {selectedColor && (
                    <div className={styles.variantSection}>

                        <span className={styles.label}>
                            Kích thước:
                        </span>

                        <div className={styles.variantList}>

                            {sizes.length > 0 ? (
                                sizes.map(size => {
                                    const variant = availableVariants.find(
                                        item => item.sizeName === size
                                    );

                                    const outOfStock =
                                        !variant ||
                                        (variant.stockQuantity ?? 0) <= 0;

                                    return (
                                        <button
                                            key={size}
                                            type="button"
                                            disabled={outOfStock}
                                            className={`
                                                ${styles.variantItem}
                                                ${selectedSize === size
                                                    ? styles.variantActive
                                                    : ''
                                                }
                                            `}
                                            onClick={() => {
                                                setSelectedSize(size);
                                                setQuantity(1);
                                            }}
                                        >
                                            {size}
                                            {outOfStock && ' (Hết hàng)'}
                                        </button>
                                    );
                                })
                            ) : (
                                <span>
                                    Không có kích thước cho màu này
                                </span>
                            )}

                        </div>
                    </div>
                )}

                {/* THÔNG TIN BIẾN THỂ */}
                {selectedVariant && (
                    <div className={styles.variantInfo}>

                        <p>
                            Giá:
                            {' '}
                            <strong>
                                {variantPrice.toLocaleString('vi-VN')} đ
                            </strong>
                        </p>

                        <p>
                            Tồn kho:
                            {' '}
                            <strong>{variantStock}</strong>
                            {' '}sản phẩm
                        </p>

                        <p>
                            SKU: {selectedVariant.sku ?? 'Chưa có'}
                        </p>

                    </div>
                )}

                {/* CHỌN SỐ LƯỢNG */}
                <div className={styles.quantitySection}>

                    <span className={styles.label}>
                        Số lượng:
                    </span>

                    <div className={styles.quantityControl}>

                        <button
                            type="button"
                            onClick={() => handleQuantityChange('decrease')}
                            disabled={quantity <= 1}
                        >
                            -
                        </button>

                        <input
                            type="text"
                            value={quantity}
                            readOnly
                        />

                        <button
                            type="button"
                            onClick={() => handleQuantityChange('increase')}
                            disabled={
                                !selectedVariant ||
                                quantity >= variantStock
                            }
                        >
                            +
                        </button>

                    </div>

                </div>

                {/* NÚT THAO TÁC */}
                <div className={styles.actionButtons}>

                    <button
                        type="button"
                        className={styles.addToCartBtn}
                        onClick={handleAddToCart}
                        disabled={!selectedVariant || variantStock <= 0}
                    >
                        <FiShoppingCart />
                        Thêm vào giỏ hàng
                    </button>

                    <button
                        type="button"
                        className={styles.buyNowBtn}
                        onClick={handleBuyNow}
                        disabled={!selectedVariant || variantStock <= 0}
                    >
                        Mua ngay
                    </button>

                </div>

                {/* CAM KẾT / ƯU ĐÃI */}
                <div className={styles.policyGrid}>

                    <div className={styles.policyItem}>
                        <FiTruck className={styles.policyIcon} />
                        <span>
                            Miễn phí vận chuyển đơn từ 500k
                        </span>
                    </div>

                    <div className={styles.policyItem}>
                        <FiShield className={styles.policyIcon} />
                        <span>
                            Bảo hành chính hãng 12 tháng
                        </span>
                    </div>

                    <div className={styles.policyItem}>
                        <FiRotateCcw className={styles.policyIcon} />
                        <span>
                            Đổi trả 1-1 trong 30 ngày
                        </span>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default ProductDetailInfor;