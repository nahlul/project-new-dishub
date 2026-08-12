// Shared helpers for Trans Koetaradja route/schedule display.

export const DAY_LABELS = {
  senin_kamis: 'Senin - Kamis',
  jumat: "Jum'at",
  sabtu: 'Sabtu',
  minggu: 'Minggu',
  sabtu_minggu: 'Sabtu - Minggu',
};

// Ordered list used to render the day filter buttons.
export const DAY_KEYS = ['senin_kamis', 'jumat', 'sabtu', 'minggu', 'sabtu_minggu'];

// Map JS getDay() (0=Sun) to the schedule key most likely present in data.
export function currentDayKey() {
  const d = new Date().getDay();
  if (d === 5) return 'jumat';
  if (d === 6) return 'sabtu';
  if (d === 0) return 'minggu';
  return 'senin_kamis';
}

// Resolve times for a day, falling back to combined keys when a specific day
// is not present in a halte's schedule.
export function timesForDay(jadwal = {}, dayKey) {
  if (jadwal[dayKey]?.length) return jadwal[dayKey];
  if ((dayKey === 'sabtu' || dayKey === 'minggu') && jadwal.sabtu_minggu?.length) {
    return jadwal.sabtu_minggu;
  }
  if (dayKey === 'senin_kamis' && jadwal.senin_jumat?.length) return jadwal.senin_jumat;
  return jadwal[dayKey] || [];
}

export function minutesNow() {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

// Next upcoming departure relative to now (or a reference minute).
export function nextBus(jadwal, dayKey, refMinutes = minutesNow()) {
  const times = timesForDay(jadwal, dayKey);
  for (const time of times) {
    const [h, m] = time.split(':').map(Number);
    const busMin = h * 60 + m;
    if (busMin > refMinutes) return { time, diff: busMin - refMinutes };
  }
  return null;
}

export function formatKm(km) {
  if (km == null) return '';
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}
