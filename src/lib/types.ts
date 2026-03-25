export interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  tenant_id: string;
  created_at: string;
}

export interface Subscription {
  id: string;
  tenant_id: string;
  plan: string;
  status: 'active' | 'canceled' | 'expired';
  expires_at: string | null;
  created_at: string;
}

export interface TenantSettings {
  id: string;
  tenant_id: string;
  primary_color: string;
  secondary_color: string;
  logo_url: string | null;
  banner_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  image_url: string | null;
  tenant_id: string;
  category_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  total_amount: number;
  status: string;
  tenant_id: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CheckoutData {
  customer_name: string;
  customer_phone: string;
  customer_address: string;
}
