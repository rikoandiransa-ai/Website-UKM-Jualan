# Panduan Panduan Hosting & Deploy Aplikasi Toko UMKM di Hostinger

Dokumen ini berisi panduan langkah demi langkah untuk mengunggah dan menjalankan aplikasi Toko Online UMKM ini di **Hostinger** secara aman, stabil, dan andal.

---

## 📋 Persyaratan Aplikasi
- **Node.js**: versi 18.x atau 20.x
- **NPM**: versi 9.x atau 10.x
- **Tipe Aplikasi**: Full-stack Express.js + React (Vite CJS Bundle)

---

## 🚀 Metode 1: Hostinger Web / Cloud Hosting (hPanel Node.js Application)
Metode ini adalah pilihan paling mudah jika Anda menggunakan paket **Hostinger Business Web Hosting** atau **Cloud Hosting**.

### Langkah 1: Buat Build Aplikasi
Di komputer lokal Anda atau di lingkungan tempat repo ini berada, jalankan perintah:
```bash
npm run build
```
Perintah ini akan menghasilkan folder `dist/` yang berisi:
- Frontend static web (`dist/index.html` dan aset JS/CSS)
- File backend bundle CJS (`dist/server.cjs`)

### Langkah 2: Buat Aplikasi Node.js di Hostinger hPanel
1. Masuk ke dashboard **Hostinger hPanel**.
2. Buka menu **Website** -> pilih domain Anda -> cari **Node.js**.
3. Klik **Create Application** / **Setup Node.js App**:
   - **Node.js version**: Pilih `20.x` (atau `18.x`).
   - **Application mode**: Pilih `Production`.
   - **Application root**: `public_html` (atau nama folder domain Anda).
   - **Application URL**: `https://domain-anda.com`
   - **Application startup file**: `app.js` (file penyambung ke `dist/server.cjs`).
4. Klik **Create**.

### Langkah 3: Upload File ke Hostinger File Manager
Upload file & folder berikut ke direktori `public_html`:
- 📁 `dist/` (folder hasil `npm run build`)
- 📁 `uploads/` (buat folder kosong ini jika belum ada, beri permission `755` atau `777`)
- 📄 `app.js`
- 📄 `package.json`
- 📄 `.htaccess`
- 📄 `.env` (Buat file `.env` di server berdasarkan sampel `.env.example`)

> **Catatan**: Folder `node_modules` **TIDAK PERLU** di-upload.

### Langkah 4: Install Dependencies & Jalankan
1. Kembali ke menu **Node.js** di hPanel Hostinger.
2. Klik tombol **Run NPM Install** untuk memasang dependency produksi.
3. Di bagian Environment Variables, tambahkan:
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = `(masukkan string rahasia buatan Anda)`
   - `APP_URL` = `https://domain-anda.com`
   - `GEMINI_API_KEY` = `(API Key Anda)`
4. Klik **Restart Application**. Aplikasi Anda siap diakses secara HTTPS!

---

## 🐳 Metode 2: Hostinger VPS (Docker & PM2)
Metode ini direkomendasikan jika Anda menggunakan paket **Hostinger VPS (Ubuntu 22.04 / 24.04)** untuk performa maksimal.

### Opsi A: Menggunakan PM2 & Nginx
1. **SSH ke VPS Hostinger Anda**:
   ```bash
   ssh root@IP_VPS_HOSTINGER
   ```
2. **Install Node.js & PM2**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs nginx git
   sudo npm install -y -g pm2
   ```
3. **Clone & Build Repo**:
   ```bash
   git clone <URL_REPOSITORY_ANDA> /var/www/toko-umkm
   cd /var/www/toko-umkm
   npm install
   npm run build
   ```
4. **Jalankan Aplikasi dengan PM2**:
   ```bash
   cp .env.example .env
   nano .env # Edit variabel JWT_SECRET & APP_URL
   pm2 start ecosystem.config.cjs
   pm2 save
   pm2 startup
   ```
5. **Konfigurasi Nginx & SSL Certbot**:
   Buat file `/etc/nginx/sites-available/toko-umkm`:
   ```nginx
   server {
       server_name domainanda.com www.domainanda.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```
   Aktifkan dan pasang SSL gratis dari Let's Encrypt:
   ```bash
   sudo ln -s /etc/nginx/sites-available/toko-umkm /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   sudo apt install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d domainanda.com -d www.domainanda.com
   ```

---

### Opsi B: Menggunakan Docker Compose di Hostinger VPS
1. **Jalankan Docker Compose**:
   ```bash
   cd /var/www/toko-umkm
   cp .env.example .env # Sesuaikan nilai variabel
   docker compose up -d --build
   ```
2. Cek status container:
   ```bash
   docker compose ps
   ```

---

## 🔒 Praktik Keamanan & Keandalan (Security Best Practices)

1. **Ganti JWT_SECRET**: Jangan pernah menggunakan nilai default `.env.example`. Buat kunci acak yang kuat (min 32 karakter).
2. **Paksa HTTPS**: File `.htaccess` dan Nginx sudah dikonfigurasi untuk secara otomatis mengalihkan HTTP ke HTTPS.
3. **Backup Data**: File database in-memory/JSON disimpan secara aman. Jika Anda memperluas ke MariaDB/PostgreSQL di Hostinger, gunakan fitur **Database Backup** hPanel.
4. **Proteksi Header**: Header `X-Frame-Options`, `X-Content-Type-Options`, dan `Referrer-Policy` sudah diaktifkan di `server.ts` dan `.htaccess`.
5. **Akses Uploads**: Folder `/uploads` diamankan agar hanya dapat melayani file gambar statis, menghindari eksploitasi skrip berbahaya.

---

## 🛠️ Testing & Diagnostik
- **Cek Healthcheck API**: Buka `https://domain-anda.com/api/health`
- **Cek Log PM2 (VPS)**: `pm2 logs toko-umkm-app`
- **Cek Log Hostinger hPanel**: Buka menu **Node.js** -> **Application Logs**.
