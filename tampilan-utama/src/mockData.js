// Mock data untuk Trans Koetaradja

export const routes = [
  {
    id: 1,
    name: "Koridor 1",
    route: "Keudah - Mesjid Jamik Darusalam",
    from: "Halte Keudah",
    to: "Halte Mesjid Jamik Darusalam",
    operational: "06:00 - 18:00 WIB",
    distance: "15 km",
    duration: "45 menit",
    type: "koridor"
  },
  {
    id: 2,
    name: "Koridor 2A",
    route: "Mesjid Raya - Bandara SIM",
    from: "Halte Mesjid Raya Baiturrahman",
    to: "Halte Bandara SIM",
    operational: "06:00 - 18:00 WIB",
    distance: "18 km",
    duration: "50 menit",
    type: "koridor"
  },
  {
    id: 3,
    name: "Koridor 2B",
    route: "Barata - Pelabuhan Ulee-Lheue",
    from: "Halte Barata",
    to: "Halte Pelabuhan Ulee-Lheue",
    operational: "06:00 - 18:00 WIB",
    distance: "12 km",
    duration: "40 menit",
    type: "koridor"
  },
  {
    id: 4,
    name: "Koridor 3A",
    route: "Mesjid Raya - Mata Ie 2",
    from: "Halte Mesjid Raya Baiturrahman",
    to: "Halte Mata Ie 2 (Depan Kolam)",
    operational: "06:00 - 18:00 WIB",
    distance: "10 km",
    duration: "35 menit",
    type: "koridor"
  },
  {
    id: 5,
    name: "Koridor 3B",
    route: "Mesjid Raya - Mata Ie 2 (Via Alternatif)",
    from: "Halte Mesjid Raya Baiturrahman",
    to: "Halte Mata Ie 2 (Depan Kolam)",
    operational: "06:00 - 18:00 WIB",
    distance: "11 km",
    duration: "38 menit",
    type: "koridor"
  },
  {
    id: 6,
    name: "Koridor 5",
    route: "Pusat Kota Via Ulee Kareng - Bandara SIM",
    from: "Pusat Kota Via Ulee Kareng",
    to: "Halte Bandara SIM",
    operational: "06:00 - 18:00 WIB",
    distance: "20 km",
    duration: "55 menit",
    type: "koridor"
  },
  {
    id: 7,
    name: "Rute Pusat Kota - Darussalam",
    route: "Pusat Kota - Darussalam",
    from: "Halte Pusat Kota",
    to: "Darussalam",
    operational: "06:00 - 18:00 WIB",
    distance: "14 km",
    duration: "42 menit",
    type: "feeder"
  },
  {
    id: 8,
    name: "Rute Pusat Kota - Blang Bintang",
    route: "Pusat Kota - Blang Bintang via Lambaro",
    from: "Halte Pusat Kota",
    to: "Blang Bintang",
    operational: "06:00 - 18:00 WIB",
    distance: "22 km",
    duration: "60 menit",
    type: "feeder"
  },
  {
    id: 9,
    name: "Rute Pusat Kota - Lambaro",
    route: "Pusat Kota - Lambaro via Lueng Bata",
    from: "Halte Pusat Kota",
    to: "Lambaro",
    operational: "06:00 - 18:00 WIB",
    distance: "16 km",
    duration: "48 menit",
    type: "feeder"
  },
  {
    id: 10,
    name: "Trans Kampus Kopelma Darussalam",
    route: "Kopelma Darussalam",
    from: "Halte Kopelma",
    to: "Kampus Darussalam",
    operational: "06:00 - 18:00 WIB",
    distance: "8 km",
    duration: "30 menit",
    type: "campus"
  },
  {
    id: 11,
    name: "Rute Darussalam - Pasar Lam Ateuk",
    route: "Darussalam - Pasar Lam Ateuk (BARU)",
    from: "Darussalam",
    to: "Pasar Lam Ateuk",
    operational: "06:00 - 18:00 WIB",
    distance: "13 km",
    duration: "40 menit",
    type: "new"
  },
  {
    id: 12,
    name: "Rute Pusat Kota - Lampaseh - Lambung",
    route: "Pusat Kota - Lampaseh - Lambung (BARU)",
    from: "Pusat Kota",
    to: "Lambung via Lampaseh",
    operational: "06:00 - 18:00 WIB",
    distance: "17 km",
    duration: "50 menit",
    type: "new"
  },
  {
    id: 13,
    name: "Rute Keudah - Pasar Al Mahirah",
    route: "Keudah - Pasar Al Mahirah (BARU)",
    from: "Keudah",
    to: "Pasar Al Mahirah",
    operational: "06:00 - 18:00 WIB",
    distance: "19 km",
    duration: "52 menit",
    type: "new"
  },
  {
    id: 14,
    name: "Feeder Lambhuk",
    route: "Pusat Kota - Lambhuk",
    from: "Halte Pusat Kota",
    to: "Lambhuk",
    operational: "06:00 - 18:00 WIB",
    distance: "11 km",
    duration: "38 menit",
    type: "feeder"
  }
];

export const facilities = [
  {
    icon: "ShieldCheck",
    title: "Gratis 100%",
    description: "Layanan Trans Koetaradja masih gratis dan didukung APBA Pemerintah Aceh"
  },
  {
    icon: "Users",
    title: "Nyaman & Aman",
    description: "Bus ber-AC dengan standar keselamatan yang teruji dan sopir profesional"
  },
  {
    icon: "Clock",
    title: "Tepat Waktu",
    description: "Jadwal operasional teratur dari pukul 06:00 - 18:00 WIB setiap hari"
  },
  {
    icon: "MapPin",
    title: "14 Rute Lengkap",
    description: "Menjangkau berbagai wilayah di Banda Aceh dan Aceh Besar"
  },
  {
    icon: "Wifi",
    title: "WiFi Gratis",
    description: "Nikmati koneksi internet gratis selama perjalanan Anda"
  },
  {
    icon: "Smartphone",
    title: "Aplikasi Mobile",
    description: "Pantau jadwal dan tracking bus real-time melalui aplikasi"
  }
];

export const stats = [
  {
    value: "14",
    label: "Rute Aktif",
    description: "Melayani berbagai koridor"
  },
  {
    value: "50+",
    label: "Armada Bus",
    description: "Bus modern ber-AC"
  },
  {
    value: "100%",
    label: "Gratis",
    description: "Tanpa biaya untuk penumpang"
  },
  {
    value: "12 Jam",
    label: "Operasional",
    description: "Setiap hari kerja"
  }
];

export const news = [
  {
    id: 1,
    title: "Bus Trans Koetaradja Kembali Beroperasi, Layani 14 Rute",
    excerpt: "BANDA ACEH – Bus Trans Koetaradja kembali beroperasi melayani mobilitas masyarakat di wilayah Banda Aceh dan Aceh Besar. Pengoperasian 14 rute akan dilakukan secara bertahap, 3 di antaranya merupakan rute baru.",
    date: "24 Februari 2025",
    image: "https://dishub.acehprov.go.id/wp-content/uploads/2025/02/WhatsApp-Image-2025-02-24-at-20.39.53.jpeg",
    category: "Pengumuman",
    link: "https://dishub.acehprov.go.id/2025/02/24/bus-trans-koetaradja-kembali-beroperasi-layani-14-rute/"
  },
  {
    id: 2,
    title: "Plt Kadishub Aceh Besar Hadiri Launching Rute Baru Trans Koetaradja Simpang Mesra – Kajhu",
    excerpt: "Pelaksana Tugas (Plt) Kepala Dinas Perhubungan Kabupaten Aceh Besar, Dodi Trisna SSTP MSi, menghadiri acara launching rute baru Trans Koetaradja trayek Simpang Mesra – Kajhu di Depo Trans Koetaradja, Batoh, Banda Aceh.",
    date: "17 September 2025",
    image: "https://acehbesarkab.go.id/thumbnail/700x0/media/2025.09/whatsapp_image_2025-09-17_at_35530_pm1.jpeg",
    category: "Berita",
    link: "https://acehbesarkab.go.id/berita/kategori/pemerintahan/plt-kadishub-aceh-besar-hadiri-launching-rute-baru-trans-koetaradja-simpang-mesra-kajhu"
  },
  {
    id: 3,
    title: "Dishub Aceh Luncurkan TransCampus dan 7 Armada Bus Baru Trans Koetaradja",
    excerpt: "Dinas Perhubungan Aceh telah meluncurkan program TransCampus dan tujuh armada bus baru Trans Koetaradja. Penyediaan angkutan feeder di kawasan kampus USK dan UIN Ar-Raniry diharapkan dapat menunjang seluruh kegiatan sivitas akademika kampus.",
    date: "19 Januari 2023",
    image: "https://blue.kumparan.com/image/upload/fl_progressive,fl_lossy,c_fill,f_auto,q_auto:best,w_640/v1634025439/01gq4kage3c0x0m8yzdmav30tn.jpg",
    category: "Informasi",
    link: "https://m.kumparan.com/acehkini/dishub-aceh-luncurkan-transcampus-dan-7-armada-bus-baru-trans-koetaradja-1zfTcZteHh9"
  },
  {
    id: 4,
    title: "Masyarakat Butuh Feeder Trans Koetaradja",
    excerpt: "Tasya Rahmayanti, mahasiswi UIN Ar-Raniry mengharapkan adanya Feeder agar memudahkan masyarakat yang ingin menggunakan Trans Koetaradja. Feeder adalah kendaraan pengumpul yang dapat menjangkau kawasan perumahan dan mengantar penumpang ke halte terdekat.",
    date: "29 November 2019",
    image: "https://dishub.acehprov.go.id/wp-content/uploads/2019/11/Bus-Trans-K-scaled-1.jpg",
    category: "Berita",
    link: "https://dishub.acehprov.go.id/2019/11/29/masyarakat-butuh-feeder-trans-koetaradja/"
  }
];

export const faqs = [
  {
    question: "Apakah Trans Koetaradja berbayar?",
    answer: "Tidak, layanan Trans Koetaradja 100% GRATIS untuk semua penumpang. Layanan ini didukung oleh APBA Pemerintah Aceh."
  },
  {
    question: "Berapa jam operasional Trans Koetaradja?",
    answer: "Trans Koetaradja beroperasi setiap hari dari pukul 06:00 hingga 18:00 WIB."
  },
  {
    question: "Bagaimana cara tracking bus secara real-time?",
    answer: "Anda dapat mengunduh aplikasi Trans Koetaradja di Play Store untuk Android atau App Store untuk iOS. Melalui aplikasi tersebut, Anda bisa melihat jadwal bus, waktu kedatangan, dan tracking bus secara real-time."
  },
  {
    question: "Berapa banyak rute yang dilayani Trans Koetaradja?",
    answer: "Trans Koetaradja saat ini melayani 14 rute yang mencakup wilayah Banda Aceh dan Aceh Besar, termasuk 3 rute baru di tahun 2025."
  },
  {
    question: "Apakah ada WiFi di dalam bus?",
    answer: "Ya, semua bus Trans Koetaradja dilengkapi dengan WiFi gratis untuk kenyamanan penumpang selama perjalanan."
  },
  {
    question: "Apakah Trans Koetaradja beroperasi saat bulan Ramadan?",
    answer: "Ya, Trans Koetaradja tetap beroperasi secara reguler selama bulan Ramadan untuk mendukung aktivitas masyarakat."
  },
  {
    question: "Fasilitas apa saja yang tersedia di dalam bus?",
    answer: "Bus Trans Koetaradja dilengkapi dengan AC, WiFi gratis, tempat duduk yang nyaman, dan standar keselamatan yang teruji."
  },
  {
    question: "Bagaimana cara mengetahui jadwal bus?",
    answer: "Anda dapat melihat jadwal bus melalui aplikasi Trans Koetaradja atau mengunjungi website ini untuk informasi lengkap semua rute."
  },
  {
    question: "Apakah ada batasan usia untuk menggunakan Trans Koetaradja?",
    answer: "Tidak ada batasan usia. Trans Koetaradja terbuka untuk semua kalangan mulai dari anak-anak hingga lansia. Kami menyediakan fasilitas khusus untuk penyandang disabilitas dan lansia."
  },
  {
    question: "Apakah bisa membawa barang bawaan di dalam bus?",
    answer: "Ya, penumpang diperbolehkan membawa barang bawaan yang wajar dan tidak mengganggu kenyamanan penumpang lain. Barang berbahaya dan hewan peliharaan tidak diperkenankan."
  },
  {
    question: "Bagaimana jika ada keluhan atau saran?",
    answer: "Anda dapat menghubungi kami melalui telepon di +62 811 6712349 atau email ke info@transkutaraja.acehprov.go.id. Kami juga menerima keluhan dan saran melalui aplikasi mobile."
  },
  {
    question: "Apakah Trans Koetaradja melayani rute ke bandara?",
    answer: "Ya, Trans Koetaradja melayani rute ke Bandara Sultan Iskandar Muda (SIM) melalui Koridor 2A: Mesjid Raya - Bandara SIM."
  },
  {
    question: "Berapa lama waktu tunggu antar bus?",
    answer: "Frekuensi kedatangan bus bervariasi tergantung rute, umumnya setiap 15-30 menit. Anda dapat melihat waktu tunggu real-time melalui aplikasi."
  },
  {
    question: "Apakah ada layanan khusus untuk mahasiswa?",
    answer: "Ya, kami memiliki layanan Trans Kampus yang khusus melayani area kampus USK dan UIN Ar-Raniry untuk memudahkan mobilitas sivitas akademika."
  },
  {
    question: "Bagaimana cara melaporkan barang hilang?",
    answer: "Jika Anda kehilangan barang di bus, segera hubungi call center kami di +62 811 6712349 atau laporkan melalui aplikasi Trans Koetaradja. Berikan detail seperti nomor bus, waktu, dan deskripsi barang."
  }
];

export const gallery = [
  {
    id: 1,
    image: "https://dishub.acehprov.go.id/wp-content/uploads/2025/02/WhatsApp-Image-2025-02-24-at-20.39.53.jpeg",
    title: "Armada Bus Trans Koetaradja",
    category: "Bus"
  },
  {
    id: 2,
    image: "https://acehbesarkab.go.id/thumbnail/700x0/media/2025.09/whatsapp_image_2025-09-17_at_35530_pm1.jpeg",
    title: "Launching Rute Baru Simpang Mesra - Kajhu",
    category: "Operasional"
  },
  {
    id: 3,
    image: "https://blue.kumparan.com/image/upload/fl_progressive,fl_lossy,c_fill,f_auto,q_auto:best,w_640/v1634025439/01gq4kage3c0x0m8yzdmav30tn.jpg",
    title: "TransCampus di Kampus USK",
    category: "TransCampus"
  },
  {
    id: 4,
    image: "https://dishub.acehprov.go.id/wp-content/uploads/2019/11/Bus-Trans-K-scaled-1.jpg",
    title: "Bus Trans Koetaradja Melayani Masyarakat",
    category: "Pelayanan"
  },
  {
    id: 5,
    image: "https://ik.imagekit.io/tvlk/blog/2025/03/trans-koetaradja-banda-aceh-1.jpeg",
    title: "Bus Baru Trans Koetaradja",
    category: "Armada"
  },
  {
    id: 6,
    image: "https://s3-ap-southeast-1.amazonaws.com/cntatr-assets-ap-southeast-1-250226768838-55a62c9399d4d8a6/2025/03/trans-koetaradja-banda-aceh-2-1024x683.jpg",
    title: "Halte Trans Koetaradja",
    category: "Halte"
  }
];
