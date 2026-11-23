// src/data/userData.js
// Data pengguna default sistem (Administrator dan Pengelola)

export const defaultUsers = [
  {
    id: 'usr_001',
    username: 'admin',
    password: 'admin123',
    nama: 'Administrator Utama',
    email: 'admin@kostsaw.ac.id',
    role: 'Super Admin',
    status: 'Aktif',
    lastLogin: '2026-10-28 10:15',
    avatarBg: '#3B82F6',
  },
  {
    id: 'usr_002',
    username: 'evaluator',
    password: 'evaluator123',
    nama: 'Budi Santoso, S.Kom',
    email: 'budi.eval@kostsaw.ac.id',
    role: 'Staf Penilai SPK',
    status: 'Aktif',
    lastLogin: '2026-10-27 14:30',
    avatarBg: '#10B981',
  },
  {
    id: 'usr_003',
    username: 'operator',
    password: 'operator123',
    nama: 'Siti Rahmawati',
    email: 'siti.operator@kostsaw.ac.id',
    role: 'Operator Data Kost',
    status: 'Aktif',
    lastLogin: '2026-10-25 09:00',
    avatarBg: '#8B5CF6',
  },
];

export default defaultUsers;
