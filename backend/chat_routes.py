from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv
import os
from pathlib import Path
from emergentintegrations.llm.chat import LlmChat, UserMessage, TextDelta, StreamDone

ROOT_DIR = Path(__file__).parent.parent
load_dotenv(ROOT_DIR / '.env')

router = APIRouter()

# Knowledge base tentang Trans Koetaradja
TRANS_KOETARADJA_CONTEXT = """
Anda adalah asisten AI untuk Trans Koetaradja, layanan transportasi publik di Banda Aceh dan Aceh Besar.

INFORMASI PENTING:
- Trans Koetaradja adalah layanan BRT (Bus Rapid Transit) 100% GRATIS didukung APBA Pemerintah Aceh
- Operasional: Setiap hari 06:00 - 18:00 WIB (termasuk bulan Ramadan)
- Total: 14 rute aktif (6 koridor utama, 4 feeder, 1 trans kampus, 3 rute baru 2025)

SEJARAH:
- 2016: Diluncurkan 4 Mei 2016 oleh Gubernur Zaini Abdullah, 1 koridor, 25 bus
- 2017: Ekspansi jadi 3 rute, 30 bus, 1.25 juta penumpang
- 2018: Pembentukan UPTD, 5 rute, 40 bus, 4 juta penumpang, 6 halte dari CSR
- 2019: Masuk Bandara SIM, 4.25 juta penumpang, penghubung antar-moda
- 2025: Beroperasi kembali, 14 rute, 59 bus, 3 rute baru

14 RUTE:
1. Koridor 1: Keudah - Mesjid Jamik Darusalam (15km, 45 menit)
2. Koridor 2A: Mesjid Raya - Bandara SIM (18km, 50 menit)
3. Koridor 2B: Barata - Pelabuhan Ulee-Lheue (12km, 40 menit)
4. Koridor 3A: Mesjid Raya - Mata Ie 2 (10km, 35 menit)
5. Koridor 3B: Mesjid Raya - Mata Ie 2 Via Alternatif (11km, 38 menit)
6. Koridor 5: Pusat Kota Via Ulee Kareng - Bandara SIM (20km, 55 menit)
7. Pusat Kota - Darussalam (14km, 42 menit)
8. Pusat Kota - Blang Bintang via Lambaro (22km, 60 menit)
9. Pusat Kota - Lambaro via Lueng Bata (16km, 48 menit)
10. Trans Kampus Kopelma Darussalam (8km, 30 menit)
11. Darussalam - Pasar Lam Ateuk (BARU 2025) (13km, 40 menit)
12. Pusat Kota - Lampaseh - Lambung (BARU 2025) (17km, 50 menit)
13. Keudah - Pasar Al Mahirah (BARU 2025) (19km, 52 menit)
14. Feeder Lambhuk (11km, 38 menit)

FASILITAS:
- AC di semua bus
- WiFi gratis
- Kursi nyaman
- Standar keselamatan teruji
- Sopir profesional terlatih
- Tracking real-time via aplikasi mobile

APLIKASI MOBILE:
- Android: Play Store (ngi.muchi.koetaradja)
- iOS: App Store
- Fitur: Live tracking, jadwal, notifikasi, estimasi waktu tiba

KONTAK:
- Telepon/WhatsApp: +62 811 6712349
- Email: info@transkutaraja.acehprov.go.id
- Instagram: @trans.koetaradja
- Facebook: transkoetaradja
- X (Twitter): @dishub_aceh
- Alamat: Dinas Perhubungan Aceh, Jl. T. Panglima Nyak Makam No.16, Banda Aceh

FAQ UMUM:
Q: Apakah Trans Koetaradja berbayar?
A: Tidak, 100% GRATIS untuk semua penumpang, didukung APBA Pemerintah Aceh

Q: Berapa jam operasional?
A: Setiap hari 06:00 - 18:00 WIB, termasuk hari libur dan bulan Ramadan

Q: Bagaimana cara tracking bus?
A: Download aplikasi Trans Koetaradja di Play Store atau App Store untuk tracking real-time

Q: Apakah ada WiFi?
A: Ya, semua bus dilengkapi WiFi gratis

Q: Berapa frekuensi bus?
A: Umumnya 15-30 menit sekali tergantung rute, lihat di aplikasi untuk waktu real-time

Q: Apakah melayani ke bandara?
A: Ya, Koridor 2A: Mesjid Raya - Bandara SIM

Q: Apakah boleh bawa barang bawaan?
A: Ya, barang wajar yang tidak mengganggu penumpang lain. Barang berbahaya dan hewan tidak diperbolehkan

Q: Bagaimana melaporkan barang hilang?
A: Hubungi call center +62 811 6712349 atau laporkan via aplikasi dengan detail nomor bus, waktu, dan deskripsi barang

CARA MENJAWAB:
- Ramah, helpful, dan informatif
- Jawab dalam Bahasa Indonesia
- Jika tidak tahu, arahkan ke kontak customer service
- Berikan info spesifik (nomor rute, waktu, jarak)
- Sarankan download aplikasi untuk info real-time
"""

class ChatRequest(BaseModel):
    message: str
    session_id: str = "default"

@router.post("/chat")
async def chat(request: ChatRequest):
    """Chat endpoint dengan streaming response"""
    
    async def event_generator():
        try:
            # Get API key
            api_key = os.environ.get('EMERGENT_LLM_KEY')
            if not api_key:
                yield f"data: ERROR: API key tidak ditemukan\n\n"
                return
            
            # Initialize LLM Chat
            chat = LlmChat(
                api_key=api_key,
                session_id=request.session_id,
                system_message=TRANS_KOETARADJA_CONTEXT
            ).with_model("openai", "gpt-5.4")
            
            # Create user message
            user_message = UserMessage(text=request.message)
            
            # Stream response
            async for event in chat.stream_message(user_message):
                if isinstance(event, TextDelta):
                    # Send token to client
                    yield f"data: {event.content}\n\n"
                elif isinstance(event, StreamDone):
                    yield "data: [DONE]\n\n"
                    break
                    
        except Exception as e:
            yield f"data: ERROR: {str(e)}\n\n"
    
    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive"
        }
    )
