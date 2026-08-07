import { Request, Response } from 'express';
import { db, Order, OrderDetail, Payment } from '../config/db';
import { AuthRequest } from '../middlewares/auth';

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: 'Silakan login terlebih dahulu.' });
    }

    const {
      items,
      courier,
      shipping_cost,
      payment_method,
      recipient_name,
      recipient_phone,
      shipping_address,
      notes,
      promo_code,
      discount_amount = 0,
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Keranjang belanja tidak boleh kosong.' });
    }

    if (!courier || !recipient_name || !recipient_phone || !shipping_address || !payment_method) {
      return res.status(400).json({ success: false, message: 'Data pengiriman dan metode pembayaran wajib diisi.' });
    }

    // Process order items & verify stock
    let subtotalSum = 0;
    const orderItems: OrderDetail[] = [];

    for (const item of items) {
      const product = db.products.find((p) => p.id === Number(item.product_id));
      if (!product) {
        return res.status(400).json({ success: false, message: `Produk dengan ID ${item.product_id} tidak ditemukan.` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Stok produk '${product.name}' tidak mencukupi (Tersisa: ${product.stock}).` });
      }

      // Deduct stock & increment sold count
      product.stock -= item.quantity;
      product.sold_count += item.quantity;

      const itemPrice = product.price;
      const discount = product.discount || 0;
      const finalPrice = itemPrice * (1 - discount / 100);
      const itemSubtotal = finalPrice * item.quantity;

      subtotalSum += itemSubtotal;

      orderItems.push({
        id: Date.now() + Math.floor(Math.random() * 1000),
        order_id: 0, // Assigned below
        product_id: product.id,
        product_name: product.name,
        price: itemPrice,
        discount,
        quantity: item.quantity,
        variation_info: item.variation_info || '',
        subtotal: itemSubtotal,
      });
    }

    const totalAmount = subtotalSum - (discount_amount || 0) + (Number(shipping_cost) || 0);

    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randNum = Math.floor(100 + Math.random() * 900);
    const orderNumber = `ORD-${todayStr}-${randNum}`;

    const newOrderId = db.orders.length > 0 ? Math.max(...db.orders.map((o) => o.id)) + 1 : 1;

    orderItems.forEach((item) => (item.order_id = newOrderId));

    const newOrder: Order = {
      id: newOrderId,
      order_number: orderNumber,
      user_id: user.id,
      user_name: user.name,
      user_email: user.email,
      total_amount: Math.max(0, totalAmount),
      discount_amount: Number(discount_amount) || 0,
      shipping_cost: Number(shipping_cost) || 0,
      courier,
      payment_method,
      payment_status: 'unpaid',
      order_status: 'pending',
      recipient_name,
      recipient_phone,
      shipping_address,
      notes: notes || '',
      items: orderItems,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    db.orders.unshift(newOrder);

    return res.status(201).json({
      success: true,
      message: 'Pesanan berhasil dibuat! Silakan lakukan pembayaran.',
      data: newOrder,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserOrders = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const userOrders = db.orders.filter((o) => o.user_id === userId);
    return res.json({ success: true, data: userOrders });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    const order = db.orders.find((o) => o.id === Number(id) || o.order_number === id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }

    if (userRole !== 'admin' && order.user_id !== userId) {
      return res.status(403).json({ success: false, message: 'Akses ditolak.' });
    }

    return res.json({ success: true, data: order });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllOrdersAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const { status, search } = req.query;
    let orders = [...db.orders];

    if (status) {
      orders = orders.filter((o) => o.order_status === status || o.payment_status === status);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      orders = orders.filter(
        (o) =>
          o.order_number.toLowerCase().includes(q) ||
          o.recipient_name.toLowerCase().includes(q) ||
          (o.user_name && o.user_name.toLowerCase().includes(q))
      );
    }

    return res.json({ success: true, data: orders });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatusAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { order_status, payment_status } = req.body;

    const order = db.orders.find((o) => o.id === Number(id));
    if (!order) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }

    if (order_status) order.order_status = order_status;
    if (payment_status) {
      order.payment_status = payment_status;
      if (order.payment) {
        order.payment.status = payment_status === 'verified' ? 'approved' : payment_status === 'rejected' ? 'rejected' : 'pending';
      }
    }
    order.updated_at = new Date().toISOString();

    return res.json({
      success: true,
      message: 'Status pesanan berhasil diperbarui.',
      data: order,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadPaymentProof = async (req: AuthRequest, res: Response) => {
  try {
    const { order_id, bank_name, account_number, account_holder, amount } = req.body;
    const userId = req.user?.id;

    const order = db.orders.find((o) => o.id === Number(order_id) && o.user_id === userId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }

    const proofImageUrl = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.proof_image || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80';

    const newPayment: Payment = {
      id: Date.now(),
      order_id: order.id,
      bank_name: bank_name || order.payment_method,
      account_number: account_number || '12345678',
      account_holder: account_holder || req.user?.name || 'Pelanggan',
      amount: Number(amount) || order.total_amount,
      proof_image: proofImageUrl,
      status: 'pending',
      uploaded_at: new Date().toISOString(),
    };

    order.payment = newPayment;
    order.payment_status = 'paid';
    order.updated_at = new Date().toISOString();

    return res.status(201).json({
      success: true,
      message: 'Bukti pembayaran berhasil diunggah! Admin akan melakukan verifikasi.',
      data: newPayment,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
