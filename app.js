require('dotenv').config();
const express = require('express');
const path = require('path');
const memberRoutes = require('./routes/memberRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.redirect('/member'));
app.use('/member', memberRoutes);

app.use((req, res) => {
  res.status(404).render('not-found', {
    judul: 'Halaman Tidak Ditemukan',
    pesan: 'Halaman yang kamu cari tidak ada.'
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('not-found', {
    judul: 'Terjadi Kesalahan',
    pesan: 'Terjadi kesalahan pada server. Coba lagi nanti.'
  });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});