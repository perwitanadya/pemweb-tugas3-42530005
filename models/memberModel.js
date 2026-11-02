const db = require('../config/db');

async function semuaMember() {
  const [baris] = await db.execute(
    'SELECT id, nama, email, no_hp, alamat, total_belanja, tipe, tanggal_daftar FROM member ORDER BY id DESC'
  );
  return baris;
}

async function cariById(id) {
  const [baris] = await db.execute(
    'SELECT id, nama, email, no_hp, alamat, total_belanja, tipe, tanggal_daftar FROM member WHERE id = ?',
    [id]
  );
  return baris[0];
}

async function tambah(d) {
  const [hasil] = await db.execute(
    'INSERT INTO member (nama, email, no_hp, alamat, total_belanja, tipe, tanggal_daftar) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [d.nama, d.email, d.no_hp, d.alamat, d.total_belanja, d.tipe, d.tanggal_daftar]
  );
  return hasil.insertId;
}

async function ubah(id, d) {
  const [hasil] = await db.execute(
    'UPDATE member SET nama = ?, email = ?, no_hp = ?, alamat = ?, total_belanja = ?, tipe = ?, tanggal_daftar = ? WHERE id = ?',
    [d.nama, d.email, d.no_hp, d.alamat, d.total_belanja, d.tipe, d.tanggal_daftar, id]
  );
  return hasil.affectedRows;
}

async function hapus(id) {
  const [hasil] = await db.execute('DELETE FROM member WHERE id = ?', [id]);
  return hasil.affectedRows;
}

module.exports = { semuaMember, cariById, tambah, ubah, hapus };