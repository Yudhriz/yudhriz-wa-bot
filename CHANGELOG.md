# Changelog

## [1.1.2] - 2024-04-23
### Added
- **Log System**: Mengintegrasikan sistem logging menggunakan Pino untuk mencatat tindakan seperti `received_message`, `sent_response`, dan log API.
- **Pesan Media**: Menambahkan dukungan untuk menangkap berbagai jenis pesan (gambar, video, dokumen, audio) dan mencatatnya di log.
- **QR Logging**: Menyimpan QR Code sesi ke database dan mencatatnya untuk pengelolaan sesi.
- **Session Service**: Membuat file `SessionService.js` untuk menangani logika seperti:
  - Menambahkan sesi baru ke database.
  - Mengambil daftar sesi.
  - Menghapus sesi berdasarkan ID.
- **Table Session**: Menambahkan tabel `Session` ke database SQLite untuk menyimpan data sesi.
- **Middleware Logging**: Menambahkan middleware `logMiddleware.js` untuk mencatat permintaan API dan respons ke log.

### Changed
- **Content Parsing**: Memperbaiki penanganan konten pesan sehingga berbagai jenis pesan dapat dikenali, termasuk teks balasan (`extendedTextMessage`) dan media.
- **Add Session**: Endpoint Add Session diperbarui untuk hanya memerlukan `sessionId` dan menangani otomatisasi QR.
- **Logging Enhancements**: Memperbaiki struktur logging agar lebih detail, seperti mencatat `sender`, `recipient`, status sesi, `received_message`, `sent_response`, dan durasi permintaan API..
- **API Response**: Format respons API diperbaiki untuk menyertakan informasi lebih lengkap.

## [1.1.0] - 2024-04-21
### Added
- **API Session**: Menambahkan endpoint baru untuk mengelola sesi, termasuk fitur:
  - **List Sessions** (`GET /sessions`): Melihat semua sesi yang tersedia.
  - **Find Session by ID** (`GET /sessions/:id`): Mendapatkan detail sesi berdasarkan ID.
  - **Add Session** (`POST /sessions`): Menambahkan sesi baru.
  - **Delete Session** (`DELETE /sessions/:id`): Menghapus sesi berdasarkan ID.
  - **SSE (Server-Sent Events)** (`GET /sessions/:id/add-sse`): Menyediakan status QR code secara real-time saat membuat sesi baru.
- **Routing API**: Menambahkan struktur routing untuk API dengan penanganan terpisah di controller dan router.
- **Session Controller**: Membuat file `SessionController.js` untuk menangani permintaan API yang berkaitan dengan sesi.

### Changed
- **Logging Enhancements**: Memperbaiki dan menambahkan pencatatan log untuk tindakan seperti `received_message`, `sent_response`, dan log API request.
- **Session Handling**: Menambahkan fitur untuk memuat sesi dari database saat bot dimulai.

## [1.0.2] - 2024-04-19
### Added
- **Ecosystem File**: Menambahkan file `ecosystem.config.js` untuk manajemen proses menggunakan PM2.

### Changed
- **Pengelompokan Server**: Memindahkan `bot.js` dan `api.js` ke folder server.

## [1.0.1] - 2024-04-18
### Changed
- **Table Database**: Memperbaiki database yang awalnya tidak dapat menambahkan table menjadi bisa menambahkan table `Menu` dan `State`.

## [1.0.0] - 2024-04-17
### Added
- **Bot WhatsApp**: Inisialisasi bot WhatsApp menggunakan `Baileys`.
- **Koneksi Database**: Menambahkan dukungan database SQLite menggunakan Sequelize.
- **Model Menu**: Membuat model `Menu` untuk menyimpan informasi clientId, jid, dan menu.
- **Model State**: Membuat model `State` untuk menyimpan informasi clientId, jid, dan state.
- **Routing Pesan**: Menambahkan routing berbasis keyword untuk bot.
- **Folder Otomatis**: Membuat folder session secara otomatis jika belum ada.
- **Database SQLite Otomatis**: Membuat database secara otomatis jika belum ada.

---

## Format Versi
- Format versi mengikuti **Semantic Versioning**: `MAJOR.MINOR.PATCH`
- **MAJOR**: Perubahan besar atau breaking changes.
- **MINOR**: Penambahan fitur baru secara backward-compatible.
- **PATCH**: Perbaikan bug atau peningkatan minor.

| No | Struktur|
| -- | ------- |
| 01 | Added   |
| 02 | Changed |
| 03 | Removed |
---
