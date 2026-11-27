import React, { useEffect, useMemo, useState } from 'react';
import ProductList from '../../components/ProductList';
import ProductFilter, {
  emptyFilters,
  type FilterOptions,
  type ProductFilters,
} from '../../components/ProductFilter';
import type { CatalogItem } from '../../api/productApi';
import { useFavourite } from '../../context/FavouriteContext';
import '../public/ProductsPage.css';

const norm = (value: string) => value.trim().toLocaleLowerCase('vi');

const includesAny = (
  selected: string[],
  available: (string | null | undefined)[]
) =>
  !selected.length ||
  available.some(
    (value) => value != null && selected.some((s) => norm(s) === norm(value))
  );

const optionsFrom = (values: (string | null | undefined)[]) =>
  [...new Set(values.filter((v): v is string => !!v && !!v.trim()))]
    .sort((a, b) => a.localeCompare(b, 'vi'))
    .map((value) => ({ label: value, value }));

const colorsOf = (item: CatalogItem) =>
  (item.product.variants ?? [])
    .map((v) => v.colorName)
    .filter((v): v is string => !!v);

const sizesOf = (item: CatalogItem) =>
  (item.product.variants ?? [])
    .map((v) => v.sizeName)
    .filter((v): v is string => !!v);

function priceMatches(price: number, selected: string[]) {
  return (
    !selected.length ||
    selected.some((value) => {
      switch (value) {
        case 'under-200k':
          return price < 200000;
        case '200k-500k':
          return price >= 200000 && price <= 500000;
        case '500k-1m':
          return price > 500000 && price <= 1000000;
        case '1m-2m':
          return price > 1000000 && price <= 2000000;
        case 'over-2m':
          return price > 2000000;
        default:
          return false;
      }
    })
  );
}

function stockMatches(stock: number, selected: string[]) {
  return (
    !selected.length ||
    selected.some((value) =>
      value === 'in-stock'
        ? stock > 0
        : value === 'low-stock'
          ? stock > 0 && stock <= 10
          : value === 'out-of-stock' && stock === 0
    )
  );
}

const FavoritesPage: React.FC = () => {
  const { favourites, loading, error, refreshFavourites } = useFavourite();
  const [filters, setFilters] = useState<ProductFilters>({ ...emptyFilters });

  useEffect(() => {
    const controller = new AbortController();
    refreshFavourites(controller.signal).catch(console.error);
    return () => controller.abort();
  }, [refreshFavourites]);

  const options: FilterOptions = useMemo(
    () => ({
      categories: optionsFrom(favourites.map((i) => i.metadata.categoryName)),
      brands: optionsFrom(favourites.map((i) => i.metadata.brandName)),
      colors: optionsFrom(favourites.flatMap(colorsOf)),
      sizes: optionsFrom(favourites.flatMap(sizesOf)),
    }),
    [favourites]
  );

  const filteredProducts = useMemo(() => {
    const result = favourites.filter((item) => {
      const { product, metadata } = item;
      return (
        (!filters.search.trim() ||
          norm(product.name).includes(norm(filters.search))) &&
        includesAny(filters.categories, [metadata.categoryName]) &&
        includesAny(filters.brands, [metadata.brandName]) &&
        includesAny(filters.colors, colorsOf(item)) &&
        includesAny(filters.sizes, sizesOf(item)) &&
        priceMatches(product.price, filters.priceRanges) &&
        stockMatches(product.inStock, filters.stockStatus)
      );
    });

    switch (filters.sort) {
      case 'price-asc':
        result.sort((a, b) => a.product.price - b.product.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.product.price - a.product.price);
        break;
      case 'name-asc':
        result.sort((a, b) =>
          a.product.name.localeCompare(b.product.name, 'vi')
        );
        break;
      case 'name-desc':
        result.sort((a, b) =>
          b.product.name.localeCompare(a.product.name, 'vi')
        );
        break;
      case 'newest':
        result.sort((a, b) => Number(b.product.id) - Number(a.product.id));
        break;
    }

    return result.map((item) => item.product);
  }, [favourites, filters]);

  return (
    <div className="products-page">
      <ProductFilter
        filters={filters}
        onChange={setFilters}
        options={options}
      />

      {loading ? (
        <p className="products-message">Đang tải danh sách yêu thích...</p>
      ) : error ? (
        <p className="products-message products-error">{error}</p>
      ) : (
        <ProductList
          products={filteredProducts}
          title={`Sản phẩm yêu thích (${filteredProducts.length})`}
        />
      )}
    </div>
  );
};

export default FavoritesPage;
