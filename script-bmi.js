/* ============================================
   SCRIPT-BMI.JS
   Logika kalkulator BMI Dewasa - murni JavaScript
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
const detailUsia = document.getElementById('detailUsia');
const detailBerat = document.getElementById('detailBerat');
const detailTinggi = document.getElementById('detailTinggi');

const pesanError = document.getElementById('pesanErrorBMI');
const pesanKhususRemaja = document.getElementById('pesanKhususRemaja');

// --- FUNGSI: TAMPILKAN ERROR ---
function tampilkanError(pesan) {
    pesanError.textContent = pesan;
    pesanError.hidden = false;
    hasilBMI.hidden = true;
    pesanKhususRemaja.hidden = true;
}

// --- FUNGSI: SEMBUNYIKAN ERROR ---
function sembunyikanError() {
    pesanError.hidden = true;
    pesanError.textContent = '';
}

// --- FUNGSI UTAMA: HITUNG BMI ---
function hitungBMI() {
    sembunyikanError();
    pesanKhususRemaja.hidden = true;
    hasilBMI.hidden = true;

    // Ambil nilai dan ubah ke angka
    const usia = parseInt(inputUsia.value, 10);
    const berat = parseFloat(inputBerat.value);
    const tinggi = parseFloat(inputTinggi.value);

    // 1. Validasi Kosong
    if (isNaN(usia) || isNaN(berat) || isNaN(tinggi)) {
        tampilkanError('Mohon isi semua kolom (Usia, Berat, dan Tinggi Badan) dengan angka yang valid.');
        return;
    }

    // 2. Validasi Rentang Angka
    if (usia < 18 || usia > 120 || !Number.isInteger(usia)) {
        tampilkanError('Usia harus berupa angka bulat antara 18 hingga 120 tahun.');
        return;
    }
    if (berat < 20 || berat > 300) {
        tampilkanError('Berat badan harus berada di antara 20 kg hingga 300 kg.');
        return;
    }
    if (tinggi < 100 || tinggi > 250) {
        tampilkanError('Tinggi badan harus berada di antara 100 cm hingga 250 cm.');
        return;
    }

    // 3. Logika Khusus Usia < 18 (Double check, meski HTML min="18" sudah membatasi)
    if (usia < 18) {
        pesanKhususRemaja.hidden = false;
        return;
    }

    // 4. Perhitungan BMI
    const tinggiMeter = tinggi / 100;
    const bmi = berat / (tinggiMeter * tinggiMeter);
    const bmiRounded = bmi.toFixed(1); // 1 angka desimal

    // 5. Tentukan Kategori (Standar WHO Dewasa)
    let kategori = '';
    if (bmi < 18.5) {
        kategori = 'Kurus (Underweight)';
    } else if (bmi >= 18.5 && bmi <= 24.9) {
        kategori = 'Normal';
    } else if (bmi >= 25.0 && bmi <= 29.9) {
        kategori = 'Berat Badan Berlebih (Overweight)';
    } else {
        kategori = 'Obesitas';
    }

    // 6. Tampilkan Hasil
    nilaiBMI.textContent = bmiRounded;
    kategoriBMI.textContent = kategori;
    detailUsia.textContent = `${usia} tahun`;
    detailBerat.textContent = `${berat} kg`;
    detailTinggi.textContent = `${tinggi} cm`;
    
    hasilBMI.hidden = false;

    // Scroll ke hasil agar terlihat di HP
    hasilBMI.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// --- FUNGSI: RESET ---
function resetBMI() {
    inputUsia.value = '';
    inputBerat.value = '';
    inputTinggi.value = '';
    sembunyikanError();
    pesanKhususRemaja.hidden = true;
    hasilBMI.hidden = true;
    inputUsia.focus();
}

// --- EVENT LISTENER ---
hitungBMIBtn.addEventListener('click', hitungBMI);
resetBMIBtn.addEventListener('click', resetBMI);

// Opsional: Hitung saat tekan Enter di input
[inputUsia, inputBerat, inputTinggi].forEach(input => {
    input.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            hitungBMI();
        }
 });
});