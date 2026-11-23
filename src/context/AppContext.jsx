// src/context/AppContext.jsx
import { createContext, useContext, useReducer, useEffect } from 'react';
import { defaultKosts } from '../data/kostData';
import { defaultCriteria } from '../data/criteriaData';
import { defaultLokasi } from '../data/lokasiData';
import { defaultUsers } from '../data/userData';
import sawEngine from '../utils/sawEngine';

const STORAGE_KEY = 'kostsaw_data';
const AUTH_KEY = 'kostsaw_auth';

// Kredensial admin default
const ADMIN_CREDENTIALS = { username: 'admin', password: 'admin123' };

// ─── Initial State ────────────────────────────────────────────────────────────
const getInitialState = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.settings?.systemName === 'KostSAW' || !parsed.settings?.systemName) {
        parsed.settings = { ...parsed.settings, systemName: 'KiKost Bogor' };
      }
      return {
        ...parsed,
        users: parsed.users || defaultUsers,
        sawResult: null, // selalu recalculate saat load
      };
    }
  } catch (e) {
    // abaikan error parsing
  }
  return {
    kosts: defaultKosts,
    criteria: defaultCriteria,
    lokasi: defaultLokasi,
    users: defaultUsers,
    sawResult: null,
    riwayat: [], // riwayat perhitungan SAW
    settings: {
      systemName: 'KiKost Bogor',
      sidebarCollapsed: false,
      lastCalculated: null,
      adminUsername: 'admin',
      appVersion: '2.0.0',
      theme: 'dark',
    },
    activityLog: [
      { id: 'a1', action: 'Sistem dimulai', time: new Date().toISOString(), type: 'info' },
    ],
  };
};

// ─── Auth State ───────────────────────────────────────────────────────────────
const getInitialAuth = () => {
  try {
    const stored = sessionStorage.getItem(AUTH_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed;
    }
  } catch (e) {
    // abaikan
  }
  return { isAuthenticated: false, username: null, loginTime: null };
};

// ─── Reducer ──────────────────────────────────────────────────────────────────
const appReducer = (state, action) => {
  switch (action.type) {

    // Auth
    case 'LOGIN': {
      return { ...state, auth: { isAuthenticated: true, username: action.payload.username, loginTime: new Date().toISOString() } };
    }
    case 'LOGOUT': {
      return { ...state, auth: { isAuthenticated: false, username: null, loginTime: null } };
    }

    // KOST CRUD
    case 'ADD_KOST': {
      const newKosts = [...state.kosts, action.payload];
      const sawResult = sawEngine.compute(newKosts, state.criteria);
      return {
        ...state,
        kosts: newKosts,
        sawResult,
        activityLog: [
          { id: Date.now().toString(), action: `Kost "${action.payload.name}" ditambahkan`, time: new Date().toISOString(), type: 'success' },
          ...state.activityLog.slice(0, 9),
        ],
      };
    }

    case 'UPDATE_KOST': {
      const updatedKosts = state.kosts.map((k) =>
        k.id === action.payload.id ? { ...k, ...action.payload.data } : k
      );
      const sawResult = sawEngine.compute(updatedKosts, state.criteria);
      return {
        ...state,
        kosts: updatedKosts,
        sawResult,
        activityLog: [
          { id: Date.now().toString(), action: `Kost "${action.payload.data.name}" diperbarui`, time: new Date().toISOString(), type: 'info' },
          ...state.activityLog.slice(0, 9),
        ],
      };
    }

    case 'DELETE_KOST': {
      const kost = state.kosts.find((k) => k.id === action.payload);
      const filteredKosts = state.kosts.filter((k) => k.id !== action.payload);
      const sawResult = sawEngine.compute(filteredKosts, state.criteria);
      return {
        ...state,
        kosts: filteredKosts,
        sawResult,
        activityLog: [
          { id: Date.now().toString(), action: `Kost "${kost?.name}" dihapus`, time: new Date().toISOString(), type: 'danger' },
          ...state.activityLog.slice(0, 9),
        ],
      };
    }

    // Kriteria
    case 'UPDATE_CRITERIA': {
      const sawResult = sawEngine.compute(state.kosts, action.payload);
      return {
        ...state,
        criteria: action.payload,
        sawResult,
        activityLog: [
          { id: Date.now().toString(), action: 'Kriteria & bobot diperbarui', time: new Date().toISOString(), type: 'info' },
          ...state.activityLog.slice(0, 9),
        ],
      };
    }

    // Recalculate SAW & simpan ke riwayat
    case 'RECALCULATE': {
      const sawResult = sawEngine.compute(state.kosts, state.criteria);
      const riwayatEntry = {
        id: `rw_${Date.now()}`,
        tanggal: new Date().toISOString(),
        jumlahAlternatif: state.kosts.length,
        jumlahKriteria: state.criteria.length,
        bobotSnapshot: state.criteria.map((c) => ({ id: c.id, kode: c.kode || c.id, nama: c.name, bobot: c.weight })),
        hasilRanking: sawResult.ranked?.map((r) => ({ id: r.id, name: r.name, score: r.score, rank: r.rank })) ?? [],
        topKost: sawResult.ranked?.[0]?.name ?? '-',
      };
      return {
        ...state,
        sawResult,
        riwayat: [riwayatEntry, ...state.riwayat.slice(0, 19)], // simpan max 20 riwayat
        settings: {
          ...state.settings,
          lastCalculated: new Date().toISOString(),
        },
        activityLog: [
          { id: Date.now().toString(), action: 'Perhitungan SAW dijalankan', time: new Date().toISOString(), type: 'success' },
          ...state.activityLog.slice(0, 9),
        ],
      };
    }

    // Settings
    case 'UPDATE_SETTINGS': {
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
    }

    // Lokasi
    case 'ADD_LOKASI': {
      const newLokasi = [...state.lokasi, action.payload];
      return {
        ...state,
        lokasi: newLokasi,
        activityLog: [
          { id: Date.now().toString(), action: `Lokasi "${action.payload.nama}" ditambahkan`, time: new Date().toISOString(), type: 'success' },
          ...state.activityLog.slice(0, 9),
        ],
      };
    }

    case 'UPDATE_LOKASI': {
      const updatedLokasi = state.lokasi.map((l) =>
        l.id === action.payload.id ? { ...l, ...action.payload.data } : l
      );
      return {
        ...state,
        lokasi: updatedLokasi,
        activityLog: [
          { id: Date.now().toString(), action: `Lokasi "${action.payload.data.nama}" diperbarui`, time: new Date().toISOString(), type: 'info' },
          ...state.activityLog.slice(0, 9),
        ],
      };
    }

    case 'DELETE_LOKASI': {
      const loc = state.lokasi.find((l) => l.id === action.payload);
      const filteredLokasi = state.lokasi.filter((l) => l.id !== action.payload);
      return {
        ...state,
        lokasi: filteredLokasi,
        activityLog: [
          { id: Date.now().toString(), action: `Lokasi "${loc?.nama}" dihapus`, time: new Date().toISOString(), type: 'danger' },
          ...state.activityLog.slice(0, 9),
        ],
      };
    }

    case 'SET_DEFAULT_LOKASI': {
      const updatedLokasi = state.lokasi.map((l) => ({
        ...l,
        isDefault: l.id === action.payload,
      }));
      return {
        ...state,
        lokasi: updatedLokasi,
        activityLog: [
          { id: Date.now().toString(), action: `Lokasi acuan default diubah`, time: new Date().toISOString(), type: 'info' },
          ...state.activityLog.slice(0, 9),
        ],
      };
    }

    // Users (Admin / Pengguna)
    case 'ADD_USER': {
      const newUsers = [...state.users, action.payload];
      return {
        ...state,
        users: newUsers,
        activityLog: [
          { id: Date.now().toString(), action: `Pengguna "${action.payload.nama}" ditambahkan`, time: new Date().toISOString(), type: 'success' },
          ...state.activityLog.slice(0, 9),
        ],
      };
    }

    case 'UPDATE_USER': {
      const updatedUsers = state.users.map((u) =>
        u.id === action.payload.id ? { ...u, ...action.payload.data } : u
      );
      return {
        ...state,
        users: updatedUsers,
        activityLog: [
          { id: Date.now().toString(), action: `Pengguna "${action.payload.data.nama || action.payload.id}" diperbarui`, time: new Date().toISOString(), type: 'info' },
          ...state.activityLog.slice(0, 9),
        ],
      };
    }

    case 'DELETE_USER': {
      const uTarget = state.users.find((u) => u.id === action.payload);
      const filteredUsers = state.users.filter((u) => u.id !== action.payload);
      return {
        ...state,
        users: filteredUsers,
        activityLog: [
          { id: Date.now().toString(), action: `Pengguna "${uTarget?.nama}" dihapus`, time: new Date().toISOString(), type: 'danger' },
          ...state.activityLog.slice(0, 9),
        ],
      };
    }

    // Riwayat
    case 'CLEAR_RIWAYAT': {
      return {
        ...state,
        riwayat: [],
        activityLog: [
          { id: Date.now().toString(), action: 'Riwayat perhitungan dihapus', time: new Date().toISOString(), type: 'warning' },
          ...state.activityLog.slice(0, 9),
        ],
      };
    }

    // Reset ke default
    case 'RESET_DEFAULT': {
      const fresh = {
        kosts: defaultKosts,
        criteria: defaultCriteria,
        lokasi: defaultLokasi,
        users: defaultUsers,
        sawResult: sawEngine.compute(defaultKosts, defaultCriteria),
        riwayat: [],
        settings: {
          systemName: 'KiKost Bogor',
          sidebarCollapsed: false,
          lastCalculated: new Date().toISOString(),
          adminUsername: 'admin',
          appVersion: '2.0.0',
          theme: 'dark',
        },
        activityLog: [
          { id: Date.now().toString(), action: 'Data direset ke default', time: new Date().toISOString(), type: 'warning' },
        ],
      };
      return fresh;
    }

    // Import data (backup restore)
    case 'IMPORT_DATA': {
      return {
        ...state,
        ...action.payload,
        users: action.payload.users || state.users,
        sawResult: null,
        activityLog: [
          { id: Date.now().toString(), action: 'Data diimpor dari backup', time: new Date().toISOString(), type: 'info' },
          ...((action.payload.activityLog || []).slice(0, 8)),
        ],
      };
    }

    default:
      return state;
  }
};

// ─── Context ──────────────────────────────────────────────────────────────────
const AppContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, null, getInitialState);
  const [auth, setAuth] = useReducer((authState, action) => {
    switch (action.type) {
      case 'LOGIN':
        return { isAuthenticated: true, username: action.payload.username, user: action.payload.user, loginTime: new Date().toISOString() };
      case 'LOGOUT':
        return { isAuthenticated: false, username: null, user: null, loginTime: null };
      default:
        return authState;
    }
  }, null, getInitialAuth);

  // Auto-calculate on first load
  useEffect(() => {
    if (!state.sawResult) {
      dispatch({ type: 'RECALCULATE' });
    }
  }, []);

  // Persist auth to sessionStorage
  useEffect(() => {
    sessionStorage.setItem(AUTH_KEY, JSON.stringify(auth));
  }, [auth]);

  // Persist state to localStorage
  useEffect(() => {
    const toSave = {
      kosts: state.kosts,
      criteria: state.criteria,
      lokasi: state.lokasi,
      users: state.users,
      riwayat: state.riwayat,
      settings: state.settings,
      activityLog: state.activityLog,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }, [state.kosts, state.criteria, state.lokasi, state.users, state.riwayat, state.settings, state.activityLog]);

  // Auth helpers
  const login = (username, password) => {
    // Check against registered users
    const matched = state.users?.find(
      (u) => u.username === username && u.password === password && u.status === 'Aktif'
    );
    if (matched) {
      setAuth({ type: 'LOGIN', payload: { username: matched.username, user: matched } });
      return true;
    }
    // Fallback default admin
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setAuth({ type: 'LOGIN', payload: { username, user: { nama: 'Administrator', role: 'Super Admin' } } });
      return true;
    }
    return false;
  };
  const logout = () => setAuth({ type: 'LOGOUT' });

  const value = {
    ...state,
    auth,
    dispatch,
    // Auth
    login,
    logout,
    // Kost
    addKost: (kost) => dispatch({ type: 'ADD_KOST', payload: kost }),
    updateKost: (id, data) => dispatch({ type: 'UPDATE_KOST', payload: { id, data } }),
    deleteKost: (id) => dispatch({ type: 'DELETE_KOST', payload: id }),
    // Kriteria
    updateCriteria: (criteria) => dispatch({ type: 'UPDATE_CRITERIA', payload: criteria }),
    // SAW
    recalculate: () => dispatch({ type: 'RECALCULATE' }),
    // Settings
    updateSettings: (settings) => dispatch({ type: 'UPDATE_SETTINGS', payload: settings }),
    // Lokasi
    addLokasi: (lokasi) => dispatch({ type: 'ADD_LOKASI', payload: lokasi }),
    updateLokasi: (id, data) => dispatch({ type: 'UPDATE_LOKASI', payload: { id, data } }),
    deleteLokasi: (id) => dispatch({ type: 'DELETE_LOKASI', payload: id }),
    setDefaultLokasi: (id) => dispatch({ type: 'SET_DEFAULT_LOKASI', payload: id }),
    // Users
    addUser: (user) => dispatch({ type: 'ADD_USER', payload: user }),
    updateUser: (id, data) => dispatch({ type: 'UPDATE_USER', payload: { id, data } }),
    deleteUser: (id) => dispatch({ type: 'DELETE_USER', payload: id }),
    // Riwayat
    clearRiwayat: () => dispatch({ type: 'CLEAR_RIWAYAT' }),
    // Reset & Backup
    resetDefault: () => dispatch({ type: 'RESET_DEFAULT' }),
    importData: (data) => dispatch({ type: 'IMPORT_DATA', payload: data }),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

export default AppContext;
