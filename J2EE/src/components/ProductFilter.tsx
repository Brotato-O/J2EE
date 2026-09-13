import { useState } from "react";
import './ProductFilter.css';

type FilterOption = {
    label: string;
    value: string;
};

type FilterDropdownProps = {
    title: string;
    options: FilterOption[];
    selectedValues: string[];
    onChange: (value: string) => void;
};

function FilterDropdown({
    title,
    options,
    selectedValues,
    onChange,
}: FilterDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="filter-dropdown">
            <button
                type="button"
                className="filter-button"
                onClick={() => setIsOpen(!isOpen)}
            >
                {title}
                <span>▼</span>
            </button>

            {isOpen && (
                <div className="dropdown-menu">
                    {options.map((option) => (
                        <label
                            key={option.value}
                            className="filter-option"
                        >
                            <input
                                type="checkbox"
                                checked={selectedValues.includes(option.value)}
                                onChange={() => onChange(option.value)}
                            />

                            {option.label}
                        </label>
                    ))}
                </div>
            )}
        </div>

    );
}

function ProductFilter() {
    // ================= SEARCH =================

    const [search, setSearch] = useState("");

    // ================= FILTER STATES =================

    const [categories, setCategories] = useState<string[]>([]);
    const [genders, setGenders] = useState<string[]>([]);
    const [colors, setColors] = useState<string[]>([]);
    const [sizes, setSizes] = useState<string[]>([]);
    const [materials, setMaterials] = useState<string[]>([]);
    const [styles, setStyles] = useState<string[]>([]);
    const [priceRanges, setPriceRanges] = useState<string[]>([]);
    const [stockStatus, setStockStatus] = useState<string[]>([]);

    // ================= SORT =================

    const [sort, setSort] = useState("");

    // ================= FILTER OPTIONS =================

    const categoryOptions: FilterOption[] = [
        { label: "Áo", value: "shirt" },
        { label: "Quần", value: "pants" },
        { label: "Váy", value: "skirt" },
        { label: "Đầm", value: "dress" },
        { label: "Áo khoác", value: "jacket" },
        { label: "Đồ thể thao", value: "sportswear" },
        { label: "Phụ kiện", value: "accessories" },
    ];

    const genderOptions: FilterOption[] = [
        { label: "Nam", value: "male" },
        { label: "Nữ", value: "female" },
        { label: "Unisex", value: "unisex" },
        { label: "Trẻ em", value: "children" },
    ];

    const colorOptions: FilterOption[] = [
        { label: "Đen", value: "black" },
        { label: "Trắng", value: "white" },
        { label: "Xám", value: "gray" },
        { label: "Đỏ", value: "red" },
        { label: "Xanh dương", value: "blue" },
        { label: "Xanh lá", value: "green" },
        { label: "Vàng", value: "yellow" },
        { label: "Hồng", value: "pink" },
        { label: "Nâu", value: "brown" },
        { label: "Be", value: "beige" },
    ];

    const sizeOptions: FilterOption[] = [
        { label: "XS", value: "XS" },
        { label: "S", value: "S" },
        { label: "M", value: "M" },
        { label: "L", value: "L" },
        { label: "XL", value: "XL" },
        { label: "XXL", value: "XXL" },
        { label: "28", value: "28" },
        { label: "29", value: "29" },
        { label: "30", value: "30" },
        { label: "31", value: "31" },
        { label: "32", value: "32" },
    ];

    const materialOptions: FilterOption[] = [
        { label: "Cotton", value: "cotton" },
        { label: "Linen", value: "linen" },
        { label: "Polyester", value: "polyester" },
        { label: "Denim", value: "denim" },
        { label: "Kaki", value: "khaki" },
        { label: "Nỉ", value: "fleece" },
        { label: "Len", value: "wool" },
    ];

    const styleOptions: FilterOption[] = [
        { label: "Regular", value: "regular" },
        { label: "Oversize", value: "oversize" },
        { label: "Slim Fit", value: "slim-fit" },
        { label: "Cropped", value: "cropped" },
        { label: "Straight", value: "straight" },
        { label: "Loose Fit", value: "loose-fit" },
    ];

    const priceOptions: FilterOption[] = [
        { label: "Dưới 200.000đ", value: "under-200k" },
        { label: "200.000đ - 500.000đ", value: "200k-500k" },
        { label: "500.000đ - 1.000.000đ", value: "500k-1m" },
        { label: "1.000.000đ - 2.000.000đ", value: "1m-2m" },
        { label: "Trên 2.000.000đ", value: "over-2m" },
    ];

    const stockOptions: FilterOption[] = [
        { label: "Còn hàng", value: "in-stock" },
        { label: "Sắp hết hàng", value: "low-stock" },
        { label: "Hết hàng", value: "out-of-stock" },
    ];

    // ================= HANDLE CHECKBOX =================

    function toggleFilter(
        value: string,
        setter: React.Dispatch<React.SetStateAction<string[]>>
    ) {
        setter((previousValues) => {
            if (previousValues.includes(value)) {
                return previousValues.filter(
                    (item) => item !== value
                );
            }

            return [...previousValues, value];
        });

    }

    // ================= CLEAR FILTER =================

    function clearFilters() {
        setSearch("");

        setCategories([]);
        setGenders([]);
        setColors([]);
        setSizes([]);
        setMaterials([]);
        setStyles([]);
        setPriceRanges([]);
        setStockStatus([]);

        setSort("");

    }

    // ================= UI =================

    return (
        <section className="product-filter">

            {/* SEARCH + SORT */}

            <div className="filter-top">
                <div className="search-box">
                    <span>🔍</span>

                    <input
                        type="text"
                        placeholder="Tìm kiếm áo, quần, váy..."
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                    />
                </div>

                <div className="sort-container">
                    <label htmlFor="sort">
                        Sắp xếp:
                    </label>

                    <select
                        id="sort"
                        value={sort}
                        onChange={(event) =>
                            setSort(event.target.value)
                        }
                    >
                        <option value="">
                            Mặc định
                        </option>

                        <option value="newest">
                            Mới nhất
                        </option>

                        <option value="price-asc">
                            Giá thấp đến cao
                        </option>

                        <option value="price-desc">
                            Giá cao đến thấp
                        </option>

                        <option value="name-asc">
                            Tên A-Z
                        </option>

                        <option value="name-desc">
                            Tên Z-A
                        </option>
                    </select>
                </div>
            </div>

            {/* FILTERS */}

            <div className="filter-row">

                <FilterDropdown
                    title="Danh mục"
                    options={categoryOptions}
                    selectedValues={categories}
                    onChange={(value) =>
                        toggleFilter(value, setCategories)
                    }
                />

                <FilterDropdown
                    title="Giới tính"
                    options={genderOptions}
                    selectedValues={genders}
                    onChange={(value) =>
                        toggleFilter(value, setGenders)
                    }
                />

                <FilterDropdown
                    title="Màu sắc"
                    options={colorOptions}
                    selectedValues={colors}
                    onChange={(value) =>
                        toggleFilter(value, setColors)
                    }
                />

                <FilterDropdown
                    title="Kích thước"
                    options={sizeOptions}
                    selectedValues={sizes}
                    onChange={(value) =>
                        toggleFilter(value, setSizes)
                    }
                />

                <FilterDropdown
                    title="Chất liệu"
                    options={materialOptions}
                    selectedValues={materials}
                    onChange={(value) =>
                        toggleFilter(value, setMaterials)
                    }
                />

                <FilterDropdown
                    title="Kiểu dáng"
                    options={styleOptions}
                    selectedValues={styles}
                    onChange={(value) =>
                        toggleFilter(value, setStyles)
                    }
                />

                <FilterDropdown
                    title="Khoảng giá"
                    options={priceOptions}
                    selectedValues={priceRanges}
                    onChange={(value) =>
                        toggleFilter(value, setPriceRanges)
                    }
                />

                <FilterDropdown
                    title="Tồn kho"
                    options={stockOptions}
                    selectedValues={stockStatus}
                    onChange={(value) =>
                        toggleFilter(value, setStockStatus)
                    }
                />

                <button
                    type="button"
                    className="clear-filter-button"
                    onClick={clearFilters}
                >
                    Xóa bộ lọc
                </button>

            </div>
        </section>
        
    );
}

export default ProductFilter;