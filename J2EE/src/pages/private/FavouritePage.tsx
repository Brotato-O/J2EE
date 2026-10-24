import React from 'react';
import ProductList from '../../components/ProductList';
import { mockProducts } from '../../data/mockProducts';
import ProductFilter from '../../components/ProductFilter';

const FavoritesPage: React.FC = () => {
    const favoriteIds: string[] = ['1', '3', '5'];

    const favoriteProducts = mockProducts.filter(
        product => favoriteIds.includes(product.id)
    );

    return (
        <div>
            <ProductFilter/>
            <ProductList
                products={favoriteProducts}
                title="Sản phẩm yêu thích"
            />
        </div>
    );
};

export default FavoritesPage;