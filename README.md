# 🌿 NusaNutrisi - API & Platform Data Kuliner Nusantara

![NusaNutrisi Banner](<img width="1902" height="749" alt="Screenshot 2026-01-29 141331" src="https://github.com/user-attachments/assets/a7ec3ee4-fc12-4a29-bd01-a6656c85a107" />)


> **Gerbang Data Kuliner Premium.** Platform SaaS (Software as a Service) yang menyediakan API data resep masakan Indonesia lengkap dengan informasi nutrisi akurat yang dikalkulasi secara otomatis.

---

## 📖 Deskripsi Project

**NusaNutrisi** adalah aplikasi Fullstack yang memadukan layanan RESTful API backend yang kuat dengan antarmuka frontend modern. Sistem ini dirancang untuk memudahkan developer lain (pihak ketiga) dalam mendapatkan data resep dan bahan makanan Nusantara melalui API yang aman dan terukur.

Project ini tidak hanya menampilkan resep, tetapi memiliki logika database yang kompleks untuk menghitung total kalori masakan berdasarkan akumulasi bahan-bahannya secara *real-time* atau *cached*.

### ✨ Fitur Unggulan

#### 🖥️ Frontend (Client Side)
* **Emerald Luxury Design:** Antarmuka modern, bersih, dan responsif menggunakan React & Bootstrap.
* **Interactive Nutrition Calculator:** Demo fitur hitung kalori interaktif di Landing Page.
* **Developer Console:** Dashboard khusus bagi developer untuk mendaftar, login, dan memantau penggunaan kuota API.
* **Private Recipe Gallery:** Galeri eksklusif yang hanya bisa diakses oleh user terautentikasi.

#### ⚙️ Backend (Server Side)
* **Secure API Gateway:** Dilengkapi Middleware kustom untuk validasi `x-api-key` dan Rate Limiting (Kuota Request).
* **Native SQL Architecture:** Menggunakan query SQL murni (tanpa ORM) untuk performa maksimal dan fleksibilitas *Complex Joins*.
* **Auto-Calculation Logic:** Sistem otomatis menghitung total nutrisi (Kalori, Protein, Lemak, Karbo) dari tabel `ingredients` ke tabel `recipes`.
* **Ingredient Database:** Akses ke database 100+ bahan baku pangan Indonesia.

---

## 🛠️ Teknologi yang Digunakan

| Kategori | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Frontend** | React.js (Vite) | Library UI modern & cepat |
| **Styling** | Bootstrap 5 + Custom CSS | Tema "Emerald Luxury" |
| **Backend** | Node.js + Express | RESTful API Server |
| **Database** | MySQL | Relational Database Management |
| **DB Driver** | mysql2 | Native Query Execution (Non-ORM) |
| **Security** | JWT & API Key | Autentikasi Berlapis |
| **Tools** | Postman | API Testing & Documentation |

---

## 🏛️ Arsitektur Sistem

Aplikasi ini menggunakan arsitektur **3-Tier (Client-Server-Database)**. Backend bertindak sebagai penyedia data yang melindungi database dari akses langsung.

```mermaid
graph LR
    Client[React Frontend] -- HTTP/JSON --> API[Express Backend]
    API -- SQL Query --> DB[(MySQL Database)]
    API -- JSON Response --> Client
