# Changelog

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
