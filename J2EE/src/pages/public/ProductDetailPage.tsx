import React from 'react';
import { useParams } from 'react-router-dom';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <div>
      <h2>Product Detail for ID: {id}</h2>
      <p>Details of product {id} will go here.</p>
    </div>
  );
};

export default ProductDetailPage;