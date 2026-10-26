import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductList from '../../components/ProductList';
import ProductFilter, { emptyFilters, type ProductFilters, type FilterOptions } from '../../components/ProductFilter';
import { getProductCatalog, type CatalogItem } from '../../api/productApi';
import './ProductsPage.css';
const PAGE_SIZE = 12;
const norm = (value: string) => value.trim().toLocaleLowerCase('vi');
const includesAny = (selected: string[], available: (string | null | undefined)[]) =>
  !selected.length || available.some(value => value != null && selected.some(s => norm(s) === norm(value)));
const optionsFrom = (values: (string | null | undefined)[]) =>
  [...new Set(values.filter((v): v is string => !!v && !!v.trim()))]
    .sort((a, b) => a.localeCompare(b, 'vi'))
    .map(value => ({ label: value, value }));
const colorsOf = (item: CatalogItem) => item.metadata.colorNames ??
  item.metadata.details?.map(d => d.colorName).filter((v): v is string => !!v) ?? [];
const sizesOf = (item: CatalogItem) => item.metadata.sizeNames ??
  item.metadata.details?.map(d => d.sizeName).filter((v): v is string => !!v) ?? [];
function priceMatches(price: number, selected: string[]) {
  return !selected.length || selected.some(value => {
    switch (value) {
      case 'under-200k': return price < 200000;
      case '200k-500k': return price >= 200000 && price <= 500000;
      case '500k-1m': return price > 500000 && price <= 1000000;
      case '1m-2m': return price > 1000000 && price <= 2000000;
      case 'over-2m': return price > 2000000;
      default: return false;
    }
  });
}
function stockMatches(stock: number, selected: string[]) {
  return !selected.length || selected.some(value => value === 'in-stock' ? stock > 0 :
    value === 'low-stock' ? stock > 0 && stock <= 10 : value === 'out-of-stock' && stock === 0);
}
const ProductsPage: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const [filters, setFilters] = useState<ProductFilters>({ ...emptyFilters });
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const urlSearch = params.get('search') ?? '';
  const pageNumber = Number(params.get('page') ?? '1');
  const requestedPage = Number.isInteger(pageNumber) && pageNumber > 0 ? pageNumber : 1;
  useEffect(() => {
    const controller = new AbortController();
    getProductCatalog(controller.signal)
      .then(items => { setCatalog(items); setError(''); })
      .catch(e => { if (!controller.signal.aborted) setError(e instanceof Error ? e.message : 'Lỗi tải sản phẩm'); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);
  const options: FilterOptions = useMemo(() => ({
    categories: optionsFrom(catalog.map(i => i.metadata.categoryName)),
    brands: optionsFrom(catalog.map(i => i.metadata.brandName)),
    colors: optionsFrom(catalog.flatMap(colorsOf)),
    sizes: optionsFrom(catalog.flatMap(sizesOf)),
  }), [catalog]);
  const effectiveSearch = urlSearch || filters.search;
  const filtered = useMemo(() => {
    const result = catalog.filter(item => {
      const { product, metadata } = item;
      return (!effectiveSearch.trim() || norm(product.name).includes(norm(effectiveSearch))) &&
        includesAny(filters.categories, [metadata.categoryName]) &&
        includesAny(filters.brands, [metadata.brandName]) &&
        includesAny(filters.colors, colorsOf(item)) &&
        includesAny(filters.sizes, sizesOf(item)) &&
        priceMatches(product.price, filters.priceRanges) &&
        stockMatches(product.inStock, filters.stockStatus);
    });
    switch (filters.sort) {
      case 'price-asc': result.sort((a, b) => a.product.price - b.product.price); break;
      case 'price-desc': result.sort((a, b) => b.product.price - a.product.price); break;
      case 'name-asc': result.sort((a, b) => a.product.name.localeCompare(b.product.name, 'vi')); break;
      case 'name-desc': result.sort((a, b) => b.product.name.localeCompare(a.product.name, 'vi')); break;
      case 'newest': result.sort((a, b) => Number(b.product.id) - Number(a.product.id)); break;
    }
    return result;
  }, [catalog, filters, effectiveSearch]);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const page = Math.min(requestedPage, Math.max(totalPages, 1));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map(item => item.product);
  const updateFilters = (next: ProductFilters) => {
    setFilters(next);
    const updated = new URLSearchParams(params);
    updated.delete('search'); updated.delete('page');
    setParams(updated);
  };
  const changePage = (next: number) => {
    if (next < 1 || next > totalPages) return;
    const updated = new URLSearchParams(params);
    updated.set('page', String(next));
    setParams(updated);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return <div className="products-page">
    <ProductFilter filters={{ ...filters, search: effectiveSearch }} onChange={updateFilters} options={options} />
    {loading ? <p className="products-message">Đang tải sản phẩm...</p> :
      error ? <p className="products-message products-error">{error}</p> : <>
        <ProductList products={visible} title={`Danh sách sản phẩm (${filtered.length})`} />
        {totalPages > 1 && <nav className="products-pagination" aria-label="Phân trang sản phẩm">
          <button disabled={page === 1} onClick={() => changePage(page - 1)}>Trước</button>
          {Array.from({ length: totalPages }, (_, index) => <button key={index}
            className={page === index + 1 ? 'active' : ''}
            aria-current={page === index + 1 ? 'page' : undefined}
            onClick={() => changePage(index + 1)}>{index + 1}</button>)}
          <button disabled={page === totalPages} onClick={() => changePage(page + 1)}>Sau</button>
        </nav>}
      </>}
  </div>;
};
export default ProductsPage;
