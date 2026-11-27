import { mapProduct, type BackendProduct, type CatalogItem } from './productApi';

const API_URL = 'http://localhost:8080/api/v1/favourites';

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Vui lòng đăng nhập để sử dụng danh sách yêu thích.');
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

const extractErrorMessage = async (
  response: Response,
  fallback: string
): Promise<string> => {
  const errorBody = await response.json().catch(() => null);
  if (errorBody && typeof errorBody.message === 'string' && errorBody.message.trim()) {
    return errorBody.message;
  }
  return fallback;
};

// Lấy danh sách sản phẩm yêu thích của người dùng đang đăng nhập
export const getMyFavourites = async (
  signal?: AbortSignal
): Promise<CatalogItem[]> => {
  const response = await fetch(API_URL, {
    method: 'GET',
    headers: getAuthHeaders(),
    signal,
  });

  if (!response.ok) {
    throw new Error(
      await extractErrorMessage(response, 'Không thể tải danh sách yêu thích')
    );
  }

  const json: ApiResponse<BackendProduct[]> = await response.json();
  const items = Array.isArray(json.data) ? json.data : [];

  return items.map((item) => ({
    product: mapProduct(item),
    metadata: item,
  }));
};

// Lấy danh sách ID sản phẩm yêu thích của người dùng đang đăng nhập
export const getMyFavouriteIds = async (
  signal?: AbortSignal
): Promise<string[]> => {
  const response = await fetch(`${API_URL}/ids`, {
    method: 'GET',
    headers: getAuthHeaders(),
    signal,
  });

  if (!response.ok) {
    throw new Error(
      await extractErrorMessage(response, 'Không thể tải danh sách yêu thích')
    );
  }

  const json: ApiResponse<number[]> = await response.json();
  const ids = Array.isArray(json.data) ? json.data : [];

  return ids.map((id) => String(id));
};

// Thêm sản phẩm vào danh sách yêu thích
export const addFavouriteApi = async (
  productId: string | number
): Promise<CatalogItem> => {
  const id = encodeURIComponent(String(productId));
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(
      await extractErrorMessage(
        response,
        'Không thể thêm sản phẩm vào danh sách yêu thích'
      )
    );
  }

  const json: ApiResponse<BackendProduct> = await response.json();

  return {
    product: mapProduct(json.data),
    metadata: json.data,
  };
};

// Xóa sản phẩm khỏi danh sách yêu thích
export const removeFavouriteApi = async (
  productId: string | number
): Promise<void> => {
  const id = encodeURIComponent(String(productId));
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(
      await extractErrorMessage(
        response,
        'Không thể xóa sản phẩm khỏi danh sách yêu thích'
      )
    );
  }
};
