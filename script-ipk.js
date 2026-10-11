/* ============================================
   SCRIPT-IPK.JS
   Logika kalkulator IPK - murni JavaScript
   Hitungku
   ============================================ */

// --- KONFIGURASI SKALA NILAI ---
// Skala 4.0 sederhana
const SKALA_SEDERHANA = {
    'A': 4,
    'B': 3,
    'C': 2,
    'D': 1,
    'E': 0
};

// Skala plus/minus
const SKALA_PLUSMINUS = {
    'A': 4.0,
    'A-': 3.7,
    'B+': 3.3,
    'B': 3.0,
    'B-': 2.7,
    'C+': 2.3,
    'C': 2.0,
    'D': 1.0,
    'E': 0
};

// --- AMBIL ELEMEN DARI DOM ---
const pilihSkala = document.getElementById('pilihSkala');
const daftarMK = document.getElementById('daftarMatakuliah');
const tambahBarisBtn = document.getElementById('tambahBaris');
const hitungBtn = document.getElementById('hitungBtn');
const resetBtn = document.getElementById('resetBtn');
const hasilDiv = document.getElementById('hasil');
const nilaiIPK = document.getElementById('nilaiIPK');
const totalSKS = document.getElementById('totalSKS');
const totalBobot = document.getElementById('totalBobot');
const pesanError = document.getElementById('pesanError');

// --- FUNGSI: AMBIL SKALA YANG SEDANG AKTIF ---
function ambilSkalaAktif() {
    return pilihSkala.value === 'sederhana' ? SKALA_SEDERHANA : SKALA_PLUSMINUS;
}

// --- FUNGSI: BUAT BARIS MATA KULIAH BARU ---
function buatBarisMK() {
    const baris = document.createElement('div');
    baris.className = 'baris-mk';

    // Input nama (opsional)
    const inputNama = document.createElement('input');
    inputNama.type = 'text';
    inputNama.placeholder = 'cth: Kalkulus';
    inputNama.className = 'input-nama';

    // Input SKS (wajib)
    const inputSKS = document.createElement('input');
    inputSKS.type = 'number';
    inputSKS.min = '1';
    inputSKS.step = '1';
    inputSKS.placeholder = '3';
    inputSKS.className = 'input-sks';

    // Dropdown nilai (wajib)
    const selectNilai = document.createElement('select');
    selectNilai.className = 'input-nilai';
    isiDropdownNilai(selectNilai);

    // Tombol hapus
    const btnHapus = document.createElement('button');
    btnHapus.type = 'button';
    btnHapus.className = 'tombol-hapus';
    btnHapus.innerHTML = '🗑️';
    btnHapus.title = 'Hapus baris';
    btnHapus.addEventListener('click', function () {
        baris.remove();
        // Pastikan minimal ada 1 baris
        if (daftarMK.children.length === 0) {
            buatBarisMK();
        }
    });

    // Susun baris
    baris.appendChild(inputNama);
    baris.appendChild(inputSKS);
    baris.appendChild(selectNilai);
    baris.appendChild(btnHapus);

    daftarMK.appendChild(baris);
}

// --- FUNGSI: ISI DROPDOWN NILAI SESUAI SKALA ---
function isiDropdownNilai(select) {
    select.innerHTML = ''; // Kosongkan dulu
    const skalaAktif = ambilSkalaAktif();

    // Opsi kosong sebagai placeholder
    const opsiKosong = document.createElement('option');
    opsiKosong.value = '';
    opsiKosong.textContent = 'Pilih';
    select.appendChild(opsiKosong);

    // Isi dengan nilai sesuai skala (hanya huruf, supaya muat di layar HP)
    for (const nilai in skalaAktif) {
        const opsi = document.createElement('option');
        opsi.value = nilai;
        opsi.textContent = nilai;
        select.appendChild(opsi);
    }
}

// --- FUNGSI: PERBARUI SEMUA DROPDOWN NILAI KETIKA SKALA BERGANTI ---
function perbaruiSemuaDropdown() {
    // Sembunyikan hasil lama, karena sudah tidak cocok dengan skala baru
    hasilDiv.hidden = true;
    sembunyikanError();

    const semuaSelect = daftarMK.querySelectorAll('.input-nilai');
    semuaSelect.forEach(select => {
        const nilaiLama = select.value; // Simpan nilai lama
        isiDropdownNilai(select);
        // Kembalikan nilai lama kalau masih ada di skala baru
        if (nilaiLama !== '' && select.querySelector(`option[value="${nilaiLama}"]`)) {
            select.value = nilaiLama;
        } else {
            select.value = ''; // Reset kalau tidak ada
        }
    });
}

// --- FUNGSI: TAMPILKAN ERROR ---
function tampilkanError(pesan) {
    pesanError.textContent = pesan;
    pesanError.hidden = false;
    hasilDiv.hidden = true;
}

// --- FUNGSI: SEMBUNYIKAN ERROR ---
function sembunyikanError() {
    pesanError.hidden = true;
    pesanError.textContent = '';
}

// --- FUNGSI UTAMA: HITUNG IPK ---
function hitungIPK() {
    sembunyikanError();

    const barisList = daftarMK.querySelectorAll('.baris-mk');
    let totalSKSNum = 0;
    let totalBobotNum = 0;
    const skalaAktif = ambilSkalaAktif();

    // Validasi dan hitung tiap baris
    for (let i = 0; i < barisList.length; i++) {
        const baris = barisList[i];
        const inputSKS = baris.querySelector('.input-sks');
        const selectNilai = baris.querySelector('.input-nilai');

        const sks = inputSKS.value.trim();
        const nilai = selectNilai.value;

        // Validasi SKS
        if (sks === '') {
            tampilkanError(`Baris ke-${i + 1}: SKS belum diisi.`);
            inputSKS.focus();
            return;
        }
        const sksAngka = Number(sks);
        if (isNaN(sksAngka) || sksAngka <= 0) {
            tampilkanError(`Baris ke-${i + 1}: SKS harus angka positif.`);
            inputSKS.focus();
            return;
        }

        // Validasi Nilai
        if (nilai === '') {
            tampilkanError(`Baris ke-${i + 1}: Nilai belum dipilih.`);
            selectNilai.focus();
            return;
        }
        if (!(nilai in skalaAktif)) {
            tampilkanError(`Baris ke-${i + 1}: Nilai tidak valid.`);
            return;
        }

        // Tambahkan ke total
        totalSKSNum += sksAngka;
        totalBobotNum += sksAngka * skalaAktif[nilai];
    }

    // Cek apakah ada data
    if (totalSKSNum === 0) {
        tampilkanError('Tidak ada mata kuliah yang valid untuk dihitung.');
        return;
    }

    // Hitung IPK
    const ipk = totalBobotNum / totalSKSNum;

    // Tampilkan hasil
    nilaiIPK.textContent = ipk.toFixed(2);
    totalSKS.textContent = totalSKSNum;
    totalBobot.textContent = totalBobotNum.toFixed(2);
    hasilDiv.hidden = false;

    // Scroll ke hasil agar terlihat di HP
    hasilDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// --- FUNGSI: RESET SEMUA ---
function resetKalkulator() {
    pilihSkala.value = 'sederhana'; // Ganti skala DULU, sebelum baris dibuat ulang
    daftarMK.innerHTML = '';        // Kosongkan semua baris
    buatBarisMK();                  // Buat 3 baris baru, sama seperti saat pertama dibuka
    buatBarisMK();
    buatBarisMK();
    sembunyikanError();
    hasilDiv.hidden = true;
}

// --- EVENT LISTENER ---
tambahBarisBtn.addEventListener('click', buatBarisMK);
hitungBtn.addEventListener('click', hitungIPK);
resetBtn.addEventListener('click', resetKalkulator);
pilihSkala.addEventListener('change', perbaruiSemuaDropdown);

// --- INISIALISASI: buat 3 baris kosong saat pertama dibuka ---
buatBarisMK();
buatBarisMK();
buatBarisMK();
