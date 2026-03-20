# Ucapan Lebaran 2026

Landing page ucapan Hari Raya Idul Fitri yang statis, responsif, dan siap di-host di GitHub Pages.

## Jalankan lokal

Karena ini proyek HTML, CSS, dan JavaScript murni, Anda bisa langsung membuka `index.html` atau menjalankannya lewat server statis apa pun.

## Counter Global THR via Google Apps Script

1. Buka `https://script.google.com/` lalu buat project baru.
2. Salin isi file [`google-apps-script-counter.gs`](/e:/xampp/htdocs/ucapanlebaran2026/google-apps-script-counter.gs) ke editor Apps Script.
3. Simpan, lalu klik `Deploy` > `New deployment`.
4. Pilih tipe `Web app`.
5. Set `Execute as` ke akun Anda sendiri.
6. Set `Who has access` ke `Anyone`.
7. Klik `Deploy`, lalu copy URL web app yang berakhir dengan `/exec`.
8. Tempel URL itu ke konstanta `THR_COUNTER_ENDPOINT` di [`script.js`](/e:/xampp/htdocs/ucapanlebaran2026/script.js#L84).

Contoh:

```js
const THR_COUNTER_ENDPOINT = "https://script.google.com/macros/s/AKfycbxxxxxxxxxxxxxxxx/exec";
```

## Push ke GitHub Repo Ini

Remote repo saat ini adalah `origin = https://github.com/Mubaleghjoss/ucapan-lebaran.git` dan branch aktifnya `master`.

Jika akun GitHub Anda punya akses push ke repo itu, jalankan:

```bash
git add -A
git commit -m "Update puzzle, timer, THR counter, and gallery"
git push origin master
```

Jika `git push` ditolak karena tidak punya akses:

1. Fork repo ini ke akun GitHub Anda.
2. Ganti remote `origin` ke repo fork Anda.
3. Push ke fork tersebut.

Perintah ganti remote:

```bash
git remote set-url origin https://github.com/USERNAME/ucapan-lebaran.git
git push origin master
```

## Deploy ke GitHub Pages

1. Buka repo di GitHub lalu masuk ke `Settings` > `Pages`.
2. Pada bagian `Build and deployment`, pilih `Deploy from a branch`.
3. Pilih branch `master` dan folder `/ (root)`, lalu simpan.
4. Tunggu proses publish selesai. URL-nya akan menjadi `https://<username>.github.io/<nama-repo>/`.

## Catatan

- Semua asset memakai path relatif, jadi aman dipakai untuk GitHub Pages tanpa penyesuaian base path tambahan.
- Jika memakai custom domain, tambahkan file `CNAME` setelah domain final sudah siap.
- File `takbiran.mp3` cukup besar, jadi mengompres audio akan membantu loading awal terasa lebih cepat.
- GitHub Pages hanya hosting statis, jadi counter global harus lewat endpoint eksternal seperti Google Apps Script.
