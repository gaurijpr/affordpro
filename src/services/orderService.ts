import { Order } from '../types/order';
import { CartItem } from '../types/cart';
import { MOCK_USER_ORDERS } from '../mock/data';
import { fetchApi } from './api';

const getStoredOrders = (): Order[] => {
  try {
    const local = localStorage.getItem('affordpro_all_orders');
    if (local) return JSON.parse(local);
  } catch {}
  return MOCK_USER_ORDERS;
};

const saveStoredOrders = (orders: Order[]): void => {
  try {
    localStorage.setItem('affordpro_all_orders', JSON.stringify(orders));
  } catch (e) {
    console.warn('Failed to save order', e);
  }
};

export const orderService = {
  async createOrder(data: {
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    items: CartItem[];
    paymentMethod: string;
    couponCode?: string;
    totalAmount: number;
  }): Promise<Order> {
    try {
      const created = await fetchApi<Order>('/orders', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      const current = getStoredOrders();
      saveStoredOrders([created, ...current]);
      return created;
    } catch {
      const now = new Date();
      const formattedDate = `${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} at ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;

      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber: `AP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        date: formattedDate,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone || 'N/A',
        items: data.items.map(item => ({
          productId: item.product.id,
          productTitle: item.product.title,
          productImage: item.product.images[0],
          productType: item.product.productType,
          price: item.product.price,
          quantity: item.quantity,
          downloadUrl: item.product.downloadUrl,
          accessUrl: item.product.productType === 'COURSE' ? '/account?tab=courses' : undefined,
        })),
        subtotal: data.totalAmount,
        discount: 0,
        tax: 0,
        total: data.totalAmount,
        paymentMethod: data.paymentMethod,
        paymentStatus: 'PAID',
        orderStatus: 'COMPLETED',
        couponCode: data.couponCode,
      };

      const current = getStoredOrders();
      const updated = [newOrder, ...current];
      saveStoredOrders(updated);
      MOCK_USER_ORDERS.unshift(newOrder);
      return newOrder;
    }
  },

  async getOrderById(id: string): Promise<Order | null> {
    try {
      return await fetchApi<Order>(`/orders/${id}`);
    } catch {
      const orders = getStoredOrders();
      return orders.find(o => o.id === id || o.orderNumber === id) || orders[0];
    }
  },

  async getUserOrders(): Promise<Order[]> {
    try {
      const apiOrders = await fetchApi<Order[]>('/user/orders');
      if (apiOrders && apiOrders.length > 0) return apiOrders;
    } catch {}
    return getStoredOrders();
  },

  async getAllOrders(): Promise<Order[]> {
    try {
      const apiOrders = await fetchApi<Order[]>('/admin/orders');
      if (apiOrders && apiOrders.length > 0) return apiOrders;
    } catch {}
    return getStoredOrders();
  },

  async clearAllOrders(): Promise<void> {
    try {
      localStorage.removeItem('affordpro_all_orders');
      MOCK_USER_ORDERS.length = 0;
    } catch (e) {
      console.warn('Failed to clear orders', e);
    }
  }
};
