import { supabase } from '../lib/supabase';
import { ensureAuthSessionForWrite } from '../lib/supabaseAuth';
import { DeliveryType, Order, OrderItem } from '../lib/types';

export type CreateOrderInput = {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  totalAmount: number;
  tenantId: string;
  deliveryType: DeliveryType;
  deliveryFee: number;
  neighborhoodId: string | null;
  neighborhoodName: string | null;
};

export const orderService = {
  async createOrder(input: CreateOrderInput): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          customer_name: input.customerName,
          customer_phone: input.customerPhone,
          customer_address: input.customerAddress,
          total_amount: input.totalAmount,
          tenant_id: input.tenantId,
          status: 'pending',
          delivery_type: input.deliveryType,
          delivery_fee: input.deliveryFee,
          neighborhood_id: input.neighborhoodId,
          neighborhood_name: input.neighborhoodName,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async createOrderItems(
    orderId: string,
    items: Array<{ product_id: string; quantity: number; unit_price: number }>
  ): Promise<OrderItem[]> {
    const orderItems = items.map((item) => ({
      order_id: orderId,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
    }));

    const { data, error } = await supabase
      .from('order_items')
      .insert(orderItems)
      .select();

    if (error) throw error;
    return data || [];
  },

  async getAllOrders(tenantId?: string): Promise<Order[]> {
    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (tenantId) {
      query = query.eq('tenant_id', tenantId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  async getOrderById(id: string, tenantId?: string): Promise<Order | null> {
    let query = supabase.from('orders').select('*').eq('id', id);

    if (tenantId) {
      query = query.eq('tenant_id', tenantId);
    }

    const { data, error } = await query.maybeSingle();

    if (error) throw error;
    return data;
  },

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    const { data, error } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);

    if (error) throw error;
    return data || [];
  },

  async getOrdersWithItems(tenantId?: string): Promise<
    Array<Order & { items: (OrderItem & { product_name?: string })[] }>
  > {
    let query = supabase
      .from('orders')
      .select(
        `
        *,
        order_items (
          *,
          products:product_id (name)
        )
      `
      )
      .order('created_at', { ascending: false });

    if (tenantId) {
      query = query.eq('tenant_id', tenantId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  async updateOrderStatus(id: string, status: string, tenantId?: string): Promise<void> {
    await ensureAuthSessionForWrite();
    let query = supabase.from('orders').update({ status }).eq('id', id);

    if (tenantId) {
      query = query.eq('tenant_id', tenantId);
    }

    const { error } = await query;

    if (error) throw error;
  },

  async deleteAllOrdersForTenant(tenantId: string): Promise<void> {
    await ensureAuthSessionForWrite();
    const { error } = await supabase.from('orders').delete().eq('tenant_id', tenantId);

    if (error) throw error;
  },
};
