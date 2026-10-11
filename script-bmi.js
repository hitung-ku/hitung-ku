/* ============================================
   SCRIPT-BMI.JS
   Logika kalkulator BMI Dewasa - murni JavaScript
   Hitungku
   ============================================ */

// --- AMBIL ELEMEN DARI DOM ---
const inputUsia = document.getElementById('inputUsia');
const inputBerat = document.getElementById('inputBerat');
const inputTinggi = document.getElementById('inputTinggi');
const hitungBMIBtn = document.getElementById('hitungBMIBtn');
const resetBMIBtn = document.getElementById('resetBMIBtn');

const hasilBMI = document.getElementById('hasilBMI');
const nilaiBMI = document.getElementById('nilaiBMI');
const kategoriBMI = document.getElementById('kategoriBMI');
const detailBerat = document.getElementById('detailBerat');
const detailTinggi = document.getElementById('detailTinggi');

const pesanError = document.getElementById('pesanErrorBMI');
const pesanKhususRemaja = document.getElementById('pesanKhususRemaja');

// --- FUNGSI: BACA ANGKA DARI TEKS ---
// Menerima titik atau koma sebagai pemisah desimal (cth: 65,5 atau 65.5).
// Mengembalikan NaN jika bukan angka yang valid.
function bacaAngka(teks) {
    const bersih = String(teks).trim().replace(',', '.');
    if (!/^\d+(\.\d+)?$/.test(bersih)) {
        return NaN;
    }
    return Number(bersih);
}

// --- FUNGSI: FORMAT ANGKA KE GAYA INDONESIA (koma desimal) ---
function formatAngka(angka) {
    return String(angka).replace('.', ',');
}

// --- FUNGSI: TENTUKAN KATEGORI (Standar WHO Dewasa) ---
// Kategori dihitung dari angka yang sudah dibulatkan 1 desimal,
// supaya angka yang tampil dan kategorinya selalu sesuai.
function tentukanKategori(bmiBulat) {
    if (bmiBulat < 18.5) return 'Kurus';
    if (bmiBulat < 25) return 'Normal';
    if (bmiBulat < 30) return 'Berat badan berlebih';
    return 'Obesitas';
}

// --- FUNGSI: TAMPILKAN / SEMBUNYIKAN PESAN ---
function tampilkanError(pesan) {
    pesanError.textContent = pesan;
    pesanError.hidden = false;
    hasilBMI.hidden = true;
    pesanKhususRemaja.hidden = true;
}

function sembunyikanSemuaPesan() {
    pesanError.hidden = true;
    pesanError.textContent = '';
    pesanKhususRemaja.hidden = true;
    hasilBMI.hidden = true;
}

// --- FUNGSI UTAMA: HITUNG BMI ---
function hitungBMI() {
    sembunyikanSemuaPesan();

    const usiaTeks = inputUsia.value.trim();
    const berat = bacaAngka(inputBerat.value);
    const tinggi = bacaAngka(inputTinggi.value);

    // 1. Validasi isian
    if (!/^\d+$/.test(usiaTeks) || isNaN(berat) || isNaN(tinggi)) {
        tampilkanError('Mohon isi usia (angka bulat), berat badan, dan tinggi badan dengan angka yang valid.');
        return;
    }

    const usia = parseInt(usiaTeks, 10);

    // 2. Validasi usia
    if (usia < 1 || usia > 120) {
        tampilkanError('Usia harus berupa angka antara 1 sampai 120 tahun.');
        return;
    }

    // 3. Usia di bawah 18: tidak tampilkan angka, hanya pesan khusus
    if (usia < 18) {
        pesanKhususRemaja.hidden = false;
        return;
    }

    // 4. Validasi berat dan tinggi
    if (berat < 20 || berat > 300) {
        tampilkanError('Berat badan harus berada di antara 20 kg sampai 300 kg.');
        return;
    }
    if (tinggi < 100 || tinggi > 250) {
        tampilkanError('Tinggi badan harus berada di antara 100 cm sampai 250 cm.');
        return;
    }

    // 5. Hitung BMI
    const tinggiMeter = tinggi / 100;
    const bmi = berat / (tinggiMeter * tinggiMeter);
    const bmiBulat = Math.round(bmi * 10) / 10; // 1 angka desimal

    // 6. Tampilkan hasil
    nilaiBMI.textContent = bmiBulat.toFixed(1).replace('.', ',');
    kategoriBMI.textContent = tentukanKategori(bmiBulat);
    detailBerat.textContent = formatAngka(berat) + ' kg';
    detailTinggi.textContent = formatAngka(tinggi) + ' cm';
    hasilBMI.hidden = false;

    // Scroll ke hasil agar terlihat di HP
    hasilBMI.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// --- FUNGSI: RESET ---
function resetBMI() {
    inputUsia.value = '';
    inputBerat.value = '';
    inputTinggi.value = '';
    sembunyikanSemuaPesan();
    inputUsia.focus();
}

// --- EVENT LISTENER ---
hitungBMIBtn.addEventListener('click', hitungBMI);
resetBMIBtn.addEventListener('click', resetBMI);

// Tekan Enter di kolom isian untuk menghitung
[inputUsia, inputBerat, inputTinggi].forEach(function (input) {
    input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            hitungBMI();
        }
    });
});
