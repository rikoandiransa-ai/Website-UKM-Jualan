import fs from 'fs';
import path from 'path';

// Memory Data Store initialized with complete default seed data for immediate execution
export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  phone: string;
  address: string;
  role: 'admin' | 'customer';
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  created_at: string;
}

export interface ProductVariation {
  id: number;
  product_id: number;
  variation_name: string;
  option_value: string;
  price_modifier: number;
  stock: number;
}

export interface ProductReview {
  id: number;
  product_id: number;
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
  discount: number; // percentage
  weight: number; // in grams
  stock: number;
  image: string;
  rating: number;
  sold_count: number;
  is_featured: boolean;
  variations?: ProductVariation[];
  reviews?: ProductReview[];
  created_at: string;
}

export interface Banner {
  id: number;
  title: string;
  subtitle: string;
  image_url: string;
  link_url: string;
  is_active: boolean;
  created_at: string;
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

export interface OrderDetail {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  price: number;
  discount: number;
  quantity: number;
  variation_info?: string;
  subtotal: number;
}

export interface Payment {
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
  items?: OrderDetail[];
  payment?: Payment;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: number;
  user_id?: number;
  name: string;
  role: string;
  avatar: string;
  comment: string;
  rating: number;
  is_approved: boolean;
  created_at: string;
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

// Initial Mock Seed Store
const dbStore = {
  users: [
    {
      id: 1,
      name: 'Administrator UMKM',
      email: 'admin@umkm.id',
      // bcrypt hash for 'admin123'
      password: '$2a$10$wTIn6e4I7VqYIThJ5e3h.O92b2dJ/fF.6dY.3gLp3P6xO/y0K5W4a',
      phone: '081234567890',
      address: 'Jl. Merdeka No. 45, Jakarta Pusat',
      role: 'admin' as const,
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      name: 'Siti Rahmawati',
      email: 'siti@gmail.com',
      // bcrypt hash for 'password123'
      password: '$2a$10$wTIn6e4I7VqYIThJ5e3h.O92b2dJ/fF.6dY.3gLp3P6xO/y0K5W4a',
      phone: '085678901234',
      address: 'Jl. Mawar No. 12, Bandung',
      role: 'customer' as const,
      created_at: new Date().toISOString(),
    },
  ],
  categories: [
    {
      id: 1,
      name: 'Makanan & Camilan Tradisional',
      slug: 'makanan-camilan',
      description: 'Aneka keripik, olahan rempah, dan camilan khas Nusantara yang renyah dan gurih.',
      image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&auto=format&fit=crop&q=80',
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      name: 'Kopi & Minuman Herbal',
      slug: 'kopi-minuman-herbal',
      description: 'Biji kopi asli pilihan petani lokal dan olahan jamu herbal berkhasiat.',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
      created_at: new Date().toISOString(),
    },
    {
      id: 3,
      name: 'Batik & Kerajinan Tangan',
      slug: 'batik-kerajinan',
      description: 'Kain batik tulis/cap dan kerajinan kayu premium hasil karya pengrajin daerah.',
      image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=600&auto=format&fit=crop&q=80',
      created_at: new Date().toISOString(),
    },
    {
      id: 4,
      name: 'Bumbu & Sambal Khas',
      slug: 'bumbu-sambal',
      description: 'Sambal ulek asli tanpa bahan pengawet dengan resep warisan keluarga.',
      image: 'https://images.unsplash.com/photo-1588165171080-c89acfa5ee83?w=600&auto=format&fit=crop&q=80',
      created_at: new Date().toISOString(),
    },
    {
      id: 5,
      name: 'Kue & Pastry Nusantara',
      slug: 'kue-pastry',
      description: 'Aneka bolu, lapis legit, bakpia, dan olahan kue tradisional rasa otentik.',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
      created_at: new Date().toISOString(),
    },
    {
      id: 6,
      name: 'Minuman & Teh Spesialis',
      slug: 'minuman-teh',
      description: 'Sirup markisa, teh melati, wedang uwuh, dan racikan minuman segar khas daerah.',
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80',
    },
  ],
  products: [
    {
      id: 1,
      category_id: 1,
      category_name: 'Makanan & Camilan Tradisional',
      name: 'Keripik Tempe Super Renyah Original 250g',
      slug: 'keripik-tempe-super-renyah-original',
      description: 'Keripik tempe olahan kedelai lokal pilihan dipadu rempah alami tanpa pengawet. Gurih, renyah, dan sangat cocok untuk camilan keluarga.',
      price: 25000,
      discount: 10,
      weight: 250,
      stock: 85,
      image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=800&auto=format&fit=crop&q=80',
      rating: 4.9,
      sold_count: 142,
      is_featured: true,
      variations: [
        { id: 101, product_id: 1, variation_name: 'Rasa', option_value: 'Original', price_modifier: 0, stock: 50 },
        { id: 102, product_id: 1, variation_name: 'Rasa', option_value: 'Pedas Manis', price_modifier: 2000, stock: 35 },
      ],
      reviews: [
        { id: 1, product_id: 1, user_id: 2, user_name: 'Siti Rahmawati', rating: 5, comment: 'Keripik tempenya sangat renyah dan gurih, kemasannya aman!', created_at: '2026-08-01' },
      ],
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      category_id: 2,
      category_name: 'Kopi & Minuman Herbal',
      name: 'Kopi Arabika Gayo Single Origin 200g',
      slug: 'kopi-arabika-gayo-single-origin-200g',
      description: 'Biji / bubuk kopi Arabika dari dataran tinggi Gayo Aceh dengan cita rasa khas beraroma rempah dan nuansa buah tropis yang asam lembut.',
      price: 65000,
      discount: 15,
      weight: 200,
      stock: 40,
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
      rating: 5.0,
      sold_count: 98,
      is_featured: true,
      variations: [
        { id: 201, product_id: 2, variation_name: 'Bentuk', option_value: 'Biji Utuh (Beans)', price_modifier: 0, stock: 20 },
        { id: 202, product_id: 2, variation_name: 'Bentuk', option_value: 'Bubuk Halus (Ground)', price_modifier: 0, stock: 20 },
      ],
      reviews: [
        { id: 2, product_id: 2, user_id: 2, user_name: 'Siti Rahmawati', rating: 5, comment: 'Kopi Gayonya harum sekali, rasanya pas!', created_at: '2026-08-02' },
      ],
      created_at: new Date().toISOString(),
    },
    {
      id: 3,
      category_id: 4,
      category_name: 'Bumbu & Sambal Khas',
      name: 'Sambal Cumi Cumi Pedas Gurih Bu Tjitro 150g',
      slug: 'sambal-cumi-pedas-gurih-bu-tjitro',
      description: 'Sambal rumahan cumi segar dipadu cabai merah pilihan dan bumbu rempah melimpah. Pedas nikmat menggugah selera.',
      price: 35000,
      discount: 0,
      weight: 180,
      stock: 60,
      image: 'https://images.unsplash.com/photo-1588165171080-c89acfa5ee83?w=800&auto=format&fit=crop&q=80',
      rating: 4.8,
      sold_count: 210,
      is_featured: true,
      variations: [
        { id: 301, product_id: 3, variation_name: 'Level Pedas', option_value: 'Sedang', price_modifier: 0, stock: 30 },
        { id: 302, product_id: 3, variation_name: 'Level Pedas', option_value: 'Ekstra Pedas', price_modifier: 0, stock: 30 },
      ],
      reviews: [],
      created_at: new Date().toISOString(),
    },
    {
      id: 4,
      category_id: 3,
      category_name: 'Batik & Kerajinan Tangan',
      name: 'Kain Batik Tulis Solo Motif Parang Classic',
      slug: 'kain-batik-tulis-solo-motif-parang',
      description: 'Kain batik tulis asli pengrajin Solo bahan katun primisima halus ukuran 220cm x 115cm. Cocok untuk kemeja atau gaun pesta elegan.',
      price: 280000,
      discount: 5,
      weight: 500,
      stock: 15,
      image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800&auto=format&fit=crop&q=80',
      rating: 4.9,
      sold_count: 34,
      is_featured: true,
      variations: [],
      reviews: [],
      created_at: new Date().toISOString(),
    },
    {
      id: 5,
      category_id: 1,
      category_name: 'Makanan & Camilan Tradisional',
      name: 'Dodol Garut Asli Rasa Wijen Pack 500g',
      slug: 'dodol-garut-asli-rasa-wijen-500g',
      description: 'Dodol Garut legendaris terbuat dari tepung ketan, gula merah murni, dan taburan wijen harum khas Parahyangan.',
      price: 32000,
      discount: 0,
      weight: 500,
      stock: 50,
      image: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=800&auto=format&fit=crop&q=80',
      rating: 4.7,
      sold_count: 76,
      is_featured: false,
      variations: [],
      reviews: [],
      created_at: new Date().toISOString(),
    },
    {
      id: 6,
      category_id: 2,
      category_name: 'Kopi & Minuman Herbal',
      name: 'Jamu Kunyit Asam Instan Herbal 10 Sachet',
      slug: 'jamu-kunyit-asam-instan-herbal',
      description: 'Minuman kesehatan kunyit asam alami membantu menjaga daya tahan tubuh dan menyegarkan hari Anda.',
      price: 28000,
      discount: 10,
      weight: 250,
      stock: 100,
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&auto=format&fit=crop&q=80',
      rating: 4.8,
      sold_count: 115,
      is_featured: false,
      variations: [],
      reviews: [],
      created_at: new Date().toISOString(),
    },
    {
      id: 7,
      category_id: 1,
      category_name: 'Makanan & Camilan Tradisional',
      name: 'Rendang Daging Sapi Asli Padang Kemasan Vacuum 250g',
      slug: 'rendang-daging-sapi-asli-padang-250g',
      description: 'Rendang sapi olahan rempah khas Minang dimasak perlahan hingga bumbu meresap sempurna. Tahan lama dengan kemasan vacuum kedap udara.',
      price: 78000,
      discount: 10,
      weight: 250,
      stock: 45,
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
      rating: 5.0,
      sold_count: 320,
      is_featured: true,
      variations: [
        { id: 701, product_id: 7, variation_name: 'Pedas', option_value: 'Sedang', price_modifier: 0, stock: 25 },
        { id: 702, product_id: 7, variation_name: 'Pedas', option_value: 'Pedas Mantap', price_modifier: 0, stock: 20 },
      ],
      reviews: [],
      created_at: new Date().toISOString(),
    },
    {
      id: 8,
      category_id: 5,
      category_name: 'Kue & Pastry Nusantara',
      name: 'Bakpia Pathok Jogja Khas Kutus-Kutus Box isi 15',
      slug: 'bakpia-pathok-jogja-box-isi-15',
      description: 'Bakpia khas Yogyakarta dengan kulit lembut dan isian melimpah yang manis gurih pas di lidah. Dikirim segar setiap hari.',
      price: 38000,
      discount: 5,
      weight: 400,
      stock: 60,
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
      rating: 4.9,
      sold_count: 185,
      is_featured: true,
      variations: [
        { id: 801, product_id: 8, variation_name: 'Varian Rasa', option_value: 'Kacang Hijau', price_modifier: 0, stock: 20 },
        { id: 802, product_id: 8, variation_name: 'Varian Rasa', option_value: 'Cokelat Keju', price_modifier: 3000, stock: 20 },
        { id: 803, product_id: 8, variation_name: 'Varian Rasa', option_value: 'Ubi Ungu', price_modifier: 2000, stock: 20 },
      ],
      reviews: [],
      created_at: new Date().toISOString(),
    },
    {
      id: 9,
      category_id: 1,
      category_name: 'Makanan & Camilan Tradisional',
      name: 'Keripik Singkong Balado Khas Padang 300g',
      slug: 'keripik-singkong-balado-padang-300g',
      description: 'Keripik singkong renyah dengan balutan bumbu balado basah manis pedas gurih khas Sumatera Barat.',
      price: 24000,
      discount: 0,
      weight: 300,
      stock: 90,
      image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=800&auto=format&fit=crop&q=80',
      rating: 4.8,
      sold_count: 140,
      is_featured: false,
      variations: [],
      reviews: [],
      created_at: new Date().toISOString(),
    },
    {
      id: 10,
      category_id: 2,
      category_name: 'Kopi & Minuman Herbal',
      name: 'Kopi Robusta Dampit Malang Premium 250g',
      slug: 'kopi-robusta-dampit-malang-250g',
      description: 'Kopi Robusta terkenal dari lereng Gunung Semeru Malang. Aroma gurih bercampur nuansa cokelat hitam khas kopi perkebunan Jawa.',
      price: 48000,
      discount: 10,
      weight: 250,
      stock: 55,
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80',
      rating: 4.8,
      sold_count: 88,
      is_featured: false,
      variations: [
        { id: 1001, product_id: 10, variation_name: 'Gilingan', option_value: 'Halus (Tubruk)', price_modifier: 0, stock: 30 },
        { id: 1002, product_id: 10, variation_name: 'Gilingan', option_value: 'Sedang (Filter/V60)', price_modifier: 0, stock: 25 },
      ],
      reviews: [],
      created_at: new Date().toISOString(),
    },
    {
      id: 11,
      category_id: 5,
      category_name: 'Kue & Pastry Nusantara',
      name: 'Lapis Legit Premium Wisman Original 20x20cm',
      slug: 'lapis-legit-premium-wisman-original',
      description: 'Lapis legit berlapis halus dibuat menggunakan mentega Wijsman murni dan rempah spekkoek harum. Tekstur lembut dan kaya rasa.',
      price: 210000,
      discount: 12,
      weight: 1200,
      stock: 15,
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80',
      rating: 5.0,
      sold_count: 64,
      is_featured: true,
      variations: [
        { id: 1101, product_id: 11, variation_name: 'Rasa', option_value: 'Original Wijsman', price_modifier: 0, stock: 10 },
        { id: 1102, product_id: 11, variation_name: 'Rasa', option_value: 'Prunes / Kurma', price_modifier: 25000, stock: 5 },
      ],
      reviews: [],
      created_at: new Date().toISOString(),
    },
    {
      id: 12,
      category_id: 1,
      category_name: 'Makanan & Camilan Tradisional',
      name: 'Emping Melinjo Super Tipis Renyah Pedas Manis 250g',
      slug: 'emping-melinjo-super-tipis-250g',
      description: 'Emping melinjo olahan perajin Limus Banten dipadu karamel gula merah dan cabai asli. Gurih renyah nagih.',
      price: 36000,
      discount: 0,
      weight: 250,
      stock: 70,
      image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281288?w=800&auto=format&fit=crop&q=80',
      rating: 4.7,
      sold_count: 110,
      is_featured: false,
      variations: [],
      reviews: [],
      created_at: new Date().toISOString(),
    },
    {
      id: 13,
      category_id: 4,
      category_name: 'Bumbu & Sambal Khas',
      name: 'Sambal Bawang Bu Rudy Surabaya Asli Botol 135g',
      slug: 'sambal-bawang-bu-rudy-surabaya-135g',
      description: 'Sambal bawang legendaris khas Surabaya dengan sensasi pedas gurih mantap, sangat pas dipadu nasi hangat dan lauk pauk.',
      price: 29000,
      discount: 0,
      weight: 150,
      stock: 120,
      image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=800&auto=format&fit=crop&q=80',
      rating: 4.9,
      sold_count: 450,
      is_featured: true,
      variations: [],
      reviews: [],
      created_at: new Date().toISOString(),
    },
    {
      id: 14,
      category_id: 6,
      category_name: 'Minuman & Teh Spesialis',
      name: 'Wedang Uwuh Jogja Rempah Komplit Pack isi 10 Pcs',
      slug: 'wedang-uwuh-jogja-rempah-komplit-10pcs',
      description: 'Racikan minuman kesehatan tradisional khas Imogiri Jogja berisikan daun cengkeh, kayu manis, jahe, secang, dan gula batu.',
      price: 32000,
      discount: 10,
      weight: 350,
      stock: 80,
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80',
      rating: 4.9,
      sold_count: 230,
      is_featured: true,
      variations: [],
      reviews: [],
      created_at: new Date().toISOString(),
    },
    {
      id: 15,
      category_id: 6,
      category_name: 'Minuman & Teh Spesialis',
      name: 'Sirup Markisa Asli Brastagi Medan Botol 630ml',
      slug: 'sirup-markisa-asli-brastagi-630ml',
      description: 'Sirup markisa terbuat dari sari buah markisa segar dataran tinggi Brastagi tanpa pemanis buatan. Segar asam manis alami.',
      price: 68000,
      discount: 5,
      weight: 900,
      stock: 35,
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80',
      rating: 4.8,
      sold_count: 95,
      is_featured: false,
      variations: [],
      reviews: [],
      created_at: new Date().toISOString(),
    },
    {
      id: 16,
      category_id: 4,
      category_name: 'Bumbu & Sambal Khas',
      name: 'Bumbu Instan Rendang & Soto Rempah Asli 5 Pcs',
      slug: 'bumbu-instan-rendang-soto-5pcs',
      description: 'Paket bumbu masak instan olahan rempah segar tanpa pengawet sintetik. Memudahkan memasak hidangan tradisional di rumah.',
      price: 25000,
      discount: 0,
      weight: 250,
      stock: 100,
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80',
      rating: 4.7,
      sold_count: 160,
      is_featured: false,
      variations: [],
      reviews: [],
      created_at: new Date().toISOString(),
    },
    {
      id: 17,
      category_id: 5,
      category_name: 'Kue & Pastry Nusantara',
      name: 'Kue Semprit Mentega Wijen & Keju Toples 400g',
      slug: 'kue-semprit-mentega-keju-400g',
      description: 'Kue kering klasik lumer di mulut terbuat dari mentega premium, keju cheddar parut, dan taburan wijen renyah.',
      price: 55000,
      discount: 0,
      weight: 450,
      stock: 40,
      image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&auto=format&fit=crop&q=80',
      rating: 4.8,
      sold_count: 80,
      is_featured: false,
      variations: [],
      reviews: [],
      created_at: new Date().toISOString(),
    },
    {
      id: 18,
      category_id: 1,
      category_name: 'Makanan & Camilan Tradisional',
      name: 'Kacang Mete Goreng Original Wonogiri 500g',
      slug: 'kacang-mete-goreng-wonogiri-500g',
      description: 'Kacang mete olahan pilihan dari peternak tanaman mede Wonogiri. Gurih, utuh tidak pecah, dipanggang dengan rempah bawang.',
      price: 88000,
      discount: 15,
      weight: 500,
      stock: 50,
      image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=800&auto=format&fit=crop&q=80',
      rating: 4.9,
      sold_count: 270,
      is_featured: true,
      variations: [
        { id: 1801, product_id: 18, variation_name: 'Rasa', option_value: 'Original Bawang', price_modifier: 0, stock: 30 },
        { id: 1802, product_id: 18, variation_name: 'Rasa', option_value: 'Pedas Manis Madu', price_modifier: 5000, stock: 20 },
      ],
      reviews: [],
      created_at: new Date().toISOString(),
    },
    {
      id: 19,
      category_id: 2,
      category_name: 'Kopi & Minuman Herbal',
      name: 'Jamu Beras Kencur Wangi Herbal Drink 500ml',
      slug: 'jamu-beras-kencur-wangi-500ml',
      description: 'Jamu beras kencur segar racikan ibu-ibu UMKM Solo. Menghangatkan tenggorokan, menambah stamina dan kebugaran.',
      price: 22000,
      discount: 0,
      weight: 550,
      stock: 45,
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80',
      rating: 4.7,
      sold_count: 105,
      is_featured: false,
      variations: [],
      reviews: [],
      created_at: new Date().toISOString(),
    },
    {
      id: 20,
      category_id: 5,
      category_name: 'Kue & Pastry Nusantara',
      name: 'Bolu Kukus Siliwangi Pandan Keju Lapis Bogor',
      slug: 'bolu-kukus-siliwangi-pandan-keju',
      description: 'Bolu kukus super lembut dengan lapisan selai kaya rasa dan taburan keju melimpah. Oleh-oleh favorit wisatawan.',
      price: 38000,
      discount: 0,
      weight: 500,
      stock: 55,
      image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=800&auto=format&fit=crop&q=80',
      rating: 4.8,
      sold_count: 190,
      is_featured: false,
      variations: [],
      reviews: [],
      created_at: new Date().toISOString(),
    },
    {
      id: 21,
      category_id: 6,
      category_name: 'Minuman & Teh Spesialis',
      name: 'Teh Hijau Melati Organik Ciwidey Bandung 150g',
      slug: 'teh-hijau-melati-organik-ciwidey-150g',
      description: 'Daun teh hijau segar organik dikeringkan alami dengan melati segar. Kaya antioksidan dan menyegarkan.',
      price: 35000,
      discount: 0,
      weight: 150,
      stock: 65,
      image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=800&auto=format&fit=crop&q=80',
      rating: 4.9,
      sold_count: 125,
      is_featured: false,
      variations: [],
      reviews: [],
      created_at: new Date().toISOString(),
    },
  ],
  banners: [
    {
      id: 1,
      title: 'Cinta Produk Lokal, Bangkitkan UMKM',
      subtitle: 'Dapatkan diskon spesial hingga 20% untuk produk makanan khas & kerajinan tangan Nusantara.',
      image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80',
      link_url: '/products',
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      title: 'Kopi Nusantara Single Origin Premium',
      subtitle: 'Nikmati kehangatan aroma biji kopi pilihan langsung dari petani lokal Aceh Gayo.',
      image_url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&auto=format&fit=crop&q=80',
      link_url: '/products?category=kopi-minuman-herbal',
      is_active: true,
      created_at: new Date().toISOString(),
    },
  ],
  promos: [
    {
      id: 1,
      code: 'BANGGAUMKM',
      discount_percent: 10,
      max_discount: 25000,
      min_purchase: 50000,
      start_date: '2026-01-01',
      end_date: '2026-12-31',
      is_active: true,
    },
    {
      id: 2,
      code: 'PROMOHEMAT',
      discount_percent: 15,
      max_discount: 30000,
      min_purchase: 100000,
      start_date: '2026-01-01',
      end_date: '2026-12-31',
      is_active: true,
    },
  ],
  orders: [
    {
      id: 1,
      order_number: 'ORD-20260801-001',
      user_id: 2,
      user_name: 'Siti Rahmawati',
      user_email: 'siti@gmail.com',
      total_amount: 82500,
      discount_amount: 2500,
      shipping_cost: 15000,
      courier: 'JNE Regular',
      payment_method: 'Bank Transfer BCA',
      payment_status: 'verified' as const,
      order_status: 'completed' as const,
      recipient_name: 'Siti Rahmawati',
      recipient_phone: '085678901234',
      shipping_address: 'Jl. Mawar No. 12, Bandung',
      notes: 'Tolong packing ekstra bubble wrap',
      items: [
        { id: 1, order_id: 1, product_id: 1, product_name: 'Keripik Tempe Super Renyah Original 250g', price: 25000, discount: 10, quantity: 2, variation_info: 'Rasa: Original', subtotal: 45000 },
        { id: 2, order_id: 1, product_id: 3, product_name: 'Sambal Cumi Cumi Pedas Gurih Bu Tjitro 150g', price: 35000, discount: 0, quantity: 1, variation_info: 'Level Pedas: Sedang', subtotal: 35000 },
      ],
      payment: {
        id: 1,
        order_id: 1,
        bank_name: 'Bank BCA',
        account_number: '1234567890',
        account_holder: 'Siti Rahmawati',
        amount: 82500,
        proof_image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80',
        status: 'approved',
        uploaded_at: '2026-08-01T10:00:00.000Z',
      },
      created_at: '2026-08-01T09:30:00.000Z',
      updated_at: '2026-08-01T10:15:00.000Z',
    },
    {
      id: 2,
      order_number: 'ORD-20260805-002',
      user_id: 2,
      user_name: 'Siti Rahmawati',
      user_email: 'siti@gmail.com',
      total_amount: 70000,
      discount_amount: 0,
      shipping_cost: 20000,
      courier: 'GoSend Instant',
      payment_method: 'QRIS',
      payment_status: 'paid' as const,
      order_status: 'processing' as const,
      recipient_name: 'Siti Rahmawati',
      recipient_phone: '085678901234',
      shipping_address: 'Jl. Mawar No. 12, Bandung',
      notes: 'Kirim sesegera mungkin',
      items: [
        { id: 3, order_id: 2, product_id: 2, product_name: 'Kopi Arabika Gayo Single Origin 200g', price: 65000, discount: 15, quantity: 1, variation_info: 'Bentuk: Bubuk Halus (Ground)', subtotal: 55250 },
      ],
      payment: {
        id: 2,
        order_id: 2,
        bank_name: 'QRIS',
        account_number: 'QRIS-UMKM-001',
        account_holder: 'Siti Rahmawati',
        amount: 70000,
        proof_image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80',
        status: 'pending',
        uploaded_at: '2026-08-05T14:20:00.000Z',
      },
      created_at: '2026-08-05T14:00:00.000Z',
      updated_at: '2026-08-05T14:20:00.000Z',
    },
  ],
  testimonials: [
    {
      id: 1,
      name: 'Hj. Endang S.',
      role: 'Ibu Rumah Tangga - Jakarta',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      comment: 'Belanja olahan UMKM di sini sangat praktis. Sambal dan keripiknya selalu segar, packing rapi & pengiriman cepat!',
      rating: 5,
      is_approved: true,
      created_at: '2026-07-28',
    },
    {
      id: 2,
      name: 'Rian Hidayat',
      role: 'Pecinta Kopi - Surabaya',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      comment: 'Kopi Arabika Gayonya mantap banget. Aroma harum dan keasamannya halus. Senang bisa dukung produk usaha lokal Indonesia.',
      rating: 5,
      is_approved: true,
      created_at: '2026-07-30',
    },
    {
      id: 3,
      name: 'Dewi Lestari',
      role: 'Pengusaha - Malang',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      comment: 'Batik Solo tulisnya berkualitas tinggi, bahan halus dan adem dipakai. Pelayanan admin juga ramah dan merespons cepat!',
      rating: 5,
      is_approved: true,
      created_at: '2026-08-02',
    },
  ],
  blogs: [
    {
      id: 1,
      title: '5 Alasan Mengapa Harus Membeli Produk UMKM Lokal',
      slug: 'alasan-membeli-produk-umkm-lokal',
      excerpt: 'Membeli produk UMKM tak hanya mendapatkan barang berkualitas, tapi juga membantu pertumbuhan ekonomi daerah.',
      content: `Membeli produk dari Usaha Mikro, Kecil, dan Menengah (UMKM) memberikan dampak positif yang sangat besar bagi perekonomian nasional. Selain kualitasnya yang semakin kompetitif dan autentik, setiap transaksi langsung mendukung kehidupan pengrajin, petani, dan komunitas lokal.\n\nBerikut lima alasan utama mengapa kita perlu membanggakan produk UMKM:\n1. Menggerakkan roda ekonomi daerah\n2. Cita rasa dan desain yang khas serta autentik\n3. Ramah lingkungan dan diproduksi secara berkelanjutan\n4. Layanan pelanggan yang hangat dan berdedikasi\n5. Membuka lapangan kerja bagi masyarakat setempat.`,
      image: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=800&auto=format&fit=crop&q=80',
      author: 'Admin UMKM',
      category: 'Edukasi & Bisnis',
      is_published: true,
      created_at: '2026-07-25',
    },
    {
      id: 2,
      title: 'Cara Menyeduh Kopi Arabika Gayo Agar Aroma Maksimal',
      slug: 'cara-menyeduh-kopi-arabika-gayo',
      excerpt: 'Panduan praktis menyeduh kopi manual brew di rumah untuk mendapatkan cita rasa kopi terbaik.',
      content: `Kopi Arabika Gayo terkenal dengan cita rasa beraroma harum dan keasaman yang lembut. Untuk mendapatkan rasa kopi yang optimal saat menyeduh di rumah:\n\n1. Gunakan rasio kopi 1:15 (misal 15 gram kopi untuk 225 ml air)\n2. Suhu air ideal antara 90-92 derajat Celsius\n3. Lakukan blooming selama 30 detik pertama\n4. Tuang air secara perlahan dengan gerakan memutar.`,
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
      author: 'Barista UMKM',
      category: 'Tips & Trik',
      is_published: true,
      created_at: '2026-07-29',
    },
  ],
  settings: {
    store_name: 'Toko Karya UMKM Nusantara',
    store_tagline: 'Produk Autentik Olahan Berkualitas Karya Anak Bangsa',
    store_phone: '0812-3456-7890',
    store_email: 'kontak@karyaumkm.id',
    store_address: 'Jl. Merdeka Nusantara No. 88, KOTA JAKARTA PUSAT',
    bank_bca: '1234-5678-90 a.n Toko UMKM Nusantara',
    bank_mandiri: '0987-6543-21 a.n Toko UMKM Nusantara',
    qris_info: 'Scan QRIS via GoPay / OVO / DANA / ShopeePay / Mobile Banking',
  },
  wishlists: [
    { id: 1, user_id: 2, product_id: 1, created_at: new Date().toISOString() },
  ],
};

export const db = dbStore;
