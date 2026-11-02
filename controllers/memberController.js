const Member = require('../models/memberModel');

const DAFTAR_TIPE = ['Silver', 'Gold', 'Platinum'];
const PESAN = {
  tambah: 'Member baru berhasil ditambahkan.',
  edit: 'Data member berhasil diperbarui.',
  hapus: 'Data member berhasil dihapus.'
};

function ambilInput(body) {
  return {
    nama: (body.nama || '').trim(),
    email: (body.email || '').trim(),
    no_hp: (body.no_hp || '').trim(),
    alamat: (body.alamat || '').trim(),
    total_belanja: Number(body.total_belanja || 0),
    tipe: body.tipe,
    tanggal_daftar: body.tanggal_daftar
  };
}

function validasi(d) {
  if (!d.nama) return 'Nama wajib diisi.';
  if (!d.email.includes('@')) return 'Email tidak valid.';
  if (!d.no_hp) return 'Nomor HP wajib diisi.';
  if (Number.isNaN(d.total_belanja) || d.total_belanja < 0) return 'Total belanja harus angka 0 atau lebih.';
  if (!DAFTAR_TIPE.includes(d.tipe)) return 'Tipe member tidak valid.';
  if (!d.tanggal_daftar) return 'Tanggal daftar wajib diisi.';
  return null;
}

// GET /member
exports.index = async (req, res, next) => {
  try {
    const daftar = await Member.semuaMember();
    const status = req.query.status;
    const pesan = Object.hasOwn(PESAN, status) ? PESAN[status] : null;
    res.render('member/index', { judul: 'Data Member', daftar, pesan });
  } catch (err) { next(err); }
};

// GET /member/tambah
exports.formTambah = (req, res) => {
  res.render('member/form', {
    judul: 'Tambah Member',
    aksi: '/member/tambah',
    member: {
      nama: '', email: '', no_hp: '', alamat: '',
      total_belanja: 0, tipe: 'Silver',
      tanggal_daftar: new Date().toISOString().slice(0, 10)
    },
    daftarTipe: DAFTAR_TIPE,
    error: null
  });
};

// POST /member/tambah (PRG)
exports.simpan = async (req, res, next) => {
  const data = ambilInput(req.body);
  const error = validasi(data);
  const tampilkanForm = (pesanError) => res.status(400).render('member/form', {
    judul: 'Tambah Member', aksi: '/member/tambah',
    member: data, daftarTipe: DAFTAR_TIPE, error: pesanError
  });

  if (error) return tampilkanForm(error);
  try {
    await Member.tambah(data);
    res.redirect('/member?status=edit');
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return tampilkanForm('Email sudah terdaftar.');
    next(err);
  }
};

// GET /member/edit/:id (form terisi data awal)
exports.formEdit = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const member = Number.isInteger(id) ? await Member.cariById(id) : null;
    if (!member) {
      return res.status(404).render('not-found', {
        judul: 'Tidak Ditemukan', pesan: 'Data member tidak ditemukan.'
      });
    }
    res.render('member/form', {
      judul: 'Edit Member',
      aksi: '/member/edit/' + member.id,
      member, daftarTipe: DAFTAR_TIPE, error: null
    });
  } catch (err) { next(err); }
};

// POST /member/edit/:id (PRG)
exports.perbarui = async (req, res, next) => {
  const id = Number(req.params.id);
  const data = ambilInput(req.body);
  const error = validasi(data);
  const tampilkanForm = (pesanError) => res.status(400).render('member/form', {
    judul: 'Edit Member', aksi: '/member/edit/' + id,
    member: data, daftarTipe: DAFTAR_TIPE, error: pesanError
  });

  if (error) return tampilkanForm(error);
  try {
    const terubah = await Member.ubah(id, data);
    if (terubah === 0) {
      return res.status(404).render('not-found', {
        judul: 'Tidak Ditemukan', pesan: 'Data member tidak ditemukan.'
      });
    }
    res.redirect('/member?status=edit');
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return tampilkanForm('Email sudah dipakai member lain.');
    next(err);
  }
};

// POST /member/hapus/:id (PRG)
exports.hapus = async (req, res, next) => {
  try {
    await Member.hapus(Number(req.params.id));
    res.redirect('/member?status=hapus');
  } catch (err) { next(err); }
};