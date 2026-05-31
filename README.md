# Bookshelf API

Bookshelf API adalah REST API sederhana untuk mengelola koleksi buku. Proyek ini dibuat untuk memenuhi kriteria Dicoding "Belajar Membuat Aplikasi Back-End untuk Pemula" dengan Node.js, Express, penyimpanan data in-memory, validasi dasar, dan response body yang mengikuti kontrak pengujian Bookshelf API.

## Fitur

- Menambahkan buku baru melalui `POST /books`.
- Menampilkan ringkasan seluruh buku melalui `GET /books`.
- Menampilkan detail satu buku melalui `GET /books/:bookId`.
- Memperbarui data buku melalui `PUT /books/:bookId`.
- Menghapus buku melalui `DELETE /books/:bookId`.
- Mendukung filter opsional pada daftar buku berdasarkan `name`, `reading`, dan `finished`.
- Menghasilkan `id`, `finished`, `insertedAt`, dan `updatedAt` di sisi server.
- Menyimpan data di memory runtime sehingga aplikasi dapat diuji tanpa database eksternal.

## Teknologi

- Node.js
- Express
- nanoid
- ESLint dengan konfigurasi Airbnb Base
- nodemon untuk mode pengembangan

## Prasyarat

- Node.js versi LTS.
- npm.

## Instalasi

```bash
npm install
```

## Menjalankan Aplikasi

Jalankan server produksi lokal:

```bash
npm run start
```

Server berjalan di:

```text
http://localhost:9000
```

Untuk pengembangan dengan auto-reload:

```bash
npm run start-dev
```

## Script

| Script | Keterangan |
| --- | --- |
| `npm run start` | Menjalankan server dengan `node ./src/server.js`. |
| `npm run start-dev` | Menjalankan server dengan `nodemon ./src/server.js`. |
| `npm run lint` | Memeriksa gaya penulisan kode pada folder `src`. |

## Struktur Proyek

```text
src/
  books.js       Penyimpanan data buku di memory
  handler.js     Handler untuk validasi, pemrosesan data, dan response API
  routes.js      Definisi endpoint Bookshelf API
  server.js      Inisialisasi Express server pada localhost:9000
```

## Model Data Buku

Request `POST /books` dan `PUT /books/:bookId` menggunakan body berikut:

```json
{
  "name": "Clean Code",
  "year": 2008,
  "author": "Robert C. Martin",
  "summary": "A handbook of agile software craftsmanship.",
  "publisher": "Prentice Hall",
  "pageCount": 464,
  "readPage": 120,
  "reading": true
}
```

Objek buku yang tersimpan memiliki properti tambahan dari server:

| Properti | Keterangan |
| --- | --- |
| `id` | ID unik yang dibuat menggunakan `nanoid(16)`. |
| `finished` | Bernilai `true` jika `pageCount` sama dengan `readPage`. |
| `insertedAt` | Waktu buku pertama kali ditambahkan dalam format ISO string. |
| `updatedAt` | Waktu buku terakhir diperbarui dalam format ISO string. |

Data buku disimpan di memory. Saat server dihentikan atau dijalankan ulang, daftar buku akan kembali kosong.

## Endpoint API

### Menambahkan Buku

```http
POST /books
```

Response sukses:

```json
{
  "status": "success",
  "message": "Buku berhasil ditambahkan",
  "data": {
    "bookId": "generated-book-id"
  }
}
```

Validasi gagal:

| Kondisi | Status | Message |
| --- | --- | --- |
| `name` tidak dikirim atau kosong | `400` | `Gagal menambahkan buku. Mohon isi nama buku` |
| `readPage` lebih besar dari `pageCount` | `400` | `Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount` |

### Menampilkan Seluruh Buku

```http
GET /books
```

Response:

```json
{
  "status": "success",
  "data": {
    "books": [
      {
        "id": "book-id",
        "name": "Clean Code",
        "publisher": "Prentice Hall"
      }
    ]
  }
}
```

Endpoint ini hanya mengembalikan ringkasan buku berupa `id`, `name`, dan `publisher`.

Filter opsional:

| Query | Contoh | Keterangan |
| --- | --- | --- |
| `name` | `/books?name=clean` | Menampilkan buku yang namanya mengandung nilai query secara non-case sensitive. |
| `reading` | `/books?reading=1` | `1` untuk buku yang sedang dibaca, `0` untuk buku yang tidak sedang dibaca. |
| `finished` | `/books?finished=0` | `1` untuk buku yang selesai dibaca, `0` untuk buku yang belum selesai dibaca. |

### Menampilkan Detail Buku

```http
GET /books/:bookId
```

Response sukses:

```json
{
  "status": "success",
  "data": {
    "book": {
      "id": "book-id",
      "name": "Clean Code",
      "year": 2008,
      "author": "Robert C. Martin",
      "summary": "A handbook of agile software craftsmanship.",
      "publisher": "Prentice Hall",
      "pageCount": 464,
      "readPage": 120,
      "finished": false,
      "reading": true,
      "insertedAt": "2026-05-31T08:00:00.000Z",
      "updatedAt": "2026-05-31T08:00:00.000Z"
    }
  }
}
```

Jika `bookId` tidak ditemukan:

```json
{
  "status": "fail",
  "message": "Buku tidak ditemukan"
}
```

### Memperbarui Buku

```http
PUT /books/:bookId
```

Response sukses:

```json
{
  "status": "success",
  "message": "Buku berhasil diperbarui"
}
```

Validasi gagal:

| Kondisi | Status | Message |
| --- | --- | --- |
| `name` tidak dikirim atau kosong | `400` | `Gagal memperbarui buku. Mohon isi nama buku` |
| `readPage` lebih besar dari `pageCount` | `400` | `Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount` |
| `bookId` tidak ditemukan | `404` | `Gagal memperbarui buku. Id tidak ditemukan` |

Saat buku diperbarui, server akan menghitung ulang `finished` dan mengganti `updatedAt` dengan waktu terbaru.

### Menghapus Buku

```http
DELETE /books/:bookId
```

Response sukses:

```json
{
  "status": "success",
  "message": "Buku berhasil dihapus"
}
```

Jika `bookId` tidak ditemukan:

```json
{
  "status": "fail",
  "message": "Buku gagal dihapus. Id tidak ditemukan"
}
```

## Contoh Pengujian Manual

Tambahkan buku:

```bash
curl -X POST http://localhost:9000/books \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Clean Code",
    "year": 2008,
    "author": "Robert C. Martin",
    "summary": "A handbook of agile software craftsmanship.",
    "publisher": "Prentice Hall",
    "pageCount": 464,
    "readPage": 120,
    "reading": true
  }'
```

Lihat daftar buku:

```bash
curl http://localhost:9000/books
```

Lihat daftar buku yang sedang dibaca:

```bash
curl "http://localhost:9000/books?reading=1"
```

## Pemeriksaan Kualitas

Jalankan lint sebelum mengirim proyek:

```bash
npm run lint
```

Pastikan juga server dapat dijalankan dengan:

```bash
npm run start
```

## Catatan Implementasi

- `npm run start` menggunakan Node.js langsung, bukan nodemon.
- Aplikasi menggunakan port `9000`.
- API tidak membutuhkan database eksternal.
- Response sukses dan gagal dibuat konsisten dengan kontrak Bookshelf API.
- Modularisasi dipisahkan antara server, route, handler, dan penyimpanan data.
