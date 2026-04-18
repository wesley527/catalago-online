// Database Types
export interface User {
  id: string;
  email: string;
  role: 'admin' | 'store_owner' | 'customer';
  display_name: string;
  avatar_url?: string;
  phone?: string;
  bio?: string;
  preferences?: Record<string, any>;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface Tenant {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  banner_url?: string;
  email?: string;
  phone?: string;
  is_active: boolean;
  plan: 'free' | 'basic' | 'premium';
  settings?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  tenant_id: string;
  name: string;
  description?: string;
  icon?: string;
  order_index: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  tenant_id: string;
  category_id?: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  stock: number;
  active: boolean;
  order_index: number;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Neighborhood {
  id: string;
  tenant_id: string;
  name: string;
  zip_code_start?: string;
  zip_code_end?: string;
  delivery_fee: number;
  delivery_time_minutes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  tenant_id: string;
  customer_name: string;
  customer_email?: string;
  customer_phone: string;
  customer_address: string;
  neighborhood_id?: string;
  delivery_type: 'pickup' | 'delivery';
  payment_method: 'cash' | 'card' | 'pix';
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  items: Array<{
    product_id: string;
    name: string;
    quantity: number;
    price: number;
    subtotal: number;
  }>;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  name: string;
  price: number;
  quantity: number;
}
