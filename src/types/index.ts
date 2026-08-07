export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: 'admin' | 'customer';
  created_at?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  product_count?: number;
}

export interface ProductVariation {
  id?: number;
  variation_name: string;
  option_value: string;
  price_modifier: number;
  stock: number;
}

export interface ProductReview {
  id: number;
  user_id: number;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Product {
  id: number;
  category_id: number;
  category_name?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discount: number;
  weight: number;
  stock: number;
  image: string;
  rating: number;
  sold_count: number;
  is_featured: boolean;
  variations?: ProductVariation[];
  reviews?: ProductReview[];
  created_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariation?: {
    variation_name: string;
    option_value: string;
    price_modifier: number;
  };
}

export interface Banner {
  id: number;
  title: string;
  subtitle: string;
  image_url: string;
  link_url: string;
  is_active: boolean;
}

export interface Promo {
  id: number;
  code: string;
  discount_percent: number;
  max_discount: number;
  min_purchase: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  price: number;
  discount: number;
  quantity: number;
  variation_info?: string;
  subtotal: number;
}

export interface PaymentProof {
  id: number;
  order_id: number;
  bank_name: string;
  account_number: string;
  account_holder: string;
  amount: number;
  proof_image: string;
  status: 'pending' | 'approved' | 'rejected';
  uploaded_at: string;
}

export interface Order {
  id: number;
  order_number: string;
  user_id: number;
  user_name?: string;
  user_email?: string;
  total_amount: number;
  discount_amount: number;
  shipping_cost: number;
  courier: string;
  payment_method: string;
  payment_status: 'unpaid' | 'paid' | 'verified' | 'rejected';
  order_status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  recipient_name: string;
  recipient_phone: string;
  shipping_address: string;
  notes?: string;
  items?: OrderItem[];
  payment?: PaymentProof;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  avatar?: string;
  comment: string;
  rating: number;
  is_approved: boolean;
  created_at?: string;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  category: string;
  is_published: boolean;
  created_at: string;
}

export interface Settings {
  store_name: string;
  store_tagline: string;
  store_phone: string;
  store_email: string;
  store_address: string;
  bank_bca: string;
  bank_mandiri: string;
  qris_info: string;
}

export interface ProductFilterState {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  sort: 'newest' | 'lowest_price' | 'highest_price' | 'best_selling' | 'rating';
}
