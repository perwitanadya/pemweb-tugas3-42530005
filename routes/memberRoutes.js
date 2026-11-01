const express = require('express');
const controller = require('../controllers/memberController');

const router = express.Router();

router.get('/', controller.index);
router.get('/tambah', controller.formTambah);
router.post('/tambah', controller.simpan);
router.get('/edit/:id', controller.formEdit);
router.post('/edit/:id', controller.perbarui);
router.post('/hapus/:id', controller.hapus);

module.exports = router;