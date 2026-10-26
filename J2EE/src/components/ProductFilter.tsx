import { useState } from 'react';
import './ProductFilter.css';

export interface ProductFilters {
    search: string;
    categories: string[];
    brands: string[];
    colors: string[];
    sizes: string[];
    priceRanges: string[];
    stockStatus: string[];
    sort: string;
}
export const emptyFilters: ProductFilters = {
    search: '', categories: [], brands: [], colors: [], sizes: [],
    priceRanges: [], stockStatus: [], sort: ''
};
export type FilterOption = { label: string; value: string };
export interface FilterOptions {
    categories: FilterOption[];
    brands: FilterOption[];
    colors: FilterOption[];
    sizes: FilterOption[];
}
type Props = {
    filters: ProductFilters;
    onChange: (value: ProductFilters) => void;
    options: FilterOptions;
};
function Dropdown({ title, options, selected, onToggle }: {
    title: string; options: FilterOption[]; selected: string[];
    onToggle: (value: string) => void;
}) {
    const [open, setOpen] = useState(false);
    return <div className="filter-dropdown">
        <button type="button" className="filter-button" onClick={() => setOpen(!open)}
            aria-expanded={open}>{title} <span>▼</span></button>
        {open && <div className="dropdown-menu">
            {options.map(option => <label className="filter-option" key={option.value}>
                <input type="checkbox" checked={selected.includes(option.value)}
                    onChange={() => onToggle(option.value)} />{option.label}
            </label>)}
            {options.length === 0 && <span>Chưa có dữ liệu</span>}
        </div>}
    </div>;
}
const priceOptions: FilterOption[] = [
    { label: 'Dưới 200.000đ', value: 'under-200k' },
    { label: '200.000đ - 500.000đ', value: '200k-500k' },
    { label: '500.000đ - 1.000.000đ', value: '500k-1m' },
    { label: '1.000.000đ - 2.000.000đ', value: '1m-2m' },
    { label: 'Trên 2.000.000đ', value: 'over-2m' }
];
const stockOptions: FilterOption[] = [
    { label: 'Còn hàng', value: 'in-stock' },
    { label: 'Sắp hết hàng (1–10)', value: 'low-stock' },
    { label: 'Hết hàng', value: 'out-of-stock' }
];
export default function ProductFilter({ filters, onChange, options }: Props) {
    const update = <K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) =>
        onChange({ ...filters, [key]: value });
    const toggle = (key: 'categories' | 'brands' | 'colors' | 'sizes' | 'priceRanges' | 'stockStatus', value: string) => {
        const current = filters[key];
        update(key, current.includes(value) ? current.filter(v => v !== value) : [...current, value]);
    };
    return <section className="product-filter">
        <div className="filter-top">
            <div className="search-box"><span>🔍</span>
                <input type="text" placeholder="Tìm kiếm sản phẩm..." value={filters.search}
                    onChange={e => update('search', e.target.value)} />
            </div>
            <div className="sort-container"><label htmlFor="sort">Sắp xếp:</label>
                <select id="sort" value={filters.sort} onChange={e => update('sort', e.target.value)}>
                    <option value="">Mặc định</option>
                    <option value="newest">Mới nhất (ID giảm dần)</option>
                    <option value="price-asc">Giá thấp đến cao</option>
                    <option value="price-desc">Giá cao đến thấp</option>
                    <option value="name-asc">Tên A-Z</option>
                    <option value="name-desc">Tên Z-A</option>
                </select>
            </div>
        </div>
        <div className="filter-row">
            <Dropdown title="Danh mục" options={options.categories} selected={filters.categories} onToggle={v => toggle('categories', v)} />
            <Dropdown title="Thương hiệu" options={options.brands} selected={filters.brands} onToggle={v => toggle('brands', v)} />
            <Dropdown title="Màu sắc" options={options.colors} selected={filters.colors} onToggle={v => toggle('colors', v)} />
            <Dropdown title="Kích thước" options={options.sizes} selected={filters.sizes} onToggle={v => toggle('sizes', v)} />
            <Dropdown title="Khoảng giá" options={priceOptions} selected={filters.priceRanges} onToggle={v => toggle('priceRanges', v)} />
            <Dropdown title="Tồn kho" options={stockOptions} selected={filters.stockStatus} onToggle={v => toggle('stockStatus', v)} />
            <button type="button" className="clear-filter-button" onClick={() => onChange({ ...emptyFilters })}>Xóa bộ lọc</button>
        </div>
    </section>;
}
