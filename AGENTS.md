# 🤖 AGENTS.md — KostSAW Project Contract
## Kontrak Eksekusi Proyek: SPK Pemilihan Kost Terbaik (SAW)

---

## 1. Identitas Proyek

```
Project  : KostSAW — Sistem Pendukung Keputusan Pemilihan Kost Terbaik
Method   : Simple Additive Weighting (SAW)
Stack    : React 18 + Vite 5 + Vanilla CSS
Dir      : c:\laragon\www\web-project-s3\
SOT Ref  : PRD.md | UI_GUIDELINE.md | IMPLEMENTATION_PLAN.md
```

---

## 2. Peran & Tanggung Jawab Agent

### System Analyst Agent
- Memahami dan menjaga konsistensi dengan PRD
- Memastikan semua fitur yang diimplementasi sesuai scope
- Menolak implementasi di luar PRD v1.0

### UI/UX Engineer Agent
- Mengikuti UI_GUIDELINE secara ketat
- Menggunakan hanya CSS Custom Properties yang terdefinisi
- Tidak boleh menggunakan Tailwind, Bootstrap, atau library CSS lain
- Wajib implementasi semua animasi yang tercantum di UI_GUIDELINE

### Front-End Developer Agent
- Mengikuti folder structure di IMPLEMENTATION_PLAN
- Setiap komponen harus single-responsibility
- Gunakan React Context (bukan Redux/Zustand) untuk state
- Data harus dari src/data/ tidak ada hardcode di komponen

### Algorithm Agent
- sawEngine.js harus pure functions (no side effects)
- Implementasi SAW harus sesuai formula di PRD Section 8
- Semua step perhitungan harus ter-record untuk display

---

## 3. Phase Gate Rules

```
RULE: Setiap phase harus mendapat APPROVAL sebelum lanjut ke phase berikutnya.
Phase 0 -> APPROVAL -> Phase 1 -> APPROVAL -> Phase 2 -> ...
```

Cara meminta approval:
Agent menyampaikan: "Phase [N] selesai. Silakan review dan approve untuk lanjut ke Phase [N+1]."

Kriteria approval:
- Semua file phase tersebut dibuat
- Tidak ada console error
- Visual sesuai UI_GUIDELINE
- Data flow correct

---

## 4. Coding Conventions

### JavaScript / JSX
- Functional components only
- Named exports untuk komponen
- Default export untuk pages
- Arrow functions untuk handlers
- Destructuring untuk props
- Optional chaining (?.) untuk data access

DILARANG:
- Class components
- Hardcoded color/font (harus pakai CSS variables)
- Inline styles kecuali nilai dinamis
- console.log di production code

### CSS
- Gunakan CSS Custom Properties dari :root
- BEM-like naming: .component-element--modifier
- Semua transisi pakai cubic-bezier atau ease

DILARANG:
- !important (kecuali print styles)
- Magic numbers tanpa komentar
- Warna hardcode (harus --color-xxx)

### File Naming
- Components  : PascalCase.jsx  (KpiCard.jsx)
- Pages       : PascalCase.jsx  (Dashboard.jsx)
- Utils       : camelCase.js    (sawEngine.js)
- Data        : camelCase.js    (kostData.js)
- CSS         : kebab-case.css  (index.css)

---

## 5. SAW Algorithm Contract

sawEngine.js adalah SUMBER KEBENARAN algoritma.
Tidak ada kalkulasi SAW di luar file ini.

Input  : alternatives[], criteria[]
Output : { decisionMatrix, normalMatrix, preferences, ranked }

Formula yang harus diimplementasi:
  Normalisasi Benefit: r_ij = x_ij / max(x_j)
  Normalisasi Cost:    r_ij = min(x_j) / x_ij
  Preferensi:          V_i  = Sigma(w_j * r_ij)
  Ranking:             sort V_i descending

---

## 6. State Management Contract

AppContext adalah SATU-SATUNYA sumber state global.
Komponen TIDAK boleh memiliki state lokal untuk data bisnis.
Komponen BOLEH memiliki state lokal untuk UI state (modal open, tab aktif, dll.)

Actions yang tersedia:
- dispatch({ type: 'ADD_KOST', payload: kostItem })
- dispatch({ type: 'UPDATE_KOST', payload: { id, data } })
- dispatch({ type: 'DELETE_KOST', payload: id })
- dispatch({ type: 'UPDATE_CRITERIA', payload: criteria[] })
- dispatch({ type: 'RECALCULATE' })
- dispatch({ type: 'RESET_DEFAULT' })
- dispatch({ type: 'UPDATE_SETTINGS', payload: settings })

---

## 7. Prompt Execution Protocol

Format Prompt ke Agent:
[PHASE: N] [TASK: nama task]
SOT: PRD Section X | UI_GUIDELINE Section Y
Files to create: path/file.jsx
Dependencies: ComponentA, ContextB
Brief: deskripsi singkat

Contoh Prompt Eksekusi Awal:
[PHASE: 0] [TASK: Foundation Setup]
SOT: IMPLEMENTATION_PLAN Phase 0
Files to create:
  - package.json (update)
  - index.html (update)
  - src/index.css (create)
  - src/main.jsx (update)
  - src/App.jsx (create)
Brief: Setup fondasi proyek. Install react-router-dom.
       Implementasi design tokens dari UI_GUIDELINE Section 2 & 3.
       Setup routing dasar untuk semua 7 halaman.

---

## 8. Quality Gates

Setiap Komponen Wajib Memiliki:
- PropTypes atau JSDoc comment
- Unique ID pada interactive elements
- Aria labels untuk aksesibilitas
- Responsive behavior

Setiap Halaman Wajib Memiliki:
- Judul unik
- Meta description
- Satu h1 dengan warna highlight
- Loading state (jika ada async)
- Empty state (jika data kosong)

---

## 9. Deliverable Final

- Semua 7 halaman berfungsi
- SAW calculation akurat
- CRUD data kost & kriteria
- localStorage persistence
- Responsive (360px - 1440px)
- Print/export laporan
- Design sesuai UI_GUIDELINE 100%
- Zero console errors
- Semua animasi smooth

---

## 10. Revisi & Change Management

Perubahan scope di luar PRD v1.0 harus melalui:
  1. Request change tertulis dari user
  2. Update dokumen PRD
  3. Baru dieksekusi

Tidak ada quick fix yang mengubah arsitektur tanpa approval.

---

Kontrak ini berlaku sejak Oktober 2026.
Agent wajib membaca kontrak ini sebelum setiap sesi eksekusi.
