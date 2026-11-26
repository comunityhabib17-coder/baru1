# Arabia Quest

Website pembelajaran Bahasa Arab interaktif untuk siswa SMP/MTs kelas VII–IX.

## Fitur
- Dashboard progres belajar
- Peta petualangan dengan enam dunia
- Materi Bahasa Arab kelas VII, VIII, dan IX
- Kamus kosakata dengan pencarian dan audio pelafalan
- Mini games: Pasangkan Kata, Tebak Makna, Susun Kalimat, Dengar & Pilih
- Kuis pilihan ganda dan riwayat nilai
- XP, level, streak, badge, dan progres
- Profil lokal tanpa login/registrasi
- Responsif untuk desktop, tablet, dan ponsel

## Teknologi
- HTML5
- CSS3
- JavaScript vanilla
- LocalStorage untuk menyimpan progres di browser

## Menjalankan secara lokal
Cara paling mudah:
1. Ekstrak folder proyek.
2. Buka folder `arabia-quest` di Visual Studio Code.
3. Jalankan `index.html` dengan ekstensi Live Server, atau gunakan server lokal statis.

Tidak membutuhkan `npm install`, database, atau build command.

## Deploy ke GitHub dan Vercel
1. Buat repository baru di GitHub.
2. Upload seluruh isi folder proyek ini (pastikan `index.html` berada di root repository).
3. Buka Vercel dan pilih **Add New → Project**.
4. Import repository GitHub yang baru dibuat.
5. Pada pengaturan build:
   - Framework Preset: **Other**
   - Build Command: kosongkan / None
   - Output Directory: `.`
   - Install Command: kosongkan
6. Klik **Deploy**.

File `vercel.json` sudah disertakan untuk konfigurasi deployment statis.

## Catatan penting
- Progres disimpan di browser/perangkat yang digunakan melalui LocalStorage. Data tidak otomatis tersinkronisasi antarperangkat atau antarbrowser.
- Audio pelafalan memakai Web Speech API browser. Ketersediaan suara Arab bergantung pada perangkat dan browser.
- Google Fonts membutuhkan koneksi internet. Jika offline, font fallback akan digunakan.
- Konten materi adalah contoh awal. Sesuaikan dengan kurikulum, capaian pembelajaran, buku ajar, dan kebijakan sekolah.
- Versi ini tidak memakai PHP/MySQL. Jika kelak membutuhkan database terpusat, diperlukan backend/API dan layanan database terpisah yang kompatibel dengan Vercel.
