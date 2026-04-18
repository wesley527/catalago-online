import { supabase } from '../lib/supabase';
import type { Order, OrderItem } from '../lib/types';
import { ensureAuthSessionForWrite } from '../lib/supabaseAuth';

export type CreateOrderInput = {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  totalAmount: number;
  tenantId: string;
  deliveryType: 'retirada' | 'entrega';
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
    try {
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
    } catch (error) {
      console.error('[orderService] getAllOrders error:', error);
      return [];
    }
  },

  async getOrderById(id: string, tenantId?: string): Promise<Order | null> {
    try {
      let query = supabase
        .from('orders')
        .select('*')
        .eq('id', id);

      if (tenantId) {
        query = query.eq('tenant_id', tenantId);
      }

      const { data, error } = await query.maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('[orderService] getOrderById error:', error);
      return null;
    }
  },

  async getOrderWithItems(
    id: string,
    tenantId?: string
  ): Promise<{ order: Order; items: OrderItem[] } | null> {
    try {
      const order = await this.getOrderById(id, tenantId);
      if (!order) return null;

      const { data: items, error } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', id);

      if (error) throw error;

      return { order, items: items || [] };
    } catch (error) {
      console.error('[orderService] getOrderWithItems error:', error);
      return null;
    }
  },

  async updateOrderStatus(
    id: string,
    status: string,
    tenantId?: string
  ): Promise<Order> {
    let query = supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (tenantId) {
      query = query.eq('tenant_id', tenantId);
    }

    const { data, error } = await query.select().single();

    if (error) throw error;
    return data;
  },

  async deleteOrder(id: string, tenantId?: string): Promise<void> {
    await supabase.from('order_items').delete().eq('order_id', id);

    let query = supabase.from('orders').delete().eq('id', id);

    if (tenantId) {
      query = query.eq('tenant_id', tenantId);
    }

    const { error } = await query;
    if (error) throw error;
  },

  async deleteAllOrdersByTenant(tenantId: string): Promise<void> {
    const { data: orders } = await supabase
      .from('orders')
      .select('id')
      .eq('tenant_id', tenantId);

    if (orders && orders.length > 0) {
      const orderIds = orders.map((o) => o.id);
      await supabase.from('order_items').delete().in('order_id', orderIds);
    }

    const { error } = await supabase.from('orders').delete().eq('tenant_id', tenantId);

    if (error) throw error;
  },

  async deleteAllOrdersForTenant(tenantId: string): Promise<void> {
    await ensureAuthSessionForWrite();
    const { error } = await supabase.from('orders').delete().eq('tenant_id', tenantId);

    if (error) throw error;
  },
};

export async function getOrders(tenantId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createOrder(order: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<Order> {
  const { data, error } = await supabase
    .from('orders')
    .insert([order])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateOrder(id: string, updates: Partial<Order>): Promise<Order> {
  const { data, error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteOrder(id: string): Promise<void> {
  const { error } = await supabase.from('orders').delete().eq('id', id);
  if (error) throw error;
}
