import React from 'react';
import ProductList from '../../components/ProductList';
import ProductFilter from '../../components/ProductFilter';

const ProductsPage: React.FC = () => {
  return (
    <div>
      <ProductFilter/>
      <ProductList />
    </div>
  );
};

export default ProductsPage;