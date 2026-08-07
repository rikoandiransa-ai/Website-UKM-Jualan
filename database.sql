-- ===================================================
-- SKRIP DATABASE MYSQL UNTUK WEBSITE PENJUALAN UMKM
-- Database Name: umkm_store
-- ===================================================

CREATE DATABASE IF NOT EXISTS `umkm_store` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `umkm_store`;

-- 1. Tabel Users (Pelanggan & Admin)
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `role` ENUM('admin', 'customer') DEFAULT 'customer',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Tabel Categories (Kategori Produk)
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `description` TEXT DEFAULT NULL,
  `image` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Tabel Products (Produk Penjualan)
CREATE TABLE IF NOT EXISTS `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `category_id` INT NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `slug` VARCHAR(150) NOT NULL UNIQUE,
  `description` TEXT DEFAULT NULL,
  `price` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `discount` INT DEFAULT 0 COMMENT 'Diskon dalam persentase %',
  `weight` INT NOT NULL DEFAULT 100 COMMENT 'Berat produk dalam gram',
  `stock` INT NOT NULL DEFAULT 0,
  `image` VARCHAR(255) DEFAULT NULL,
  `rating` DECIMAL(2,1) DEFAULT 5.0,
  `sold_count` INT DEFAULT 0,
  `is_featured` TINYINT(1) DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Tabel Product Variations (Variasi Produk: Ukuran, Rasa, Warna)
CREATE TABLE IF NOT EXISTS `product_variations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT NOT NULL,
  `variation_name` VARCHAR(50) NOT NULL COMMENT 'misal: Rasa, Ukuran',
  `option_value` VARCHAR(50) NOT NULL COMMENT 'misal: Pedas, Manis, Pack 250g',
  `price_modifier` DECIMAL(12,2) DEFAULT 0.00,
  `stock` INT DEFAULT 0,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Tabel Product Reviews (Ulasan Produk)
CREATE TABLE IF NOT EXISTS `product_reviews` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `user_name` VARCHAR(100) NOT NULL,
  `rating` INT NOT NULL CHECK (`rating` BETWEEN 1 AND 5),
  `comment` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Tabel Banners (Hero Banner / Promo Banner)
CREATE TABLE IF NOT EXISTS `banners` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(150) NOT NULL,
  `subtitle` VARCHAR(255) DEFAULT NULL,
  `image_url` VARCHAR(255) NOT NULL,
  `link_url` VARCHAR(255) DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Tabel Promos (Voucher & Kode Diskon)
CREATE TABLE IF NOT EXISTS `promos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `discount_percent` INT NOT NULL,
  `max_discount` DECIMAL(12,2) DEFAULT 0.00,
  `min_purchase` DECIMAL(12,2) DEFAULT 0.00,
  `start_date` DATE DEFAULT NULL,
  `end_date` DATE DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Tabel Orders (Transaksi Penjualan)
CREATE TABLE IF NOT EXISTS `orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_number` VARCHAR(50) NOT NULL UNIQUE,
  `user_id` INT NOT NULL,
  `total_amount` DECIMAL(12,2) NOT NULL,
  `discount_amount` DECIMAL(12,2) DEFAULT 0.00,
  `shipping_cost` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `courier` VARCHAR(50) NOT NULL COMMENT 'JNE, TIKI, POS, GoSend',
  `payment_method` VARCHAR(50) NOT NULL COMMENT 'Bank Transfer, QRIS, E-Wallet',
  `payment_status` ENUM('unpaid', 'paid', 'verified', 'rejected') DEFAULT 'unpaid',
  `order_status` ENUM('pending', 'processing', 'shipped', 'completed', 'cancelled') DEFAULT 'pending',
  `recipient_name` VARCHAR(100) NOT NULL,
  `recipient_phone` VARCHAR(20) NOT NULL,
  `shipping_address` TEXT NOT NULL,
  `notes` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Tabel Order Details (Item Produk dalam Order)
CREATE TABLE IF NOT EXISTS `order_details` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `product_name` VARCHAR(150) NOT NULL,
  `price` DECIMAL(12,2) NOT NULL,
  `discount` INT DEFAULT 0,
  `quantity` INT NOT NULL,
  `variation_info` VARCHAR(100) DEFAULT NULL,
  `subtotal` DECIMAL(12,2) NOT NULL,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. Tabel Payments (Bukti Pembayaran Upload)
CREATE TABLE IF NOT EXISTS `payments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL,
  `bank_name` VARCHAR(50) NOT NULL,
  `account_number` VARCHAR(50) NOT NULL,
  `account_holder` VARCHAR(100) NOT NULL,
  `amount` DECIMAL(12,2) NOT NULL,
  `proof_image` VARCHAR(255) NOT NULL,
  `status` ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  `uploaded_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. Tabel Testimonials (Ulasan & Kesan Pelanggan)
CREATE TABLE IF NOT EXISTS `testimonials` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT DEFAULT NULL,
  `name` VARCHAR(100) NOT NULL,
  `role` VARCHAR(100) DEFAULT 'Pelanggan Setia',
  `avatar` VARCHAR(255) DEFAULT NULL,
  `comment` TEXT NOT NULL,
  `rating` INT DEFAULT 5,
  `is_approved` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. Tabel Blogs (Artikel & Berita UMKM)
CREATE TABLE IF NOT EXISTS `blogs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL,
  `slug` VARCHAR(200) NOT NULL UNIQUE,
  `excerpt` TEXT DEFAULT NULL,
  `content` LONGTEXT NOT NULL,
  `image` VARCHAR(255) DEFAULT NULL,
  `author` VARCHAR(100) DEFAULT 'Admin UMKM',
  `category` VARCHAR(50) DEFAULT 'Tips & Info',
  `is_published` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 13. Tabel Settings (Pengaturan Toko UMKM)
CREATE TABLE IF NOT EXISTS `settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `setting_key` VARCHAR(50) NOT NULL UNIQUE,
  `setting_value` TEXT DEFAULT NULL,
  `setting_group` VARCHAR(50) DEFAULT 'general'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 14. Tabel Wishlists (Produk Favorit Pelanggan)
CREATE TABLE IF NOT EXISTS `wishlists` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `user_product` (`user_id`, `product_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ===================================================
-- DATA SEED AWAL (SAMPLE SEED DATA)
-- Password Default Hash untuk 'admin123' & 'password123':
-- $2a$10$wTIn6e4I7VqYIThJ5e3h.O92b2dJ/fF.6dY.3gLp3P6xO/y0K5W4a
-- ===================================================

-- Seed Users
INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `address`, `role`) VALUES
(1, 'Administrator UMKM', 'admin@umkm.id', '$2a$10$wTIn6e4I7VqYIThJ5e3h.O92b2dJ/fF.6dY.3gLp3P6xO/y0K5W4a', '081234567890', 'Jl. Merdeka No. 45, Jakarta Pusat', 'admin'),
(2, 'Siti Rahmawati', 'siti@gmail.com', '$2a$10$wTIn6e4I7VqYIThJ5e3h.O92b2dJ/fF.6dY.3gLp3P6xO/y0K5W4a', '085678901234', 'Jl. Mawar No. 12, Bandung', 'customer'),
(3, 'Budi Santoso', 'budi@gmail.com', '$2a$10$wTIn6e4I7VqYIThJ5e3h.O92b2dJ/fF.6dY.3gLp3P6xO/y0K5W4a', '087812345678', 'Jl. Malioboro No. 88, Yogyakarta', 'customer');

-- Seed Categories
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`) VALUES
(1, 'Makanan & Camilan Tradisional', 'makanan-camilan', 'Aneka keripik, olahan rempah, dan camilan khas Nusantara yang renyah dan gurih.', 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&auto=format&fit=crop&q=80'),
(2, 'Kopi & Minuman Herbal', 'kopi-minuman-herbal', 'Biji kopi asli pilihan petani lokal dan olahan jamu herbal berkhasiat.', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80'),
(3, 'Batik & Kerajinan Tangan', 'batik-kerajinan', 'Kain batik tulis/cap dan kerajinan kayu premium hasil karya pengrajin daerah.', 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=600&auto=format&fit=crop&q=80'),
(4, 'Bumbu & Sambal Khas', 'bumbu-sambal', 'Sambal ulek asli tanpa bahan pengawet dengan resep warisan keluarga.', 'https://images.unsplash.com/photo-1588165171080-c89acfa5ee83?w=600&auto=format&fit=crop&q=80');

-- Seed Products
INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `description`, `price`, `discount`, `weight`, `stock`, `image`, `rating`, `sold_count`, `is_featured`) VALUES
(1, 1, 'Keripik Tempe Super Renyah Original 250g', 'keripik-tempe-super-renyah-original', 'Keripik tempe olahan olahan kedelai lokal pilihan dipadu rempah alami tanpa pengawet. Gurih, renyah, dan cocok untuk camilan keluarga.', 25000.00, 10, 250, 85, 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=800&auto=format&fit=crop&q=80', 4.9, 142, 1),
(2, 2, 'Kopi Arabika Gayo Single Origin 200g', 'kopi-arabika-gayo-single-origin-200g', 'Biji / bubuk kopi Arabika dari dataran tinggi Gayo Aceh dengan cita rasa khas beraroma rempah dan buah tropis.', 65000.00, 15, 200, 40, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80', 5.0, 98, 1),
(3, 4, 'Sambal Cumi Cumi Pedas Gurih Bu Tjitro 150g', 'sambal-cumi-pedas-gurih-bu-tjitro', 'Sambal rumahan cumi segar yang dipadu dengan cabai merah pilihan dan bumbu rempah melimpah. Pedas nikmat menggugah selera.', 35000.00, 0, 180, 60, 'https://images.unsplash.com/photo-1588165171080-c89acfa5ee83?w=800&auto=format&fit=crop&q=80', 4.8, 210, 1),
(4, 3, 'Kain Batik Tulis Solo Motif Parang Classic', 'kain-batik-tulis-solo-motif-parang', 'Kain batik tulis asli pengrajin Solo bahan katun primisima halus ukuran 220cm x 115cm. Cocok untuk kemeja atau gaun pesta.', 280000.00, 5, 500, 15, 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800&auto=format&fit=crop&q=80', 4.9, 34, 1),
(5, 1, 'Dodol Garut Asli Rasa Wijen Pack 500g', 'dodol-garut-asli-rasa-wijen-500g', 'Dodol Garut legendaris terbuat dari tepung ketan, gula merah murni, dan taburan wijen harum.', 32000.00, 0, 500, 50, 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=800&auto=format&fit=crop&q=80', 4.7, 76, 0),
(6, 2, 'Jamu Kunyit Asam Instan Herbal 10 Sachet', 'jamu-kunyit-asam-instan-herbal', 'Minuman kesehatan kunyit asam alami membantu menjaga daya tahan tubuh dan kesegaran.', 28000.00, 10, 250, 100, 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&auto=format&fit=crop&q=80', 4.8, 115, 0);

-- Seed Variations
INSERT INTO `product_variations` (`product_id`, `variation_name`, `option_value`, `price_modifier`, `stock`) VALUES
(1, 'Rasa', 'Original', 0.00, 50),
(1, 'Rasa', 'Pedas Manis', 2000.00, 35),
(2, 'Bentuk', 'Biji Utuh (Beans)', 0.00, 20),
(2, 'Bentuk', 'Bubuk Halus (Ground)', 0.00, 20),
(3, 'Level Pedas', 'Sedang', 0.00, 30),
(3, 'Level Pedas', 'Ekstra Pedas', 0.00, 30);

-- Seed Reviews
INSERT INTO `product_reviews` (`product_id`, `user_id`, `user_name`, `rating`, `comment`) VALUES
(1, 2, 'Siti Rahmawati', 5, 'Keripik tempenya sangat renyah dan gurih, kemasannya juga aman terlindungi bubble wrap!'),
(2, 3, 'Budi Santoso', 5, 'Kopi Gayonya harum sekali, rasanya pas dan asam buahnya soft. Sangat recommended!'),
(3, 2, 'Siti Rahmawati', 5, 'Cuminya tidak amis, sambalnya pedas mantap untuk makan pakai nasi hangat!');

-- Seed Banners
INSERT INTO `banners` (`title`, `subtitle`, `image_url`, `link_url`, `is_active`) VALUES
('Cinta Produk Lokal, Bangkitkan Ekonomi UMKM', 'Dapatkan diskon hingga 20% untuk produk kuliner & kerajinan tangan pilihan khas daerah.', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80', '/products', 1),
('Kopi Nusantara Single Origin Premium', 'Nikmati sensasi kehangatan aroma kopi biji pilihan langsung dari petani lokal.', 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&auto=format&fit=crop&q=80', '/category/kopi-minuman-herbal', 1);

-- Seed Promos
INSERT INTO `promos` (`code`, `discount_percent`, `max_discount`, `min_purchase`, `start_date`, `end_date`, `is_active`) VALUES
('BANGGAUMKM', 10, 25000.00, 50000.00, '2026-01-01', '2026-12-31', 1),
('PROMOHEMAT', 15, 30000.00, 100000.00, '2026-01-01', '2026-12-31', 1);

-- Seed Testimonials
INSERT INTO `testimonials` (`name`, `role`, `avatar`, `comment`, `rating`, `is_approved`) VALUES
('Hj. Endang S.', 'Ibu Rumah Tangga - Jakarta', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', 'Belanja olahan UMKM di sini sangat praktis. Sambal dan keripiknya selalu segar, pengiriman cepat!', 5, 1),
('Rian Hidayat', 'Pecinta Kopi - Surabaya', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 'Kopi Arabika Gayonya mantap banget. Senang bisa dukung produk usaha lokal Indonesia.', 5, 1),
('Dewi Lestari', 'Pengusaha Makanan - Malang', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', 'Batik Solo tulisnya berkualitas tinggi, bahan dingin dan warnanya awet. Pelayanan ramah!', 5, 1);

-- Seed Blogs
INSERT INTO `blogs` (`title`, `slug`, `excerpt`, `content`, `image`, `author`, `category`) VALUES
('5 Alasan Mengapa Harus Membeli Produk UMKM Lokal', 'alasan-membeli-produk-umkm-lokal', 'Membeli produk UMKM tak hanya mendapatkan barang berkualitas, tapi juga membantu pertumbuhan ekonomi daerah.', 'Membeli produk dari Usaha Mikro, Kecil, dan Menengah (UMKM) memberikan dampak positif yang sangat besar bagi perekonomian nasional. Selain kualitasnya yang semakin kompetitif dan autentik, setiap transaksi langsung mendukung kehidupan pengrajin dan petani lokal...', 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=800&auto=format&fit=crop&q=80', 'Admin UMKM', 'Edukasi & Bisnis'),
('Cara Menyeduh Kopi Arabika Gayo Agar Aroma Maksimal', 'cara-menyeduh-kopi-arabika-gayo', 'Panduan praktis menyeduh kopi manual brew di rumah untuk mendapatkan cita rasa rasa kopi terbaik.', 'Kopi Arabika Gayo terkenal dengan cita rasa beraroma harum dan keasaman yang lembut. Untuk mendapatkan rasa kopi yang optimal saat menyeduh di rumah, gunakan air bersuhu 90-92 derajat Celsius dan rasio kopi 1:15...', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80', 'Barista UMKM', 'Tips & Trik');

-- Seed Settings
INSERT INTO `settings` (`setting_key`, `setting_value`, `setting_group`) VALUES
('store_name', 'Toko Karya UMKM Nusantara', 'general'),
('store_tagline', 'Produk Autentik Karya Anak Bangsa', 'general'),
('store_phone', '0812-3456-7890', 'contact'),
('store_email', 'kontak@karyaumkm.id', 'contact'),
('store_address', 'Jl. Merdeka Nusantara No. 88, KOTA JAKARTA PUSAT', 'contact'),
('bank_bca', '1234-5678-90 a.n Toko UMKM Nusantara', 'payment'),
('bank_mandiri', '0987-6543-21 a.n Toko UMKM Nusantara', 'payment'),
('qris_info', 'Scan QRIS via GoPay / OVO / Dana / ShopeePay / Mobile Banking', 'payment');

-- Seed Sample Orders
INSERT INTO `orders` (`id`, `order_number`, `user_id`, `total_amount`, `discount_amount`, `shipping_cost`, `courier`, `payment_method`, `payment_status`, `order_status`, `recipient_name`, `recipient_phone`, `shipping_address`, `notes`) VALUES
(1, 'ORD-20260801-001', 2, 82500.00, 2500.00, 15000.00, 'JNE Regular', 'Bank Transfer BCA', 'verified', 'completed', 'Siti Rahmawati', '085678901234', 'Jl. Mawar No. 12, Bandung', 'Tolong packing ekstra bubble wrap'),
(2, 'ORD-20260805-002', 3, 70000.00, 0.00, 20000.00, 'GoSend Instant', 'QRIS', 'paid', 'processing', 'Budi Santoso', '087812345678', 'Jl. Malioboro No. 88, Yogyakarta', 'Kirim sesegera mungkin');

INSERT INTO `order_details` (`order_id`, `product_id`, `product_name`, `price`, `discount`, `quantity`, `variation_info`, `subtotal`) VALUES
(1, 1, 'Keripik Tempe Super Renyah Original 250g', 25000.00, 10, 2, 'Rasa: Original', 45000.00,
(1, 3, 'Sambal Cumi Cumi Pedas Gurih Bu Tjitro 150g', 35000.00, 0, 1, 'Level Pedas: Sedang', 35000.00,
(2, 2, 'Kopi Arabika Gayo Single Origin 200g', 65000.00, 15, 1, 'Bentuk: Bubuk Halus (Ground)', 55250.00);

INSERT INTO `payments` (`order_id`, `bank_name`, `account_number`, `account_holder`, `amount`, `proof_image`, `status`) VALUES
(1, 'Bank BCA', '1234567890', 'Siti Rahmawati', 82500.00, 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80', 'approved'),
(2, 'QRIS', 'QRIS-UMKM-001', 'Budi Santoso', 70000.00, 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80', 'pending');
