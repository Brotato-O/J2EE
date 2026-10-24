import React from 'react';
import ProductList from '../../components/ProductList';
import ProductFilter from '../../components/ProductFilter';
import { mockProducts } from '../../data/mockProducts';

const ProductsPage: React.FC = () => {
  return (
    <div>
      <ProductFilter/>
      <ProductList products={mockProducts}/>
    </div>
  );
};

export default ProductsPage;