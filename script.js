// =============================================
// FTTH Events Dashboard - script.js
// =============================================

// ---- SAMPLE DATA ----
const ALL_DATA = [
  {
    incidencia: "INC000711301550",
    elemento: "OLT_C300_YURIMAGUAS_8",
    cod: "LO00033",
    remedy: "CLOSED",
    bandeja: "GESTION DE INCIDENCIAS ENERGIA",
    tipo: "P. TOTAL",
    alarma: "CERRADO",
    fecha: "08/03/2026, 07:03 p. m.",
    duracion: "58 min",
    diagnostico: "Puerto caido por corte de energia",
    progreso: 100,
    total: 1
  },
  {
    incidencia: "INC000711301543",
    elemento: "OLT_MA5800_HIGUERETA_CQ_40_F1",
    cod: "LI00798",
    remedy: "ASSIGNED",
    bandeja: "PEXT FTTH LIMA",
    tipo: "P. PARCIAL",
    alarma: "ABIERTO",
    fecha: "08/03/2026, 05:26 p. m.",
    duracion: "6h 21min",
    diagnostico: "Puerto con caida parcial por corte de fibra",
    progreso: 0,
    total: 4
  },
  {
    incidencia: "INC000711301604",
    elemento: "OLT_MA5800_MAGDALENA_49",
    cod: "LI01602",
    remedy: "ASSIGNED",
    bandeja: "PEXT FTTH LIMA",
    tipo: "P. TOTAL",
    alarma: "CERRADO",
    fecha: "08/03/2026, 04:06 p. m.",
    duracion: "48 min",
    diagnostico: "Puerto caido por corte de fibra",
    progreso: 100,
    total: 1
  },
  {
    incidencia: "INC000711301600",
    elemento: "OLT_C610_SAN_IGNACIO_6",
    cod: "CA00048",
    remedy: "CLOSED",
    bandeja: "GESTION DE INCIDENCIAS MASIVAS FTTH",
    tipo: "P. PARCIAL",
    alarma: "ABIERTO",
    fecha: "08/03/2026, 03:23 p. m.",
    duracion: "8h 25min",
    diagnostico: "Puerto con caida parcial por corte de fibra",
    progreso: 0,
    total: 4
  },
  {
    incidencia: "e5f95200e85ccf74e5849b7e9663b1ae",
    elemento: "OLT_C300_HUARMEY_10",
    cod: "AN00276",
    remedy: "CANCELLED",
    bandeja: "-",
    tipo: "P. TOTAL",
    alarma: "CERRADO",
    fecha: "08/03/2026, 03:09 p. m.",
    duracion: "9 min",
    diagnostico: "Puerto caido por corte de energia",
    progreso: 100,
    total: 3
  },
  {
    incidencia: "INC000711301480",
    elemento: "OLT_MA5800_MIRAFLORES_12",
    cod: "LI00901",
    remedy: "ASSIGNED",
    bandeja: "PEXT FTTH LIMA",
    tipo: "P. TOTAL",
    alarma: "ABIERTO",
    fecha: "08/03/2026, 02:45 p. m.",
    duracion: "9h 03min",
    diagnostico: "Puerto caido por corte de fibra",
    progreso: 25,
    total: 4
  },
  {
    incidencia: "INC000711301430",
    elemento: "OLT_C300_TARAPOTO_3",
    cod: "SA00112",
    remedy: "CLOSED",
    bandeja: "GESTION DE INCIDENCIAS ENERGIA",
    tipo: "P. TOTAL",
    alarma: "CERRADO",
    fecha: "08/03/2026, 01:15 p. m.",
    duracion: "1h 32min",
    diagnostico: "Puerto caido por corte de energia",
    progreso: 100,
    total: 2
  },
  {
    incidencia: "INC000711301395",
    elemento: "OLT_C610_TRUJILLO_7",
    cod: "LL00223",
    remedy: "ASSIGNED",
    bandeja: "PEXT FTTH NORTE",
    tipo: "P. PARCIAL",
    alarma: "ABIERTO",
    fecha: "08/03/2026, 11:50 a. m.",
    duracion: "10h 38min",
    diagnostico: "Puerto con caida parcial por corte de fibra",
    progreso: 50,
    total: 2
  },
  {
    incidencia: "INC000711301350",
    elemento: "OLT_MA5800_AREQUIPA_15",
    cod: "AQ00445",
    remedy: "CLOSED",
    bandeja: "GESTION DE INCIDENCIAS MASIVAS FTTH",
    tipo: "P. TOTAL",
    alarma: "CERRADO",
    fecha: "08/03/2026, 10:22 a. m.",
    duracion: "2h 10min",
    diagnostico: "Puerto caido por corte de energia",
    progreso: 100,
    total: 1
  },
  {
    incidencia: "INC000711301300",
    elemento: "OLT_C300_PIURA_4",
    cod: "PI00088",
    remedy: "ASSIGNED",
    bandeja: "PEXT FTTH NORTE",
    tipo: "P. PARCIAL",
    alarma: "ABIERTO",
    fecha: "08/03/2026, 08:05 a. m.",
    duracion: "13h 23min",
    diagnostico: "Puerto con caida parcial por corte de fibra",
    progreso: 0,
    total: 6
  }
];

// ---- STATE ----
let filteredData = [...ALL_DATA];
let currentPage = 1;
let pageSize = 25;
let sortCol = "fecha";
let sortDir = "desc";
let autoRefresh = true;
let countdownSec = 292; // 4:52
let countdownInterval = null;

// ---- INIT ----
document.addEventListener("DOMContentLoaded", () => {
  updateKPIs();
  loadTable();
  startCountdown();
  updateTimestamp();

  // Sort on header click
  document.querySelectorAll(".data-table th[data-col]").forEach(th => {
    th.addEventListener("click", () => {
      const col = th.dataset.col;
      if (sortCol === col) {
        sortDir = sortDir === "asc" ? "desc" : "asc";
      } else {
        sortCol = col;
        sortDir = "asc";
      }
      document.querySelectorAll(".data-table th").forEach(h => h.classList.remove("sorted-desc", "sorted-asc"));
      th.classList.add(sortDir === "desc" ? "sorted-desc" : "sorted-asc");
      loadTable();
    });
  });
});

// ---- KPIs ----
function updateKPIs() {
  const total = ALL_DATA.length;
  const open = ALL_DATA.filter(r => r.alarma === "ABIERTO").length;
  const closed = ALL_DATA.filter(r => r.alarma === "CERRADO").length;
  const pending = 0;
  const gdi = 0;

  animateNumber("kpi-total", total);
  animateNumber("kpi-open", open);
  animateNumber("kpi-closed", closed);
  animateNumber("kpi-pending", pending);
  animateNumber("kpi-gdi", gdi);
}

function animateNumber(id, target) {
  const el = document.getElementById(id);
  const start = parseInt(el.textContent) || 0;
  const duration = 600;
  const steps = 30;
  const step = (target - start) / steps;
  let current = start;
  let i = 0;
  const iv = setInterval(() => {
    i++;
    current += step;
    el.textContent = Math.round(i === steps ? target : current);
    if (i >= steps) clearInterval(iv);
  }, duration / steps);
}

// ---- TABLE LOAD ----
function loadTable() {
  // Sort
  const sorted = [...filteredData].sort((a, b) => {
    let av = a[sortCol] || "";
    let bv = b[sortCol] || "";
    if (sortCol === "fecha") {
      av = parseFecha(av);
      bv = parseFecha(bv);
    }
    if (av < bv) return sortDir === "asc" ? -1 : 1;
    if (av > bv) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const totalRows = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  if (currentPage > totalPages) currentPage = totalPages;

  const start = (currentPage - 1) * pageSize;
  const end = Math.min(start + pageSize, totalRows);
  const pageData = sorted.slice(start, end);

  const tbody = document.getElementById("table-body");
  tbody.innerHTML = "";

  if (pageData.length === 0) {
    tbody.innerHTML = `<tr><td colspan="12" style="text-align:center;padding:2rem;color:#718096;">No se encontraron registros.</td></tr>`;
  } else {
    pageData.forEach((row, idx) => {
      tbody.appendChild(buildRow(row, start + idx));
    });
  }

  updatePagination(totalRows, start, end, totalPages);
}

function buildRow(row, idx) {
  const tr = document.createElement("tr");
  tr.style.animation = `fadeInRow 0.2s ease ${(idx % 25) * 0.02}s both`;

  const remedyClass = {
    ASSIGNED: "badge-assigned",
    CLOSED: "badge-closed",
    CANCELLED: "badge-cancelled"
  }[row.remedy] || "badge-assigned";

  const tipoClass = row.tipo === "P. TOTAL" ? "badge-total" : "badge-parcial";
  const alarmaClass = row.alarma === "ABIERTO" ? "badge-abierto" : "badge-cerrado";

  const progressColor = row.progreso >= 50 ? "progress-green" : "progress-red";
  const resolvedText = row.progreso === 100 ? `${row.total}/${row.total}` : `0/${row.total}`;

  tr.innerHTML = `
    <td><span class="cell-inc">${row.incidencia}</span></td>
    <td><span class="cell-elem">${row.elemento}</span></td>
    <td><span class="cell-cod">${row.cod}</span></td>
    <td><span class="badge ${remedyClass}">${row.remedy}</span></td>
    <td style="max-width:160px;font-size:11px;">${row.bandeja}</td>
    <td><span class="badge ${tipoClass}">${row.tipo}</span></td>
    <td><span class="badge ${alarmaClass}">${row.alarma}</span></td>
    <td style="font-size:11px;white-space:nowrap;">${row.fecha}</td>
    <td style="font-size:11px;white-space:nowrap;">${row.duracion}</td>
    <td style="max-width:150px;font-size:11px;">${row.diagnostico}</td>
    <td>
      <div class="progress-wrap">
        <div class="progress-bar-outer">
          <div class="progress-bar-inner ${progressColor}" style="width:${row.progreso}%"></div>
          <span class="progress-label">${row.progreso}.0%</span>
        </div>
        <div class="progress-count">${resolvedText}</div>
      </div>
    </td>
    <td>
      <button class="btn-view" onclick="openModal(${idx})" title="Ver detalle">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
      </button>
    </td>
  `;
  return tr;
}

// ---- PAGINATION ----
function updatePagination(total, start, end, totalPages) {
  document.getElementById("pag-info").textContent =
    total === 0
      ? "Sin registros"
      : `Mostrando ${start + 1} a ${end} de ${total} registros`;

  const pagesEl = document.getElementById("pag-pages");
  pagesEl.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    if (totalPages > 7) {
      if (i !== 1 && i !== totalPages && Math.abs(i - currentPage) > 2) {
        if (i === 2 || i === totalPages - 1) {
          const dots = document.createElement("span");
          dots.textContent = "…";
          dots.style.cssText = "padding:0 4px;color:#718096;";
          pagesEl.appendChild(dots);
        }
        continue;
      }
    }
    const btn = document.createElement("span");
    btn.className = "page-num" + (i === currentPage ? " active" : "");
    btn.textContent = i;
    btn.onclick = () => { currentPage = i; loadTable(); };
    pagesEl.appendChild(btn);
  }

  document.getElementById("btn-prev").disabled = currentPage <= 1;
  document.getElementById("btn-next").disabled = currentPage >= totalPages;
}

function goPage(delta) {
  const totalPages = Math.ceil(filteredData.length / pageSize);
  currentPage = Math.max(1, Math.min(currentPage + delta, totalPages));
  loadTable();
}

function changePageSize(val) {
  pageSize = parseInt(val);
  currentPage = 1;
  loadTable();
}

// ---- FILTERS ----
function applyFilters() {
  const alarma = document.getElementById("f-alarma").value;
  const remedy = document.getElementById("f-remedy").value;
  const tipo = document.getElementById("f-tipo").value;
  const diag = document.getElementById("f-diag").value;

  filteredData = ALL_DATA.filter(row => {
    if (alarma !== "Todos" && row.alarma !== alarma) return false;
    if (remedy !== "Todos" && row.remedy !== remedy) return false;
    if (tipo !== "Todos" && row.tipo !== tipo) return false;
    if (diag !== "Todos" && !row.diagnostico.toLowerCase().includes(diag.toLowerCase())) return false;
    return true;
  });

  currentPage = 1;
  loadTable();
}

function clearFilters() {
  document.getElementById("f-alarma").value = "Todos";
  document.getElementById("f-remedy").value = "Todos";
  document.getElementById("f-tipo").value = "Todos";
  document.getElementById("f-diag").value = "Todos";
  document.getElementById("f-desde").value = "";
  document.getElementById("f-hasta").value = "";
  document.getElementById("g-search").value = "";
  filteredData = [...ALL_DATA];
  currentPage = 1;
  loadTable();
}

// ---- GLOBAL SEARCH ----
function searchTable(val) {
  const q = val.toLowerCase().trim();
  if (!q) {
    filteredData = [...ALL_DATA];
  } else {
    filteredData = ALL_DATA.filter(row =>
      Object.values(row).some(v =>
        String(v).toLowerCase().includes(q)
      )
    );
  }
  currentPage = 1;
  loadTable();
}

// ---- MODAL ----
function openModal(rowIdx) {
  const sorted = [...filteredData].sort((a, b) => {
    let av = a[sortCol] || "", bv = b[sortCol] || "";
    if (sortCol === "fecha") { av = parseFecha(av); bv = parseFecha(bv); }
    if (av < bv) return sortDir === "asc" ? -1 : 1;
    if (av > bv) return sortDir === "asc" ? 1 : -1;
    return 0;
  });
  const row = sorted[rowIdx];
  if (!row) return;

  document.getElementById("modal-inc-title").textContent = row.incidencia;

  const remedyClass = { ASSIGNED: "badge-assigned", CLOSED: "badge-closed", CANCELLED: "badge-cancelled" }[row.remedy] || "";
  const tipoClass = row.tipo === "P. TOTAL" ? "badge-total" : "badge-parcial";
  const alarmaClass = row.alarma === "ABIERTO" ? "badge-abierto" : "badge-cerrado";

  document.getElementById("modal-content").innerHTML = `
    <div class="modal-row"><label>Incidencia</label><span style="font-family:var(--mono);font-size:12px;">${row.incidencia}</span></div>
    <div class="modal-row"><label>Elemento</label><span>${row.elemento}</span></div>
    <div class="modal-row"><label>Código Único</label><span><span class="cell-cod">${row.cod}</span></span></div>
    <div class="modal-row"><label>Estado Remedy</label><span><span class="badge ${remedyClass}">${row.remedy}</span></span></div>
    <div class="modal-row full"><label>Bandeja Actual</label><span>${row.bandeja}</span></div>
    <div class="modal-row"><label>Tipo Caída</label><span><span class="badge ${tipoClass}">${row.tipo}</span></span></div>
    <div class="modal-row"><label>Estado Alarma</label><span><span class="badge ${alarmaClass}">${row.alarma}</span></span></div>
    <div class="modal-row"><label>Fecha Inicio</label><span>${row.fecha}</span></div>
    <div class="modal-row"><label>Duración</label><span>${row.duracion}</span></div>
    <div class="modal-row full"><label>Diagnóstico</label><span>${row.diagnostico}</span></div>
    <div class="modal-row"><label>Progreso</label><span>${row.progreso}%</span></div>
    <div class="modal-row"><label>Registros</label><span>${row.progreso === 100 ? row.total : 0} / ${row.total}</span></div>
  `;

  document.getElementById("modal-overlay").classList.add("open");
}

function closeModal() {
  document.getElementById("modal-overlay").classList.remove("open");
}

// ---- AUTO-REFRESH & COUNTDOWN ----
function startCountdown() {
  clearInterval(countdownInterval);
  countdownInterval = setInterval(() => {
    if (!autoRefresh) return;
    countdownSec--;
    if (countdownSec <= 0) {
      countdownSec = 292;
      updateTimestamp();
    }
    updateCountdown();
  }, 1000);
}

function updateCountdown() {
  const m = Math.floor(countdownSec / 60);
  const s = countdownSec % 60;
  const el = document.getElementById("countdown");
  if (el) el.textContent = `${m}:${s.toString().padStart(2, "0")}`;
}

function updateTimestamp() {
  const now = new Date();
  const h = now.getHours(), mi = now.getMinutes(), s = now.getSeconds();
  const ampm = h >= 12 ? "p. m." : "a. m.";
  const hh = ((h % 12) || 12).toString().padStart(2, "0");
  const mm = mi.toString().padStart(2, "0");
  const ss = s.toString().padStart(2, "0");
  const el = document.getElementById("last-update");
  if (el) el.textContent = `Actualizado: ${hh}:${mm}:${ss} ${ampm}`;
}

function toggleAuto(checked) {
  autoRefresh = checked;
}

// ---- EXPORT CSV ----
function exportCSV() {
  const headers = ["INCIDENCIA","ELEMENTO","CÓD. ÚNICO","EST. REMEDY","BANDEJA ACTUAL","TIPO CAÍDA","EST. ALARMA","FECHA INICIO","DURACIÓN","DIAGNÓSTICO","PROGRESO"];
  const rows = filteredData.map(r => [
    r.incidencia, r.elemento, r.cod, r.remedy, r.bandeja,
    r.tipo, r.alarma, r.fecha, r.duracion, r.diagnostico, r.progreso + "%"
  ]);
  const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "eventos_ftth.csv"; a.click();
  URL.revokeObjectURL(url);
}

// ---- HELPERS ----
function parseFecha(str) {
  // "08/03/2026, 07:03 p. m." → Date
  try {
    const clean = str.replace("a. m.", "AM").replace("p. m.", "PM").replace(", ", " ");
    const [dmy, time, ampm] = clean.split(" ");
    const [d, m, y] = dmy.split("/");
    let [hh, mm] = time.split(":").map(Number);
    if (ampm === "PM" && hh < 12) hh += 12;
    if (ampm === "AM" && hh === 12) hh = 0;
    return new Date(y, m - 1, d, hh, mm).getTime();
  } catch { return 0; }
}

// ---- CSS ANIMATION ----
const style = document.createElement("style");
style.textContent = `
@keyframes fadeInRow {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}`;
document.head.appendChild(style);
