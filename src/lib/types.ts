// Database Types
export interface User {
  id: string;
  email: string;
  role?: 'admin' | 'user';
  tenant_id?: string | null;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  color?: string;
  theme?: 'light' | 'dark';
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  tenant_id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category_id?: string;
  stock: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  tenant_id: string;
  name: string;
  description?: string;
  image_url?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

export type DeliveryType = 'pickup' | 'delivery';

export interface Neighborhood {
  id: string;
  tenant_id: string;
  name: string;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  tenant_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
<<<<<<< HEAD
  address: string;
  delivery_area_id?: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'cancelled';
  payment_method: 'cash' | 'card' | 'pix';
=======
  customer_address: string;
  total_amount: number;
  status: string;
  tenant_id: string;
  delivery_type: DeliveryType;
  delivery_fee: number;
  neighborhood_id: string | null;
  neighborhood_name: string | null;
>>>>>>> adf068e03d9f7e7f77d8837055e3a6a822dc94c6
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface DeliveryArea {
  id: string;
  tenant_id: string;
  name: string;
  zip_codes: string[];
  delivery_fee: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}
