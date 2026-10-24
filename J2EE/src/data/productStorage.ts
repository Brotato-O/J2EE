export interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
}

const STORAGE_KEY = "admin_products";

const defaultProducts: Product[] = [
    {
        id: 1,
        name: "iPhone 15",
        price: 20000000,
        stock: 10,
    },
    {
        id: 2,
        name: "Samsung S24",
        price: 18000000,
        stock: 15,
    },
];

export function getProducts(): Product[] {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(defaultProducts)
        );

        return defaultProducts;
    }

    return JSON.parse(data);
}

export function saveProducts(products: Product[]) {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(products)
    );
}

export function getProductById(id: number) {
    const products = getProducts();

    return products.find(
        (product) => product.id === id
    );
}

export function addProduct(
    product: Omit<Product, "id">
) {
    const products = getProducts();

    const newProduct: Product = {
        id:
            products.length > 0
                ? Math.max(...products.map((p) => p.id)) + 1
                : 1,

        ...product,
    };

    products.push(newProduct);

    saveProducts(products);

    return newProduct;
}

export function updateProduct(
    id: number,
    data: Omit<Product, "id">
) {
    const products = getProducts();

    const index = products.findIndex(
        (product) => product.id === id
    );

    if (index === -1) {
        return false;
    }

    products[index] = {
        id,
        ...data,
    };

    saveProducts(products);

    return true;
}

export function deleteProduct(id: number) {
    const products = getProducts();

    const newProducts = products.filter(
        (product) => product.id !== id
    );

    saveProducts(newProducts);
}