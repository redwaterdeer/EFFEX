/* EFFEX 통합 JavaScript */

var AUTH_KEY = "efex_auth";
var USERS_STORAGE_KEY = "efex_users";
var ORDERS_STORAGE_KEY = "efex_orders";
var UI_STATE_KEY = "efex_ui_state";
var EFFEX_CLOUD_DATA_ID_KEY = "efex_cloud_data_blob";
var EFFEX_CLOUD_REV_KEY = "efex_cloud_rev";
var EFFEX_CLOUD_POINTER = "redwaterdeer-effex-pointer-v1";
var EFFEX_CLOUD_PULL_MS = 15000;
var LOGO_URL = "https://i.ibb.co/8DW6cys2/3.png";
var LOGO_URL_INACTIVE = "https://i.ibb.co/5WH4s329/3.png";
var currentProjectId = null;

var MASTER_ACCOUNT = {
  userId: "redwaterdeer",
  password: "10qp29wo!Q",
  name: "마스터",
  role: "admin",
  roleLabel: "관리자",
  isMaster: true,
};

var ROLES = {
  admin: { label: "관리자", home: "order-summary" },
  partner: { label: "시공협력사", home: "order-summary" },
  worker: { label: "시공사원", home: "order-summary" },
};

var ORDER_REGIONS = {
  서울특별시: [
    "강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", "노원구", "도봉구",
    "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구", "양천구", "영등포구",
    "용산구", "은평구", "종로구", "중구", "중랑구",
  ],
  부산광역시: [
    "강서구", "금정구", "기장군", "남구", "동구", "동래구", "부산진구", "북구", "사상구", "사하구",
    "서구", "수영구", "연제구", "영도구", "중구", "해운대구",
  ],
  대구광역시: ["남구", "달서구", "달성군", "동구", "북구", "서구", "수성구", "중구", "군위군"],
  인천광역시: ["강화군", "계양구", "남동구", "동구", "미추홀구", "부평구", "서구", "연수구", "옹진군", "중구"],
  광주광역시: ["광산구", "남구", "동구", "북구", "서구"],
  대전광역시: ["대덕구", "동구", "서구", "유성구", "중구"],
  울산광역시: ["남구", "동구", "북구", "울주군", "중구"],
  세종특별자치시: ["세종시"],
  경기도: [
    "가평군", "고양시", "과천시", "광명시", "광주시", "구리시", "군포시", "김포시", "남양주시", "동두천시",
    "부천시", "성남시", "수원시", "시흥시", "안산시", "안성시", "안양시", "양주시", "양평군", "여주시",
    "연천군", "오산시", "용인시", "의왕시", "의정부시", "이천시", "파주시", "평택시", "포천시", "하남시", "화성시",
  ],
  강원특별자치도: [
    "강릉시", "고성군", "동해시", "삼척시", "속초시", "양구군", "양양군", "영월군", "원주시", "인제군",
    "정선군", "철원군", "춘천시", "태백시", "평창군", "홍천군", "화천군", "횡성군",
  ],
  충청북도: [
    "괴산군", "단양군", "보은군", "영동군", "옥천군", "음성군", "제천시", "증평군", "진천군", "청주시", "충주시",
  ],
  충청남도: [
    "계룡시", "공주시", "금산군", "논산시", "당진시", "보령시", "부여군", "서산시", "서천군", "아산시",
    "예산군", "천안시", "청양군", "태안군", "홍성군",
  ],
  전북특별자치도: [
    "고창군", "군산시", "김제시", "남원시", "무주군", "부안군", "순창군", "완주군", "익산시", "임실군",
    "장수군", "전주시", "정읍시", "진안군",
  ],
  전라남도: [
    "강진군", "고흥군", "곡성군", "광양시", "구례군", "나주시", "담양군", "목포시", "무안군", "보성군",
    "순천시", "신안군", "여수시", "영광군", "영암군", "완도군", "장성군", "장흥군", "진도군", "함평군", "해남군", "화순군",
  ],
  경상북도: [
    "경산시", "경주시", "고령군", "구미시", "군위군", "김천시", "문경시", "봉화군", "상주시", "성주군",
    "안동시", "영덕군", "영양군", "영주시", "영천시", "예천군", "울릉군", "울진군", "의성군", "청도군",
    "청송군", "칠곡군", "포항시",
  ],
  경상남도: [
    "거제시", "거창군", "고성군", "김해시", "남해군", "밀양시", "사천시", "산청군", "양산시", "의령군",
    "진주시", "창녕군", "창원시", "통영시", "하동군", "함안군", "함양군", "합천군",
  ],
  제주특별자치도: ["서귀포시", "제주시"],
};

var ORDER_SCOPE_CODES = {
  "kitchen-wood": "M",
  "kitchen-top": "S",
  "kitchen-product": "P",
  etc: "E",
};

var ORDER_SCOPE_CODE_ORDER = ["kitchen-wood", "kitchen-top", "kitchen-product", "etc"];

var ORDER_SCOPE_LABELS = {
  "kitchen-wood": "주방 목대",
  "kitchen-top": "주방 상판",
  "kitchen-product": "주방 상품",
  etc: "기타",
};

var ASSIGN_SCOPE_LABELS = {
  "kitchen-wood": "목대",
  "kitchen-top": "상판",
  "kitchen-product": "상품",
  etc: "기타",
};

var orderDatePickerState = {
  year: 0,
  month: 0,
  selectedIso: "",
};

var orderDatePickerMount = {
  parent: null,
  next: null,
  onBody: false,
};

function isMobileOrderViewport() {
  if (window.matchMedia("(max-width: 768px)").matches) return true;
  var vpW = window.visualViewport ? window.visualViewport.width : window.innerWidth;
  return vpW <= 768;
}

function restoreOrderDatePickerFromBody() {
  var popup = document.getElementById("orderDatePickerPopup");
  if (!popup || !orderDatePickerMount.onBody || !orderDatePickerMount.parent) return;
  if (
    orderDatePickerMount.next &&
    orderDatePickerMount.next.parentNode === orderDatePickerMount.parent
  ) {
    orderDatePickerMount.parent.insertBefore(popup, orderDatePickerMount.next);
  } else {
    orderDatePickerMount.parent.appendChild(popup);
  }
  orderDatePickerMount.onBody = false;
}

function mountOrderDatePickerToBodyIfMobile() {
  var popup = document.getElementById("orderDatePickerPopup");
  var backdrop = ensureOrderDatePickerBackdrop();
  if (!popup || !backdrop) return;

  if (!isMobileOrderViewport()) {
    restoreOrderDatePickerFromBody();
    return;
  }

  if (!orderDatePickerMount.parent) {
    orderDatePickerMount.parent = popup.parentNode;
    orderDatePickerMount.next = popup.nextSibling;
  }

  if (backdrop.parentNode !== document.body) {
    document.body.appendChild(backdrop);
  }
  if (popup.parentNode !== backdrop) {
    backdrop.appendChild(popup);
  }
  orderDatePickerMount.onBody = true;
}

var orderDatePickerMobileViewportBound = false;
var orderDatePickerOpening = false;

function ensureOrderDatePickerBackdrop() {
  var backdrop = document.getElementById("orderDatePickerBackdrop");
  if (backdrop) return backdrop;

  backdrop = document.createElement("div");
  backdrop.id = "orderDatePickerBackdrop";
  backdrop.className = "order-date-picker-backdrop";
  backdrop.hidden = true;
  backdrop.setAttribute("aria-hidden", "true");
  backdrop.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    closeOrderDatePicker();
  });
  document.body.appendChild(backdrop);
  return backdrop;
}

function applyMobileOrderDatePickerCenter(popup) {
  var backdrop = document.getElementById("orderDatePickerBackdrop");
  if (!popup) return;
  mountOrderDatePickerToBodyIfMobile();
  popup.classList.add("order-date-picker--mobile-modal");
  popup.setAttribute("aria-modal", "true");
  popup.style.setProperty("display", "block", "important");
  popup.style.setProperty("position", "relative", "important");
  popup.style.setProperty("top", "auto", "important");
  popup.style.setProperty("left", "auto", "important");
  popup.style.setProperty("right", "auto", "important");
  popup.style.setProperty("bottom", "auto", "important");
  popup.style.setProperty("inset", "auto", "important");
  popup.style.setProperty("margin", "0", "important");
  popup.style.setProperty("transform", "none", "important");
  popup.style.setProperty("width", "min(340px, calc(100vw - 32px))", "important");
  popup.style.setProperty("max-height", "min(90vh, 90dvh)", "important");
  popup.style.setProperty("flex-shrink", "0", "important");
  popup.style.removeProperty("z-index");
  if (backdrop) {
    backdrop.style.setProperty("display", "flex", "important");
    backdrop.style.setProperty("align-items", "center", "important");
    backdrop.style.setProperty("justify-content", "center", "important");
    backdrop.style.setProperty("position", "fixed", "important");
    backdrop.style.setProperty("inset", "0", "important");
    backdrop.style.setProperty("width", "100%", "important");
    backdrop.style.setProperty("height", "100%", "important");
    backdrop.style.setProperty("min-height", "100dvh", "important");
    backdrop.style.setProperty("z-index", "10040", "important");
    backdrop.style.setProperty("background", "rgba(0, 0, 0, 0.45)", "important");
    backdrop.style.setProperty("padding", "16px", "important");
    backdrop.style.setProperty("box-sizing", "border-box", "important");
  }
  if (!popup.dataset.mobileClickStop) {
    popup.addEventListener("click", function (e) {
      e.stopPropagation();
    });
    popup.dataset.mobileClickStop = "1";
  }
}

function clearMobileOrderDatePickerPosition(popup) {
  var backdrop = document.getElementById("orderDatePickerBackdrop");
  if (!popup) return;
  popup.classList.remove("order-date-picker--mobile-modal");
  popup.removeAttribute("aria-modal");
  [
    "display",
    "position",
    "top",
    "left",
    "right",
    "bottom",
    "inset",
    "margin",
    "transform",
    "z-index",
    "width",
    "max-height",
    "flex-shrink",
  ].forEach(function (prop) {
    popup.style.removeProperty(prop);
  });
  if (backdrop) {
    [
      "display",
      "align-items",
      "justify-content",
      "position",
      "inset",
      "width",
      "height",
      "z-index",
      "background",
      "padding",
      "box-sizing",
    ].forEach(function (prop) {
      backdrop.style.removeProperty(prop);
    });
  }
}

function onOrderDatePickerMobileViewportChange() {
  var popup = document.getElementById("orderDatePickerPopup");
  if (!popup || popup.hidden || !isMobileOrderViewport()) return;
  applyMobileOrderDatePickerCenter(popup);
}

function bindOrderDatePickerMobileViewport() {
  if (orderDatePickerMobileViewportBound) return;
  orderDatePickerMobileViewportBound = true;
  window.addEventListener("resize", onOrderDatePickerMobileViewportChange);
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", onOrderDatePickerMobileViewportChange);
    window.visualViewport.addEventListener("scroll", onOrderDatePickerMobileViewportChange);
  }
}

var statusActionDatePickerState = {
  year: 0,
  month: 0,
  selectedIso: "",
};

var statusActionDatePickerScopeKey = "";
var statusDetailActiveActionRound = {};

var STATUS_ACCIDENT_TYPE_OPTIONS = [
  "",
  "시공하자",
  "영업하자",
  "제품하자",
  "물류하자",
  "고객요청",
  "현장이슈",
  "기타",
];

var STATUS_ACTION_RESULT_OPTIONS = ["", "조치완료", "재미결"];

var activeAssignPageKey = "assign";

var ASSIGN_PAGE_CONFIG = {
  assign: {
    screenId: "screen-order-assign",
    filterMode: "unassigned",
    topNav: "assign",
    ids: {
      year: "assignYear",
      month: "assignMonth",
      dateTitle: "assignDateTitle",
      calendar: "assignMonthCalendar",
      tableBody: "assignTableBody",
      saveBtn: "btnAssignSave",
    },
  },
  status: {
    screenId: "screen-order-status",
    filterMode: "assigned",
    topNav: "status",
    ids: {
      year: "statusYear",
      month: "statusMonth",
      dateTitle: "statusDateTitle",
      calendar: "statusMonthCalendar",
      tableBody: "statusTableBody",
      saveBtn: "btnStatusSave",
    },
  },
  open: {
    screenId: "screen-order-open",
    filterMode: "open",
    topNav: "open",
    ids: {
      year: "openYear",
      month: "openMonth",
      dateTitle: "openDateTitle",
      calendar: "openMonthCalendar",
      tableBody: "openTableBody",
      saveBtn: "btnOpenSave",
    },
  },
};

var assignPickerStates = {
  assign: { year: 2026, month: 5, day: 17 },
  status: { year: 2026, month: 5, day: 17, workerFilter: "assigned" },
  open: { year: 2026, month: 5, day: 17, actionFilter: "pending" },
};

function getAssignConfig(pageKey) {
  return ASSIGN_PAGE_CONFIG[pageKey || activeAssignPageKey];
}

function getAssignPicker(pageKey) {
  return assignPickerStates[pageKey || activeAssignPageKey];
}

var NAV_ITEMS = [];

var MOCK = {
  projects: [
    { id: "P-2026-001", name: "강남 OO아파트 101동", address: "서울 강남구 테헤란로 123", client: "김○○", partner: "(주)한빛인테리어", start: "2026-04-01", end: "2026-06-30", progress: 72, status: "progress", statusLabel: "진행중" },
    { id: "P-2026-002", name: "판교 빌딩 3층 리모델링", address: "경기 성남시 분당구 판교역로 456", client: "이○○", partner: "미래시공", start: "2026-04-15", end: "2026-07-15", progress: 45, status: "progress", statusLabel: "진행중" },
    { id: "P-2026-003", name: "송파 상가 2호점", address: "서울 송파구 올림픽로 88", client: "최○○", partner: "동부인테리어", start: "2026-03-01", end: "2026-05-10", progress: 100, status: "done", statusLabel: "완료" },
    { id: "P-2026-004", name: "용인 주택 전체 시공", address: "경기 용인시 수지구 ○○로 78", client: "박○○", partner: "(주)한빛인테리어", start: "2026-05-01", end: "2026-08-31", progress: 28, status: "delay", statusLabel: "지연" },
  ],
  partners: [
    { id: "C-001", name: "(주)한빛인테리어", ceo: "홍길동", phone: "02-1234-5678", sites: 8, workers: 42, status: "active" },
    { id: "C-002", name: "미래시공", ceo: "김철수", phone: "031-987-6543", sites: 5, workers: 28, status: "active" },
    { id: "C-003", name: "동부인테리어", ceo: "이영희", phone: "02-555-1234", sites: 3, workers: 15, status: "pending" },
  ],
  workers: [
    { id: "W-1001", name: "박시공", partner: "(주)한빛인테리어", phone: "010-1234-5678", site: "강남 OO아파트", checkin: true },
    { id: "W-1002", name: "최현장", partner: "미래시공", phone: "010-9876-5432", site: "판교 빌딩 3층", checkin: true },
    { id: "W-1003", name: "정도배", partner: "(주)한빛인테리어", phone: "010-5555-1111", site: "-", checkin: false },
    { id: "W-1004", name: "한타일", partner: "동부인테리어", phone: "010-2222-3333", site: "송파 상가 2호점", checkin: true },
  ],
  notices: [
    { type: "사진 승인", msg: "시공 전·후 사진 3건 대기", site: "판교 빌딩 3층", time: "2026-05-21 10:32" },
    { type: "이슈", msg: "자재 부족 신고", site: "용인 주택", time: "2026-05-21 09:15" },
    { type: "일정", msg: "도배 공정 일정 변경", site: "강남 OO아파트", time: "2026-05-20 16:00" },
  ],
  todaySchedule: [
    { time: "09:00", site: "강남 OO아파트", process: "도배 마감" },
    { time: "11:00", site: "판교 빌딩 3층", process: "전기 배선" },
    { time: "14:00", site: "용인 주택", process: "타일 시공" },
    { time: "16:00", site: "강남 OO아파트", process: "현장 점검" },
  ],
};

var SIDEBAR_AUTH_PAGES = [];
var AUTH_PAGES = [
  "order",
  "order-summary",
  "order-assign",
  "order-status",
  "order-open",
  "order-stats",
].concat(SIDEBAR_AUTH_PAGES);
var summaryMetricState = "count";
var orderSummaryFilterState = { year: 2026, month: "all" };
var orderSummaryListContext = { scopeKey: "", metricKey: "" };
var ORDER_SUMMARY_MONTH_ALL = "all";
var STATS_FILTER_ALL = "__all__";
var ORDER_YEAR_MIN = 2026;
var ORDER_YEAR_MAX = 2046;
var ORDER_YEAR_SELECT_IDS = [
  "assignYear",
  "statusYear",
  "openYear",
  "statsYear",
  "orderSummaryYear",
];
var statsPickerState = { year: 2026, mode: "assign", view: "assign" };
var initializedScreens = {};
var canEnterSignup = false;
var signupEditMode = false;

function getAuth() {
  try {
    var raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function getCurrentPartnerUserId() {
  var auth = getAuth();
  if (!auth || auth.role !== "partner") return "";
  return (auth.userId || "").trim();
}

function isOrderAssignedToPartner(order, partnerId) {
  var target = (partnerId || "").trim();
  if (!target) return false;
  if (((order.assignedPartner || "").trim()) === target) return true;
  var partners = normalizeOrderAssignedPartners(order);
  var keys = Object.keys(partners || {});
  var i;
  for (i = 0; i < keys.length; i++) {
    if (((partners[keys[i]] || "").trim()) === target) return true;
  }
  return false;
}

function canCurrentUserViewOrder(order) {
  var auth = getAuth();
  if (!auth) return false;
  if (auth.role === "partner") {
    var partnerUserId = getCurrentPartnerUserId();
    if (!partnerUserId) return false;
    return isOrderAssignedToPartner(order, partnerUserId);
  }
  if (auth.role === "worker") {
    return isOrderAssignedToWorker(order, getCurrentWorkerIdentity());
  }
  return true;
}

function getVisibleOrdersForCurrentUser() {
  return getStoredOrders().filter(function (order) {
    return canCurrentUserViewOrder(order);
  });
}

function canAccessOrderPageByRole(page) {
  var auth = getAuth();
  if (!auth) return false;
  if (auth.role === "admin") return true;
  return page !== "order" && page !== "order-assign";
}

function getCurrentWorkerIdentity() {
  var auth = getAuth();
  if (!auth || auth.role !== "worker") return { userId: "", name: "" };
  return {
    userId: (auth.userId || "").trim(),
    name: (auth.name || "").trim(),
  };
}

function isOrderAssignedToWorker(order, workerIdentity) {
  var workerId = (workerIdentity && workerIdentity.userId) || "";
  var workerName = (workerIdentity && workerIdentity.name) || "";
  if (!workerId && !workerName) return false;

  var normalizedWorker = (order.constructionWorker || "").trim();
  if (normalizedWorker && (normalizedWorker === workerId || normalizedWorker === workerName)) {
    return true;
  }

  var info = normalizeOrderScopeWorkInfo(order);
  var keys = Object.keys(info || {});
  var i;
  for (i = 0; i < keys.length; i++) {
    var v = ((info[keys[i]] && info[keys[i]].worker) || "").trim();
    if (v && (v === workerId || v === workerName)) return true;
  }
  return false;
}

function setAuth(user) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

function clearAuth() {
  localStorage.removeItem(AUTH_KEY);
}

function canAccessNav(item, role) {
  return item.roles.indexOf(role) !== -1;
}

function getRegisteredUsers() {
  try {
    var raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveRegisteredUsers(users) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  localStorage.setItem(EFFEX_CLOUD_REV_KEY, String(Date.now()));
  notifyEffexDataChanged();
  scheduleCloudSync();
}

function isUserIdTaken(userId) {
  var id = (userId || "").trim().toLowerCase();
  if (!id) return false;
  if (id === MASTER_ACCOUNT.userId.toLowerCase()) return true;
  return getRegisteredUsers().some(function (u) {
    return (u.userId || "").trim().toLowerCase() === id;
  });
}

function authenticateLogin(userId, password) {
  var id = (userId || "").trim();
  var pw = password || "";

  if (!id || !pw) {
    return { ok: false, message: "ID와 PW를 입력해 주세요." };
  }

  if (id.toLowerCase() === MASTER_ACCOUNT.userId.toLowerCase()) {
    if (pw === MASTER_ACCOUNT.password) {
      return {
        ok: true,
        user: {
          userId: MASTER_ACCOUNT.userId,
          name: MASTER_ACCOUNT.name,
          role: MASTER_ACCOUNT.role,
          roleLabel: MASTER_ACCOUNT.roleLabel,
          isMaster: true,
        },
      };
    }
    return { ok: false, message: "ID 또는 PW가 올바르지 않습니다." };
  }

  var found = null;
  getRegisteredUsers().forEach(function (u) {
    if ((u.userId || "").trim().toLowerCase() === id.toLowerCase()) {
      found = u;
    }
  });

  if (!found || found.password !== pw) {
    return { ok: false, message: "등록되지 않은 ID이거나 PW가 올바르지 않습니다." };
  }

  var roleInfo = ROLES[found.role] || ROLES.admin;
  return {
    ok: true,
    user: {
      userId: found.userId,
      name: found.name || found.userId,
      role: found.role,
      roleLabel: roleInfo.label,
      partnerUserId: found.partnerUserId || "",
      isMaster: false,
    },
  };
}

function getRegisteredPartners() {
  return getRegisteredUsers().filter(function (u) {
    return u.role === "partner";
  });
}

function getRegisteredWorkers(partnerUserId) {
  var workers = getRegisteredUsers().filter(function (u) {
    return u.role === "worker";
  });
  if (partnerUserId && partnerUserId !== STATS_FILTER_ALL) {
    workers = workers.filter(function (w) {
      return w.partnerUserId === partnerUserId;
    });
  }
  return workers;
}

function registerUser(user) {
  var users = getRegisteredUsers();
  users.push(user);
  saveRegisteredUsers(users);
}

function getScopeValues(groupEl) {
  if (!groupEl) return [];
  var active = groupEl.querySelectorAll(".signup-scope-option--active");
  var values = [];
  active.forEach(function (btn) {
    values.push(btn.getAttribute("data-value"));
  });
  return values;
}

function badgeClass(status) {
  if (status === "done") return "badge--done";
  if (status === "delay") return "badge--delay";
  if (status === "pending") return "badge--wait";
  return "badge--progress";
}

function getProjectById(id) {
  for (var i = 0; i < MOCK.projects.length; i++) {
    if (MOCK.projects[i].id === id) return MOCK.projects[i];
  }
  return null;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function projectLink(id, text) {
  return (
    '<a class="data-table__link" href="#" data-nav="project-detail" data-id="' +
    encodeURIComponent(id) +
    '">' +
    escapeHtml(text) +
    "</a>"
  );
}

function getActiveScreen() {
  return document.querySelector(".screen.is-active");
}

function goToSignup() {
  signupEditMode = false;
  canEnterSignup = true;
  showScreen("signup");
}

function goToSignupEdit() {
  signupEditMode = true;
  canEnterSignup = true;
  loadSignupFormForEdit();
  showScreen("signup");
}

function setSignupHeaderTitle(text) {
  var titleEl = document.querySelector(".signup-header__title");
  if (titleEl) titleEl.textContent = text;
  var screen = document.getElementById("screen-signup");
  if (screen) screen.setAttribute("data-title", text);
}

function applySignupScreenMode() {
  setSignupHeaderTitle(signupEditMode ? "가입 수정" : "신규가입");
}

function leaveSignupScreen() {
  var nextPage = signupEditMode ? "order" : "login";
  signupEditMode = false;
  canEnterSignup = false;
  showScreen(nextPage);
}

function loadSignupFormForEdit() {
  var auth = getAuth();
  if (!auth) return;

  var user = null;
  getRegisteredUsers().forEach(function (u) {
    if ((u.userId || "").toLowerCase() === (auth.userId || "").toLowerCase()) {
      user = u;
    }
  });

  var data = user || {
    userId: auth.userId,
    name: auth.name,
    role: auth.role,
    password: "",
    phone: "",
  };

  document.getElementById("signupId").value = data.userId || "";
  document.getElementById("signupPw").value = data.password || "";
  document.getElementById("signupName").value = data.name || "";
  document.getElementById("signupPhone").value = data.phone || "";

  setSignupRole(data.role || "admin");

  if (data.role === "partner") {
    document.getElementById("partnerCompany").value = data.partnerCompany || "";
    document.getElementById("bizNo").value = data.bizNo || "";
    document.getElementById("bizAddress").value = data.bizAddress || "";
    applySignupScopeSelection('[data-scope-group="partner"]', data.scope || []);
  }

  if (data.role === "worker") {
    refreshWorkerPartnerSelect();
    if (data.partnerUserId) {
      document.getElementById("workerPartner").value = encodeURIComponent(data.partnerUserId);
    }
    applySignupScopeSelection('[data-scope-group="worker"]', data.scope || []);
  }
}

function applySignupScopeSelection(groupSelector, values) {
  var group = document.querySelector(groupSelector);
  if (!group) return;
  group.querySelectorAll(".signup-scope-option").forEach(function (btn) {
    var val = btn.getAttribute("data-value");
    btn.classList.toggle("signup-scope-option--active", values.indexOf(val) >= 0);
  });
}

function updateRegisteredUser(user) {
  var users = getRegisteredUsers();
  var found = false;

  for (var i = 0; i < users.length; i++) {
    if ((users[i].userId || "").toLowerCase() === (user.userId || "").toLowerCase()) {
      users[i] = Object.assign({}, users[i], user);
      found = true;
      break;
    }
  }

  if (!found) {
    users.push(user);
  }

  saveRegisteredUsers(users);

  var auth = getAuth();
  if (auth) {
    var roleInfo = ROLES[user.role] || ROLES.admin;
    setAuth({
      userId: user.userId,
      name: user.name,
      role: user.role,
      roleLabel: roleInfo.label,
      isMaster: auth.isMaster,
    });
  }
}

function isSignupIdTakenForEdit(id) {
  if (!isUserIdTaken(id)) return false;
  var auth = getAuth();
  if (!auth) return true;
  return (auth.userId || "").trim().toLowerCase() !== (id || "").trim().toLowerCase();
}

function showScreen(page, params) {
  params = params || {};

  if (page === "signup" && !canEnterSignup) {
    page = "login";
  }

  if (page === "login" && getAuth()) {
    page = ROLES[getAuth().role].home;
  }

  if (page === "signup" && getAuth() && !canEnterSignup) {
    page = ROLES[getAuth().role].home;
  }

  if (page === "login") {
    canEnterSignup = false;
    signupEditMode = false;
  }

  var screenId = "screen-" + page;

  if (AUTH_PAGES.indexOf(page) >= 0 && !getAuth()) {
    page = "login";
    screenId = "screen-login";
  }

  if (AUTH_PAGES.indexOf(page) >= 0 && getAuth() && !canAccessOrderPageByRole(page)) {
    page = "order-status";
    screenId = "screen-order-status";
  }

  document.querySelectorAll(".screen").forEach(function (el) {
    el.classList.remove("is-active");
  });

  var screen = document.getElementById(screenId);
  if (!screen) {
    screen = document.getElementById("screen-login");
    page = "login";
  }

  screen.classList.add("is-active");
  document.title = (screen.getAttribute("data-title") || "EFFEX") + " - EFFEX 시공관리";

  if (
    getAuth() &&
    [
      "order",
      "order-summary",
      "order-assign",
      "order-status",
      "order-open",
      "order-stats",
    ].indexOf(page) >= 0
  ) {
    pullCloudData(true);
    refreshDataFromStorage();
  }

  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  var nextHash = "#" + page + (params.id ? "/" + params.id : "");
  if (location.hash !== nextHash) {
    if (page === "signup") {
      history.pushState({ page: "signup" }, "", nextHash);
    } else {
      location.hash = nextHash;
    }
  }

  if (page === "project-detail") {
    currentProjectId = params.id || currentProjectId;
  }

  if (page === "order") {
    updateOrderLoginMessage();
    updateOrderTopbarActive("order", screen);
    initOrderPage(screen);
  } else if (page === "order-assign") {
    activeAssignPageKey = "assign";
    updateOrderLoginMessage();
    updateOrderTopbarActive("assign", screen);
    initOrderAssignPage(screen);
  } else if (page === "order-status") {
    activeAssignPageKey = "status";
    updateOrderLoginMessage();
    updateOrderTopbarActive("status", screen);
    initOrderStatusPage(screen);
  } else if (page === "order-open") {
    activeAssignPageKey = "open";
    updateOrderLoginMessage();
    updateOrderTopbarActive("open", screen);
    initOrderOpenPage(screen);
  } else if (page === "order-stats") {
    updateOrderLoginMessage();
    updateOrderTopbarActive("stats", screen);
    initOrderStatsPage(screen);
  } else if (page === "order-summary") {
    updateOrderLoginMessage();
    updateOrderTopbarActive("home", screen);
    initOrderSummaryPage(screen);
  } else if (SIDEBAR_AUTH_PAGES.indexOf(page) >= 0) {
    initAppPage({
      page: page === "project-detail" ? "projects" : page,
      screen: screen,
      title: screen.getAttribute("data-header-title") || "",
      breadcrumb: screen.getAttribute("data-header-breadcrumb") || "",
      onReady: function (auth) {
        runPageInit(page, screen, params);
      },
    });
  } else if (page === "login") {
    initLoginScreen();
  } else if (page === "signup") {
    applySignupScreenMode();
    initSignupScreen();
  }
}

function parseHash() {
  var hash = (location.hash || "#login").replace(/^#/, "");
  var parts = hash.split("/");
  var page = parts[0] || "login";
  var params = {};
  if (parts[1]) params.id = decodeURIComponent(parts[1]);
  return { page: page, params: params };
}

function renderSidebar(activePage, screenEl) {
  var navEl = screenEl.querySelector(".js-sidebar-nav");
  if (!navEl) return;

  var auth = getAuth();
  var role = auth ? auth.role : "admin";
  var html = '<ul class="sidebar__menu">';

  NAV_ITEMS.forEach(function (item) {
    if (!canAccessNav(item, role)) return;
    var active = item.id === activePage ? " sidebar__item--active" : "";
    html +=
      '<li class="sidebar__item' +
      active +
      '"><a class="sidebar__link" href="#" data-nav="' +
      item.id +
      '">' +
      item.label +
      "</a></li>";
  });

  html += "</ul>";
  navEl.innerHTML = html;
}

function fillUserHeader(screenEl) {
  var auth = getAuth();
  if (!auth || !screenEl) return;

  var nameEl = screenEl.querySelector("[data-user-name]");
  var roleEl = screenEl.querySelector("[data-user-role]");
  var avatarEl = screenEl.querySelector("[data-user-avatar]");

  if (nameEl) nameEl.textContent = auth.name || auth.userId;
  if (roleEl) roleEl.textContent = auth.roleLabel || ROLES[auth.role].label;
  if (avatarEl) avatarEl.textContent = (auth.name || auth.userId || "U").charAt(0).toUpperCase();
}

function setPageHeader(title, breadcrumb, screenEl) {
  if (!screenEl) return;
  var t = screenEl.querySelector("[data-page-title]");
  var b = screenEl.querySelector("[data-page-breadcrumb]");
  if (t) t.textContent = title;
  if (b) b.textContent = breadcrumb;
}

function initLogout(screenEl) {
  if (!screenEl) return;
  screenEl.querySelectorAll("[data-logout]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      clearAuth();
      showScreen("login");
    });
  });
}

function initAppPage(config) {
  var auth = getAuth();
  if (!auth) {
    showScreen("login");
    return null;
  }

  var screen = config.screen || getActiveScreen();
  if (!screen) return null;

  renderSidebar(config.page, screen);
  fillUserHeader(screen);
  initLogout(screen);
  setPageHeader(config.title, config.breadcrumb, screen);

  var logoImg = screen.querySelector(".sidebar__logo img");
  if (logoImg) logoImg.src = LOGO_URL;

  if (typeof config.onReady === "function") {
    config.onReady(auth);
  }

  return auth;
}

function openModal(id) {
  var el = document.getElementById(id);
  if (el) el.classList.add("is-open");
}

function closeModal(id) {
  var el = document.getElementById(id);
  if (el) el.classList.remove("is-open");
  if (id === "modal-status-detail") closeStatusActionDatePicker();
}

function initModals() {
  document.querySelectorAll("[data-modal-close]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      closeModal(btn.getAttribute("data-modal-close"));
    });
  });

  document.querySelectorAll(".modal-overlay").forEach(function (overlay) {
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) {
        overlay.classList.remove("is-open");
        if (overlay.id === "modal-status-detail") closeStatusActionDatePicker();
      }
    });
  });
}

function runPageInit(page, screen, params) {
  if (page === "dashboard") renderDashboard(screen);
  else if (page === "projects") initProjectsPage(screen);
  else if (page === "project-detail") renderProjectDetail(screen, params.id || currentProjectId);
  else if (page === "partners") initPartnersPage(screen);
  else if (page === "workers") renderWorkersTable(screen);
  else if (page === "schedule") renderCalendar(screen);
  else if (page === "notices") renderNoticesTable(screen);
}

function renderDashboard(screen) {
  var stats = screen.querySelector("#stats-grid");
  var projectsBody = screen.querySelector("#recent-projects");
  var scheduleBody = screen.querySelector("#today-schedule");
  var noticesBody = screen.querySelector("#recent-notices");

  if (stats) {
    var progress = MOCK.projects.filter(function (p) {
      return p.status === "progress";
    }).length;
    var delay = MOCK.projects.filter(function (p) {
      return p.status === "delay";
    }).length;

    stats.innerHTML =
      '<div class="stat-card"><div class="stat-card__label">진행 중 현장</div><div class="stat-card__value">' +
      progress +
      '</div><div class="stat-card__sub stat-card__sub--up">전체 ' +
      MOCK.projects.length +
      "건</div></div>" +
      '<div class="stat-card"><div class="stat-card__label">지연 현장</div><div class="stat-card__value">' +
      delay +
      '</div><div class="stat-card__sub stat-card__sub--down">주의 필요</div></div>' +
      '<div class="stat-card"><div class="stat-card__label">시공협력사</div><div class="stat-card__value">' +
      MOCK.partners.length +
      '</div></div><div class="stat-card"><div class="stat-card__label">시공사원</div><div class="stat-card__value">' +
      MOCK.workers.length +
      "</div></div>";
  }

  if (projectsBody) {
    projectsBody.innerHTML = MOCK.projects
      .slice(0, 4)
      .map(function (p) {
        return (
          "<tr><td>" +
          projectLink(p.id, p.name) +
          "</td><td>" +
          escapeHtml(p.partner) +
          "</td><td>" +
          p.progress +
          '%</td><td><span class="badge ' +
          badgeClass(p.status) +
          '">' +
          escapeHtml(p.statusLabel) +
          "</span></td></tr>"
        );
      })
      .join("");
  }

  if (scheduleBody) {
    scheduleBody.innerHTML = MOCK.todaySchedule
      .map(function (s) {
        return "<tr><td>" + escapeHtml(s.time) + "</td><td>" + escapeHtml(s.site) + "</td><td>" + escapeHtml(s.process) + "</td></tr>";
      })
      .join("");
  }

  if (noticesBody) {
    noticesBody.innerHTML = MOCK.notices
      .map(function (n) {
        return (
          "<tr><td>" +
          escapeHtml(n.type) +
          "</td><td>" +
          escapeHtml(n.msg) +
          "</td><td>" +
          escapeHtml(n.site) +
          "</td><td>" +
          escapeHtml(n.time) +
          "</td></tr>"
        );
      })
      .join("");
  }
}

function renderProjectsTable(screen) {
  var tbody = screen.querySelector("#projects-table");
  if (!tbody) return;

  tbody.innerHTML = MOCK.projects
    .map(function (p) {
      return (
        "<tr><td>" +
        escapeHtml(p.id) +
        "</td><td>" +
        projectLink(p.id, p.name) +
        "</td><td>" +
        escapeHtml(p.address) +
        "</td><td>" +
        escapeHtml(p.client) +
        "</td><td>" +
        escapeHtml(p.partner) +
        "</td><td>" +
        escapeHtml(p.start) +
        "</td><td>" +
        p.progress +
        '%</td><td><span class="badge ' +
        badgeClass(p.status) +
        '">' +
        escapeHtml(p.statusLabel) +
        '</span></td><td><a class="data-table__link" href="#" data-nav="project-detail" data-id="' +
        encodeURIComponent(p.id) +
        '">상세</a></td></tr>'
      );
    })
    .join("");
}

function initProjectsPage(screen) {
  renderProjectsTable(screen);

  if (!initializedScreens.projects) {
    var btn = document.getElementById("btnAddProject");
    if (btn) {
      btn.addEventListener("click", function () {
        openModal("modal-project");
      });
    }

    var form = document.getElementById("formProject");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        alert("저장되었습니다. (데모)");
        closeModal("modal-project");
      });
    }

    var filter = document.getElementById("filterSearch");
    if (filter) {
      filter.addEventListener("input", function () {
        var q = filter.value.toLowerCase();
        document.querySelectorAll("#projects-table tr").forEach(function (tr) {
          tr.style.display = tr.textContent.toLowerCase().indexOf(q) >= 0 ? "" : "none";
        });
      });
    }

    initializedScreens.projects = true;
  }
}

function detailItem(label, value) {
  return (
    '<div class="detail-item"><div class="detail-item__label">' +
    escapeHtml(label) +
    '</div><div class="detail-item__value">' +
    escapeHtml(value) +
    "</div></div>"
  );
}

function renderProjectDetail(screen, id) {
  var p = id ? getProjectById(id) : null;
  var root = screen.querySelector("#project-detail");

  if (!root) return;

  if (!p) {
    root.innerHTML = "<p>현장 정보를 찾을 수 없습니다.</p>";
    setPageHeader("현장 상세", "홈 / 현장 관리 / 상세", screen);
    return;
  }

  setPageHeader(p.name, "홈 / 현장 관리 / " + p.name, screen);

  root.innerHTML =
    '<div class="card" style="margin-bottom:18px">' +
    '<div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px">' +
    "<div><h2 style=\"font-size:20px;font-weight:600\">" +
    escapeHtml(p.name) +
    '</h2><p style="color:#666;margin-top:4px">' +
    escapeHtml(p.id) +
    '</p></div><span class="badge ' +
    badgeClass(p.status) +
    '">' +
    escapeHtml(p.statusLabel) +
    "</span></div>" +
    '<div class="progress-bar" style="margin-top:20px"><div class="progress-bar__fill" style="width:' +
    p.progress +
    '%"></div></div>' +
    '<p style="font-size:13px;color:#666;margin-top:8px">진행률 ' +
    p.progress +
    "%</p></div>" +
    '<div class="card"><div class="detail-grid">' +
    detailItem("주소", p.address) +
    detailItem("고객", p.client) +
    detailItem("담당 협력사", p.partner) +
    detailItem("시작일", p.start) +
    detailItem("종료 예정", p.end) +
    "</div></div>";
}

function renderPartnersTable(screen) {
  var tbody = screen.querySelector("#partners-table");
  if (!tbody) return;

  tbody.innerHTML = MOCK.partners
    .map(function (c) {
      var statusLabel = c.status === "active" ? "활성" : "검토중";
      var statusClass = c.status === "active" ? "badge--done" : "badge--wait";
      return (
        "<tr><td>" +
        escapeHtml(c.id) +
        "</td><td>" +
        escapeHtml(c.name) +
        "</td><td>" +
        escapeHtml(c.ceo) +
        "</td><td>" +
        escapeHtml(c.phone) +
        "</td><td>" +
        c.sites +
        "건</td><td>" +
        c.workers +
        '명</td><td><span class="badge ' +
        statusClass +
        '">' +
        statusLabel +
        '</span></td><td><a href="#" class="data-table__link">상세</a></td></tr>'
      );
    })
    .join("");
}

function initPartnersPage(screen) {
  renderPartnersTable(screen);

  if (!initializedScreens.partners) {
    var search = document.getElementById("partnerSearch");
    if (search) {
      search.addEventListener("input", function () {
        var q = search.value.toLowerCase();
        document.querySelectorAll("#partners-table tr").forEach(function (tr) {
          tr.style.display = tr.textContent.toLowerCase().indexOf(q) >= 0 ? "" : "none";
        });
      });
    }
    initializedScreens.partners = true;
  }
}

function renderWorkersTable(screen) {
  var tbody = screen.querySelector("#workers-table");
  if (!tbody) return;

  tbody.innerHTML = MOCK.workers
    .map(function (w) {
      var checkClass = w.checkin ? "badge--done" : "badge--wait";
      var checkLabel = w.checkin ? "출근" : "미출근";
      return (
        "<tr><td>" +
        escapeHtml(w.id) +
        "</td><td>" +
        escapeHtml(w.name) +
        "</td><td>" +
        escapeHtml(w.partner) +
        "</td><td>" +
        escapeHtml(w.phone) +
        "</td><td>" +
        escapeHtml(w.site) +
        '</td><td><span class="badge ' +
        checkClass +
        '">' +
        checkLabel +
        '</span></td><td><a href="#" class="data-table__link">상세</a></td></tr>'
      );
    })
    .join("");
}

function renderCalendar(screen) {
  var el = screen.querySelector("#calendar");
  if (!el) return;
  var days = ["일", "월", "화", "수", "목", "금", "토"];
  var html = "";
  days.forEach(function (d) {
    html += '<div class="schedule-calendar__head">' + d + "</div>";
  });
  for (var i = 0; i < 4; i++) html += '<div class="schedule-calendar__cell"></div>';
  for (var d = 1; d <= 31; d++) {
    var cls = d === 21 ? " schedule-calendar__cell--today" : "";
    var events = d === 21 ? '<div class="schedule-calendar__event">강남 도배</div><div class="schedule-calendar__event">판교 전기</div>' : "";
    html += '<div class="schedule-calendar__cell' + cls + '"><div class="schedule-calendar__date">' + d + "</div>" + events + "</div>";
  }
  el.innerHTML = html;
}

function renderNoticesTable(screen) {
  var tbody = screen.querySelector("#notices-table");
  if (!tbody) return;
  tbody.innerHTML = MOCK.notices
    .map(function (n) {
      return (
        "<tr><td>" +
        escapeHtml(n.type) +
        "</td><td>" +
        escapeHtml(n.msg) +
        "</td><td>" +
        escapeHtml(n.site) +
        "</td><td>" +
        escapeHtml(n.time) +
        '</td><td><a href="#" class="data-table__link">처리</a></td></tr>'
      );
    })
    .join("");
}

function orderSalesDigitsOnly(str) {
  return (str || "").replace(/\D/g, "");
}

function formatOrderSales(value) {
  var d = orderSalesDigitsOnly(value);
  if (!d) return "";
  return d.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "원";
}

function formatOrderSalesEditing(value) {
  var d = orderSalesDigitsOnly(value);
  if (!d) return "";
  return d.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function orderScopeSalesBeginEditing(el) {
  if (!el || el.disabled) return;
  var formatted = formatOrderSalesEditing(el.value);
  el.value = formatted;
  if (document.activeElement !== el) return;
  var len = formatted.length;
  var start = el.selectionStart;
  var end = el.selectionEnd;
  if (start > len || end > len) {
    try {
      el.setSelectionRange(len, len);
    } catch (err) {}
  }
}

function initOrderRegionSelects() {
  var citySelect = document.getElementById("orderCity");
  var districtSelect = document.getElementById("orderDistrict");
  if (!citySelect || !districtSelect) return;

  citySelect.innerHTML = '<option value="">도/시 선택</option>';
  Object.keys(ORDER_REGIONS).forEach(function (city) {
    var opt = document.createElement("option");
    opt.value = city;
    opt.textContent = city;
    citySelect.appendChild(opt);
  });

  citySelect.addEventListener("change", function () {
    var city = citySelect.value;
    districtSelect.innerHTML = '<option value="">군/구 선택</option>';
    districtSelect.disabled = !city;
    districtSelect.value = "";

    if (!city || !ORDER_REGIONS[city]) return;

    ORDER_REGIONS[city].forEach(function (name) {
      var opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      districtSelect.appendChild(opt);
    });
  });
}

function updateOrderDrawingDeleteState(num) {
  var drawingInput = document.getElementById("orderDrawing" + num);
  var deleteBtn = document.getElementById("btnOrderDelete" + num);
  if (!deleteBtn) return;
  deleteBtn.disabled = !(drawingInput && drawingInput.value.trim());
}

function bindOrderDrawingDelete(num) {
  var deleteBtn = document.getElementById("btnOrderDelete" + num);
  var drawingInput = document.getElementById("orderDrawing" + num);
  var fileInput = document.getElementById("orderDrawingFile" + num);
  if (!deleteBtn || !drawingInput) return;

  deleteBtn.addEventListener("click", function () {
    if (deleteBtn.disabled) return;
    drawingInput.value = "";
    if (fileInput) fileInput.value = "";
    deleteBtn.disabled = true;
    updateOrderFieldFilledStates();
  });
}

function bindDrawingUpload(inputId, fileId, btnId) {
  var fileInput = document.getElementById(fileId);
  var drawingInput = document.getElementById(inputId);
  var uploadBtn = document.getElementById(btnId);
  var numMatch = inputId.match(/orderDrawing(\d)/);
  var num = numMatch ? parseInt(numMatch[1], 10) : 0;

  if (!uploadBtn || !fileInput || !drawingInput) return;

  uploadBtn.addEventListener("click", function () {
    fileInput.click();
  });

  fileInput.addEventListener("change", function () {
    if (fileInput.files && fileInput.files[0]) {
      drawingInput.value = fileInput.files[0].name;
      updateOrderFieldFilledStates();
      if (num) updateOrderDrawingDeleteState(num);
    }
  });

  if (num) updateOrderDrawingDeleteState(num);
}

var assignDetailDrawingDraft = null;

function downloadStoredFile(fileName, dataUrl) {
  if (!dataUrl) {
    alert("다운로드할 파일 데이터가 없습니다.");
    return;
  }
  var link = document.createElement("a");
  link.href = dataUrl;
  link.download = fileName || "download";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function readFileAsDataUrl(file, callback) {
  var reader = new FileReader();
  reader.onload = function (e) {
    callback(e.target.result);
  };
  reader.readAsDataURL(file);
}

function getModalDrawingFileName(btnId) {
  var btn = document.getElementById(btnId);
  return btn ? btn.getAttribute("data-filename") || "" : "";
}

function getModalDrawingData(btnId) {
  var btn = document.getElementById(btnId);
  return btn ? btn.getAttribute("data-filedata") || "" : "";
}

function getModalDrawingElements(btnId) {
  var numMatch = btnId.match(/(\d)$/);
  var num = numMatch ? numMatch[1] : "";
  var isAssign = btnId.indexOf("assign") === 0;
  return {
    btn: document.getElementById(btnId),
    fileInput: document.getElementById(
      (isAssign ? "assignDetailDrawingFile" : "statusDetailDrawingFile") + num
    ),
    editBtn: document.getElementById(
      (isAssign ? "assignDetailDrawingEdit" : "statusDetailDrawingEdit") + num
    ),
    deleteBtn: document.getElementById(
      (isAssign ? "assignDetailDrawingDelete" : "statusDetailDrawingDelete") + num
    ),
  };
}

function setModalDrawingDisplay(btnId, fileName, dataUrl) {
  var els = getModalDrawingElements(btnId);
  var btn = els.btn;
  if (!btn) return;

  var textEl = btn.querySelector(".assign-detail-modal__drawing-btn-text");
  var fileInput = els.fileInput;
  var editBtn = els.editBtn;
  var deleteBtn = els.deleteBtn;

  var filled = !!(fileName && String(fileName).trim());
  if (filled) {
    btn.setAttribute("data-filename", fileName);
    if (dataUrl) {
      btn.setAttribute("data-filedata", dataUrl);
    } else {
      btn.removeAttribute("data-filedata");
    }
    btn.classList.add("assign-detail-modal__download--filled");
    if (textEl) textEl.textContent = "다운로드";
    if (editBtn) editBtn.disabled = false;
    if (deleteBtn) deleteBtn.disabled = false;
  } else {
    btn.removeAttribute("data-filename");
    btn.removeAttribute("data-filedata");
    btn.classList.remove("assign-detail-modal__download--filled");
    if (textEl) textEl.textContent = "업로드";
    if (fileInput) fileInput.value = "";
    if (editBtn) editBtn.disabled = true;
    if (deleteBtn) deleteBtn.disabled = true;
  }
}

function loadAssignDetailDrawingDraft(order) {
  assignDetailDrawingDraft = {
    1: { name: order.drawing1 || "", data: order.drawing1Data || "" },
    2: { name: order.drawing2 || "", data: order.drawing2Data || "" },
    3: { name: order.drawing3 || "", data: order.drawing3Data || "" },
  };
}

function applyAssignDetailDrawingDraft() {
  if (!assignDetailDrawingDraft) return;
  setModalDrawingDisplay(
    "assignDetailDown1",
    assignDetailDrawingDraft[1].name,
    assignDetailDrawingDraft[1].data
  );
  setModalDrawingDisplay(
    "assignDetailDown2",
    assignDetailDrawingDraft[2].name,
    assignDetailDrawingDraft[2].data
  );
  setModalDrawingDisplay(
    "assignDetailDown3",
    assignDetailDrawingDraft[3].name,
    assignDetailDrawingDraft[3].data
  );
}

function updateAssignDetailDrawingDraft(num, fileName, dataUrl) {
  if (!assignDetailDrawingDraft) return;
  assignDetailDrawingDraft[num] = { name: fileName || "", data: dataUrl || "" };
  setModalDrawingDisplay("assignDetailDown" + num, fileName, dataUrl);
}

function saveAssignDetailFromModal() {
  var idxEl = document.getElementById("assignDetailOrderIndex");
  var idx = idxEl ? parseInt(idxEl.value, 10) : -1;
  if (idx < 0 || !assignDetailDrawingDraft) return;

  var orders = getStoredOrders();
  if (!orders[idx]) return;

  orders[idx].drawing1 = assignDetailDrawingDraft[1].name;
  orders[idx].drawing1Data = assignDetailDrawingDraft[1].data;
  orders[idx].drawing2 = assignDetailDrawingDraft[2].name;
  orders[idx].drawing2Data = assignDetailDrawingDraft[2].data;
  orders[idx].drawing3 = assignDetailDrawingDraft[3].name;
  orders[idx].drawing3Data = assignDetailDrawingDraft[3].data;

  saveStoredOrders(orders);
  alert("저장이 완료되었습니다.");
  closeModal("modal-assign-detail");
}

function bindModalDrawingSlot(btnId, onDrawingChange) {
  var numMatch = btnId.match(/(\d)$/);
  var num = numMatch ? numMatch[1] : "";
  var isAssign = btnId.indexOf("assign") === 0;
  var fileInput = document.getElementById(
    (isAssign ? "assignDetailDrawingFile" : "statusDetailDrawingFile") + num
  );
  var btn = document.getElementById(btnId);
  var editBtn = document.getElementById(
    (isAssign ? "assignDetailDrawingEdit" : "statusDetailDrawingEdit") + num
  );
  var deleteBtn = document.getElementById(
    (isAssign ? "assignDetailDrawingDelete" : "statusDetailDrawingDelete") + num
  );
  if (!btn || !fileInput) return;

  btn.addEventListener("click", function () {
    var fileName = getModalDrawingFileName(btnId);
    if (fileName) {
      downloadStoredFile(fileName, getModalDrawingData(btnId));
    } else {
      fileInput.click();
    }
  });

  fileInput.addEventListener("change", function () {
    if (fileInput.files && fileInput.files[0]) {
      var file = fileInput.files[0];
      readFileAsDataUrl(file, function (dataUrl) {
        setModalDrawingDisplay(btnId, file.name, dataUrl);
        if (onDrawingChange) {
          onDrawingChange(parseInt(num, 10), file.name, dataUrl);
        }
      });
    }
  });

  if (editBtn) {
    editBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      if (editBtn.disabled) return;
      fileInput.click();
    });
  }

  if (deleteBtn) {
    deleteBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      if (deleteBtn.disabled) return;
      setModalDrawingDisplay(btnId, "", "");
      if (onDrawingChange) {
        onDrawingChange(parseInt(num, 10), "", "");
      }
    });
  }
}

function initAssignDetailDrawingHandlers() {
  if (initializedScreens.assignDetailDrawing) return;
  initializedScreens.assignDetailDrawing = true;

  var saveBtn = document.getElementById("btnAssignDetailSave");
  if (saveBtn) {
    saveBtn.addEventListener("click", function () {
      saveAssignDetailFromModal();
    });
  }

  bindModalDrawingSlot("assignDetailDown1", updateAssignDetailDrawingDraft);
  bindModalDrawingSlot("assignDetailDown2", updateAssignDetailDrawingDraft);
  bindModalDrawingSlot("assignDetailDown3", updateAssignDetailDrawingDraft);
}

function initStatusDetailDrawingHandlers() {
  if (initializedScreens.statusDetailDrawing) return;
  initializedScreens.statusDetailDrawing = true;
  bindModalDrawingSlot("statusDetailDown1", null);
  bindModalDrawingSlot("statusDetailDown2", null);
  bindModalDrawingSlot("statusDetailDown3", null);
}

function getStatusModalDrawingName(num) {
  return getModalDrawingFileName("statusDetailDown" + num);
}

function getStatusModalDrawingData(num) {
  return getModalDrawingData("statusDetailDown" + num);
}

function bindOrderScopeSalesInput(el) {
  if (!el || el.dataset.salesBound === "1") return;
  el.dataset.salesBound = "1";

  el.addEventListener("focus", function () {
    orderScopeSalesBeginEditing(el);
  });

  el.addEventListener("mousedown", function () {
    if (el.disabled) return;
    if (el.value.indexOf("원") >= 0) {
      orderScopeSalesBeginEditing(el);
    }
  });

  el.addEventListener("blur", function () {
    if (!orderSalesDigitsOnly(el.value)) {
      el.value = "";
      return;
    }
    el.value = formatOrderSales(el.value);
  });

  el.addEventListener("input", function () {
    el.value = formatOrderSalesEditing(el.value);
  });

  el.addEventListener("keydown", function (e) {
    var allowed = ["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight", "Home", "End"];
    if (allowed.indexOf(e.key) >= 0) return;
    if (e.ctrlKey || e.metaKey) return;
    if (!/^\d$/.test(e.key)) e.preventDefault();
  });

  el.addEventListener("paste", function (e) {
    e.preventDefault();
    var text = (e.clipboardData || window.clipboardData).getData("text");
    el.value = formatOrderSalesEditing(text);
  });
}

function bindOrderScopeSalesInputs() {
  var list = getOrderScopeSalesListElement();
  if (!list) return;
  list.querySelectorAll(".order-scope-sales-input").forEach(bindOrderScopeSalesInput);
}

function updateOrderScopeSalesEnabled() {
  var active = getOrderScopeValues();
  var list = getOrderScopeSalesListElement();
  ORDER_SCOPE_CODE_ORDER.forEach(function (key) {
    var input = document.getElementById("orderSales-" + key);
    if (!input || (list && !list.contains(input))) return;
    var on = active.indexOf(key) >= 0;
    input.disabled = !on;
    if (!on) input.value = "";
    var cell = input.closest(".order-scope-sales-cell");
    if (cell) {
      cell.classList.toggle("order-scope-sales-cell--active", on);
    }
  });
  updateOrderFieldFilledStates();
}

function buildOrderScopeSalesFromForm() {
  var scopeSales = {};
  var total = 0;
  ORDER_SCOPE_CODE_ORDER.forEach(function (key) {
    var input = document.getElementById("orderSales-" + key);
    if (!input || input.disabled) return;
    var raw = orderSalesDigitsOnly(input.value);
    if (raw) {
      scopeSales[key] = raw;
      total += parseInt(raw, 10) || 0;
    }
  });
  return {
    scopeSales: scopeSales,
    salesAmount: total ? String(total) : "",
    sales: total ? formatOrderSales(String(total)) : "",
  };
}

function hasOrderScopeActionCompleted(order, scopeKey) {
  var info = normalizeOrderScopeWorkInfo(order);
  var d = info[scopeKey] || {};
  if ((d.actionSchedule || "").trim() || (d.actionContent || "").trim()) return true;
  var progress = (d.progress || "").trim();
  return progress === "완료" || progress === "조치완료" || progress === "완료됨";
}

function isOrderScopeOpenForStats(order, scopeKey) {
  if (!isOrderOpen(order)) return false;
  var info = normalizeOrderScopeWorkInfo(order);
  var type = ((info[scopeKey] && info[scopeKey].accidentType) || "").trim();
  return !!type && type !== "선택";
}

function getStatsOpenRatioNumerator(order, scopeKey) {
  if (!isOrderScopeOpenForStats(order, scopeKey)) return 0;
  var total = 0;
  total += 1;
  if (!hasOrderScopeActionCompleted(order, scopeKey)) {
    total += 1;
  }
  if (hasOrderScopeActionCompleted(order, scopeKey)) {
    total += 1;
  }
  return total;
}

function isOrderScopeAssigned(order, scopeKey) {
  var partners = normalizeOrderAssignedPartners(order);
  return !!(partners[scopeKey] || order.assignedPartner || "").trim();
}

function getOrderScopeSalesAmount(order, scopeKey) {
  if (order.scopeSales && order.scopeSales[scopeKey] != null && order.scopeSales[scopeKey] !== "") {
    return parseInt(order.scopeSales[scopeKey], 10) || 0;
  }
  var keys = getOrderScopeKeys(order.scope);
  var total = parseInt(order.salesAmount || orderSalesDigitsOnly(order.sales || ""), 10) || 0;
  if (!keys.length) return total;
  if (keys.length === 1) return total;
  return total / keys.length;
}

function populateOrderSummaryMonthSelect(selectEl, selectedMonth) {
  if (!selectEl) return;
  var current =
    selectedMonth != null && selectedMonth !== ""
      ? String(selectedMonth)
      : selectEl.value || ORDER_SUMMARY_MONTH_ALL;
  var html =
    '<option value="' +
    ORDER_SUMMARY_MONTH_ALL +
    '"' +
    (current === ORDER_SUMMARY_MONTH_ALL ? " selected" : "") +
    ">전체</option>";
  var m;
  for (m = 1; m <= 12; m++) {
    html +=
      '<option value="' +
      m +
      '"' +
      (String(m) === current ? " selected" : "") +
      ">" +
      m +
      "월</option>";
  }
  selectEl.innerHTML = html;
  selectEl.value = current;
}

function syncOrderSummaryFilterFromControls() {
  var yearEl = document.getElementById("orderSummaryYear");
  var monthEl = document.getElementById("orderSummaryMonth");
  orderSummaryFilterState.year = clampOrderYear(
    yearEl ? yearEl.value : orderSummaryFilterState.year
  );
  orderSummaryFilterState.month = monthEl
    ? monthEl.value || ORDER_SUMMARY_MONTH_ALL
    : orderSummaryFilterState.month;
  return orderSummaryFilterState;
}

function orderMatchesOrderSummaryDateFilter(order, year, month) {
  if (!order.constructDate) return false;
  var parts = String(order.constructDate).split("-");
  if (parts.length < 2) return false;
  var orderYear = parseInt(parts[0], 10);
  var orderMonth = parseInt(parts[1], 10);
  if (orderYear !== year) return false;
  if (month === ORDER_SUMMARY_MONTH_ALL || month === "" || month == null) return true;
  return orderMonth === parseInt(month, 10);
}

function buildOrderSummaryData(filters) {
  var activeFilters = filters || orderSummaryFilterState;
  var data = {};
  var totalSales = 0;
  var i;
  var scopeKey;

  ORDER_SCOPE_CODE_ORDER.forEach(function (key) {
    data[key] = { order: 0, unassigned: 0, open: 0, pending: 0, sales: 0 };
  });

  getVisibleOrdersForCurrentUser().forEach(function (order) {
    if (
      !orderMatchesOrderSummaryDateFilter(
        order,
        activeFilters.year,
        activeFilters.month
      )
    ) {
      return;
    }
    var scopeKeys = getOrderScopeKeys(order.scope);
    for (i = 0; i < scopeKeys.length; i++) {
      scopeKey = scopeKeys[i];
      if (!data[scopeKey]) continue;
      data[scopeKey].order += 1;
      if (!isOrderScopeAssigned(order, scopeKey)) {
        data[scopeKey].unassigned += 1;
      }
      if (isOrderScopeOpenForStats(order, scopeKey)) {
        data[scopeKey].open += 1;
        if (!hasOrderScopeActionCompleted(order, scopeKey)) {
          data[scopeKey].pending += 1;
        }
      }
      data[scopeKey].sales += getOrderScopeSalesAmount(order, scopeKey);
    }
  });

  ORDER_SCOPE_CODE_ORDER.forEach(function (key) {
    totalSales += data[key].sales;
  });

  return { rows: data, totalSales: totalSales };
}

function formatOrderSummarySalesDisplay(amount) {
  if (!amount) return "";
  return formatStatsSalesInMillion(amount);
}

function getOrderSummaryOrderRatioDenominator(year) {
  var y = clampOrderYear(year != null ? year : new Date().getFullYear());
  var holidaySet = getStatsKrHolidaySet(y);
  var businessDays = countStatsBusinessDaysInYear(y, holidaySet);
  if (businessDays < 1) businessDays = 1;
  var partnerUserId = getCurrentPartnerUserId();
  var workerCount = getRegisteredWorkers(partnerUserId || "").length;
  if (workerCount < 1) workerCount = 1;
  return workerCount * businessDays;
}

function formatOrderSummaryCellValue(
  metricKey,
  rawValue,
  rowOrder,
  totalSales,
  mode,
  summaryYear
) {
  function normalizeSummaryText(text) {
    var s = text == null ? "" : String(text).trim();
    if (!s) return "-";
    if (s === "0" || s === "0건" || s === "0.0%") return "-";
    return text;
  }

  if (mode === "ratio") {
    if (metricKey === "sales") {
      if (!totalSales) return "-";
      return normalizeSummaryText(formatStatsPercent((rawValue / totalSales) * 100));
    }
    if (metricKey === "order") {
      var orderDenom = getOrderSummaryOrderRatioDenominator(summaryYear);
      if (!orderDenom) return "-";
      return normalizeSummaryText(formatStatsPercent((rawValue / orderDenom) * 100));
    }
    if (!rowOrder) return "-";
    return normalizeSummaryText(formatStatsPercent((rawValue / rowOrder) * 100));
  }
  if (metricKey === "sales") {
    return normalizeSummaryText(formatOrderSummarySalesDisplay(rawValue));
  }
  return normalizeSummaryText(rawValue > 0 ? String(rawValue) + "건" : "");
}

var ORDER_SUMMARY_METRIC_LABELS = {
  order: "시공오더",
  unassigned: "미배정",
  open: "미마감",
  pending: "미결",
  sales: "시공매출",
};

function orderHasSummaryScope(order, scopeKey) {
  return getOrderScopeKeys(order.scope).indexOf(scopeKey) >= 0;
}

function orderMatchesOrderSummaryScopeMetric(order, scopeKey, metricKey) {
  if (!orderHasSummaryScope(order, scopeKey)) return false;
  if (metricKey === "order") return true;
  if (metricKey === "unassigned") return !isOrderScopeAssigned(order, scopeKey);
  if (metricKey === "open") return isOrderScopeOpenForStats(order, scopeKey);
  if (metricKey === "pending") {
    return (
      isOrderScopeOpenForStats(order, scopeKey) &&
      !hasOrderScopeActionCompleted(order, scopeKey)
    );
  }
  if (metricKey === "sales") return true;
  return false;
}

function getOrdersForOrderSummaryCell(scopeKey, metricKey, filters) {
  return getVisibleOrdersForCurrentUser().filter(function (order) {
    if (!orderMatchesOrderSummaryDateFilter(order, filters.year, filters.month)) return false;
    return orderMatchesOrderSummaryScopeMetric(order, scopeKey, metricKey);
  });
}

function formatOrderSummaryFilterPeriodLabel(filters) {
  var monthLabel =
    filters.month === ORDER_SUMMARY_MONTH_ALL ? "전체" : filters.month + "월";
  return filters.year + "년 " + monthLabel;
}

function getOrderScopePartnerDisplay(order, scopeKey) {
  var partners = normalizeOrderAssignedPartners(order);
  return getPartnerDisplayName(partners[scopeKey] || order.assignedPartner || "");
}

function parseOrderConstructDateParts(order) {
  var iso = order && order.constructDate;
  if (!iso) return null;
  var match = String(iso).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  return {
    year: parseInt(match[1], 10),
    month: parseInt(match[2], 10),
    day: parseInt(match[3], 10),
  };
}

function applyAssignPickerForOrder(pageKey, order) {
  var parts = parseOrderConstructDateParts(order);
  var picker = getAssignPicker(pageKey);
  var cfg = getAssignConfig(pageKey);
  if (parts) {
    picker.year = parts.year;
    picker.month = parts.month;
    picker.day = parts.day;
  }
  var yearEl = document.getElementById(cfg.ids.year);
  var monthEl = document.getElementById(cfg.ids.month);
  if (yearEl) yearEl.value = String(picker.year);
  if (monthEl) monthEl.value = String(picker.month);
}

function applyOpenActionFilterToControls(actionFilter) {
  var picker = getAssignPicker("open");
  picker.actionFilter = actionFilter || "pending";
  var group = document.getElementById("openActionFilter");
  if (!group) return;
  group.querySelectorAll("[data-open-action-filter]").forEach(function (btn) {
    var active = btn.getAttribute("data-open-action-filter") === picker.actionFilter;
    btn.classList.toggle("assign-open-filter__btn--active", active);
    btn.setAttribute("aria-pressed", active ? "true" : "false");
  });
}

function focusAssignTableOrderRow(pageKey, orderIndex) {
  var cfg = getAssignConfig(pageKey);
  var tbody = document.getElementById(cfg.ids.tableBody);
  if (!tbody) return;
  var row = tbody.querySelector(
    'tr.assign-table__row-main[data-order-index="' + orderIndex + '"]'
  );
  if (!row) return;
  row.classList.add("assign-table__row-main--highlight");
  row.scrollIntoView({ block: "nearest", behavior: "smooth" });
  window.setTimeout(function () {
    row.classList.remove("assign-table__row-main--highlight");
  }, 2500);
}

function navigateToAssignScreenForOrder(pageKey, orderIndex) {
  var list = getStoredOrders();
  var order = list[orderIndex];
  if (!order) return;

  applyAssignPickerForOrder(pageKey, order);
  showScreen(pageKey === "assign" ? "order-assign" : "order-open");
  window.requestAnimationFrame(function () {
    focusAssignTableOrderRow(pageKey, orderIndex);
  });
}

function openOrderDetailFromSummaryList(orderIndex, scopeKey, metricKey) {
  var list = getStoredOrders();
  if (!list[orderIndex]) return;

  closeModal("modal-order-summary-list");

  if (metricKey === "unassigned") {
    navigateToAssignScreenForOrder("assign", orderIndex);
    return;
  }

  if (metricKey === "pending") {
    applyOpenActionFilterToControls("pending");
    navigateToAssignScreenForOrder("open", orderIndex);
  }
}

function openOrderSummaryListModal(scopeKey, metricKey) {
  var filters = syncOrderSummaryFilterFromControls();
  var scopeLabel = ASSIGN_SCOPE_LABELS[scopeKey] || ORDER_SCOPE_LABELS[scopeKey] || scopeKey;
  var metricLabel = ORDER_SUMMARY_METRIC_LABELS[metricKey] || metricKey;
  var titleEl = document.getElementById("orderSummaryListTitle");
  var metaEl = document.getElementById("orderSummaryListMeta");
  var bodyEl = document.getElementById("orderSummaryListBody");
  var emptyEl = document.getElementById("orderSummaryListEmpty");
  var salesHead = document.getElementById("orderSummaryListSalesHead");
  var orders = getOrdersForOrderSummaryCell(scopeKey, metricKey, filters);
  var showSales = metricKey === "sales";
  var rowNavigates =
    metricKey === "unassigned" || metricKey === "pending";
  var html = "";
  var i;

  orderSummaryListContext.scopeKey = scopeKey;
  orderSummaryListContext.metricKey = metricKey;

  if (titleEl) {
    titleEl.textContent = scopeLabel + " · " + metricLabel;
  }
  if (metaEl) {
    metaEl.textContent =
      formatOrderSummaryFilterPeriodLabel(filters) + " · 총 " + orders.length + "건";
  }
  if (salesHead) salesHead.hidden = !showSales;

  for (i = 0; i < orders.length; i++) {
    var order = orders[i];
    var orderIndex = getOrderIndexInStorage(order.orderNo);
    var salesCell = "";
    if (showSales) {
      var salesAmount = getOrderScopeSalesAmount(order, scopeKey);
      salesCell =
        "<td>" +
        escapeHtml(formatOrderSummarySalesDisplay(salesAmount) || "-") +
        "</td>";
    }
    html +=
      "<tr" +
      (rowNavigates && orderIndex >= 0
        ? ' class="order-summary-list-table__row--clickable" data-order-index="' +
          orderIndex +
          '"'
        : "") +
      ">" +
      "<td>" +
      (i + 1) +
      "</td>" +
      "<td>" +
      escapeHtml(order.orderNo || "") +
      "</td>" +
      "<td>" +
      escapeHtml(
        order.constructDate ? formatOrderConstructDateDisplay(order.constructDate) : ""
      ) +
      "</td>" +
      "<td>" +
      escapeHtml(order.siteName || "") +
      "</td>" +
      "<td>" +
      escapeHtml(getOrderScopePartnerDisplay(order, scopeKey)) +
      "</td>" +
      salesCell +
      "</tr>";
  }

  if (bodyEl) bodyEl.innerHTML = html;
  if (emptyEl) emptyEl.hidden = orders.length > 0;
  if (bodyEl && bodyEl.closest("table")) {
    bodyEl.closest("table").hidden = orders.length === 0;
  }

  openModal("modal-order-summary-list");
}

function buildOrderSummaryCellInnerHtml(metricKey, text, mode) {
  if (metricKey === "sales") {
    var salesBoxClass =
      "order-summary-table__cell-box order-summary-table__cell-box--sales " +
      (mode === "count"
        ? "order-summary-table__cell-box--sales-count"
        : "order-summary-table__cell-box--sales-ratio");
    if (mode === "count" && text && text !== "-" && /[1-9]/.test(String(text))) {
      return (
        '<div class="' +
        salesBoxClass +
        '"><span>' +
        escapeHtml(text) +
        '</span><span class="order-summary-table__sales-unit">백만원</span></div>'
      );
    }
    return (
      '<div class="' +
      salesBoxClass +
      '"><span>' +
      escapeHtml(text) +
      "</span></div>"
    );
  }
  var boxClass = "order-summary-table__cell-box";
  if (metricKey === "unassigned" || metricKey === "pending") {
    boxClass += " order-summary-table__cell-box--alert";
  }
  return (
    '<div class="' + boxClass + '"><span>' + escapeHtml(text) + "</span></div>"
  );
}

function renderOrderSummaryTable() {
  var tbody = document.getElementById("orderSummaryTableBody");
  if (!tbody) return;

  var filters = syncOrderSummaryFilterFromControls();
  var mode = summaryMetricState === "ratio" ? "ratio" : "count";
  var summary = buildOrderSummaryData(filters);
  var html = "";
  var metrics = [
    { key: "order", label: "시공오더" },
    { key: "unassigned", label: "미배정" },
    { key: "open", label: "미마감" },
    { key: "pending", label: "미결" },
    { key: "sales", label: "시공매출" },
  ];

  ORDER_SCOPE_CODE_ORDER.forEach(function (scopeKey) {
    var row = summary.rows[scopeKey] || {
      order: 0,
      unassigned: 0,
      open: 0,
      pending: 0,
      sales: 0,
    };
    var rowLabel = ASSIGN_SCOPE_LABELS[scopeKey] || ORDER_SCOPE_LABELS[scopeKey] || scopeKey;

    html += "<tr>";
    html +=
      '<th class="order-summary-table__row-head" scope="row"><span>' +
      escapeHtml(rowLabel) +
      "</span></th>";

    metrics.forEach(function (metric) {
      var value = row[metric.key] || 0;
      var text = formatOrderSummaryCellValue(
        metric.key,
        value,
        row.order,
        summary.totalSales,
        mode,
        filters.year
      );
      var cellInner = buildOrderSummaryCellInnerHtml(metric.key, text, mode);
      var cellClass =
        metric.key === "sales"
          ? "order-summary-table__cell order-summary-table__cell--sales"
          : "order-summary-table__cell";
      var canOpenList =
        value > 0 &&
        (metric.key === "unassigned" || metric.key === "pending");
      html +=
        '<td class="' +
        cellClass +
        '">' +
        '<button type="button" class="order-summary-table__cell-btn"' +
        ' data-summary-scope="' +
        escapeHtml(scopeKey) +
        '" data-summary-metric="' +
        escapeHtml(metric.key) +
        '"' +
        (canOpenList ? "" : " disabled") +
        ">" +
        cellInner +
        "</button></td>";
    });

    html += "</tr>";
  });

  tbody.innerHTML = html;
}

function syncOrderSummaryMetricFromControls() {
  var metricSelect = document.getElementById("orderSummaryMetricSelect");
  if (metricSelect && isMobileLayout()) {
    summaryMetricState =
      metricSelect.value === "ratio" ? "ratio" : "count";
    applyOrderSummaryMetricToControls();
    return;
  }
  var group = document.getElementById("orderSummaryMetricToggle");
  if (!group) return;
  var active = group.querySelector(".order-summary-toggle__btn--active");
  summaryMetricState = active
    ? active.getAttribute("data-summary-metric") || "count"
    : "count";
  applyOrderSummaryMetricToControls();
}

function initOrderSummaryYearMonthFilters() {
  if (initializedScreens.orderSummaryYm) return;
  initializedScreens.orderSummaryYm = true;

  var yearEl = document.getElementById("orderSummaryYear");
  var monthEl = document.getElementById("orderSummaryMonth");
  if (!yearEl || !monthEl) return;

  populateOrderYearSelect(yearEl, orderSummaryFilterState.year);
  populateOrderSummaryMonthSelect(monthEl, orderSummaryFilterState.month);

  yearEl.addEventListener("change", function () {
    syncOrderSummaryFilterFromControls();
    saveUiState();
    renderOrderSummaryTable();
  });

  monthEl.addEventListener("change", function () {
    syncOrderSummaryFilterFromControls();
    saveUiState();
    renderOrderSummaryTable();
  });
}

function initOrderSummaryTableClicks() {
  if (initializedScreens.orderSummaryTable) return;
  initializedScreens.orderSummaryTable = true;

  var wrap = document.querySelector("#screen-order-summary .order-summary-table-wrap");
  if (!wrap) return;

  wrap.addEventListener("click", function (e) {
    var btn = e.target.closest(".order-summary-table__cell-btn");
    if (!btn || btn.disabled) return;
    e.preventDefault();
    openOrderSummaryListModal(
      btn.getAttribute("data-summary-scope") || "",
      btn.getAttribute("data-summary-metric") || ""
    );
  });
}

function initOrderSummaryListRowClicks() {
  if (initializedScreens.orderSummaryList) return;
  initializedScreens.orderSummaryList = true;

  var bodyEl = document.getElementById("orderSummaryListBody");
  if (!bodyEl) return;

  bodyEl.addEventListener("click", function (e) {
    var row = e.target.closest("tr.order-summary-list-table__row--clickable");
    if (!row) return;
    var metricKey = orderSummaryListContext.metricKey;
    if (metricKey !== "unassigned" && metricKey !== "pending") return;
    var orderIndex = parseInt(row.getAttribute("data-order-index"), 10);
    if (isNaN(orderIndex) || orderIndex < 0) return;
    openOrderDetailFromSummaryList(
      orderIndex,
      orderSummaryListContext.scopeKey || "",
      metricKey
    );
  });
}

function initOrderSummaryMetricToggle() {
  if (initializedScreens.orderSummaryToggle) return;
  initializedScreens.orderSummaryToggle = true;

  var group = document.getElementById("orderSummaryMetricToggle");
  var metricSelect = document.getElementById("orderSummaryMetricSelect");

  if (metricSelect) {
    metricSelect.addEventListener("change", function () {
      syncOrderSummaryMetricFromControls();
      saveUiState();
      renderOrderSummaryTable();
    });
  }

  if (!group) return;

  group.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-summary-metric]");
    if (!btn) return;
    e.preventDefault();
    group.querySelectorAll(".order-summary-toggle__btn").forEach(function (el) {
      var active = el === btn;
      el.classList.toggle("order-summary-toggle__btn--active", active);
      el.setAttribute("aria-pressed", active ? "true" : "false");
    });
    syncOrderSummaryMetricFromControls();
    saveUiState();
    renderOrderSummaryTable();
  });
}

function initOrderSummaryPage(screen) {
  if (!getAuth()) return;

  initLogout(screen);
  initOrderNavDelegation();
  initOrderSummaryMetricToggle();
  initOrderSummaryYearMonthFilters();
  initOrderSummaryTableClicks();
  initOrderSummaryListRowClicks();

  if (!initializedScreens.orderSummary) {
    initializedScreens.orderSummary = true;
  }

  applyUiStateToControls();
  syncOrderSummaryMetricFromControls();
  syncOrderSummaryFilterFromControls();
  renderOrderSummaryTable();
}

function getOrderStatsScopeSalesValue(order, scopeKey, filters) {
  if (filters.metric === "ratio" && filters.mode === "open") {
    return getStatsOpenRatioNumerator(order, scopeKey);
  }
  if (filters.metric !== "sales") return 1;
  if (order.scopeSales && order.scopeSales[scopeKey] != null && order.scopeSales[scopeKey] !== "") {
    return parseInt(order.scopeSales[scopeKey], 10) || 0;
  }
  var keys = getOrderScopeKeys(order.scope);
  var total = parseInt(order.salesAmount || orderSalesDigitsOnly(order.sales || ""), 10) || 0;
  if (!keys.length) return total;
  if (keys.length === 1) return total;
  return total / keys.length;
}

function updateOrderTopbarActive(activeNav, screenEl) {
  if (!screenEl) return;
  var isHomeActive = activeNav === "home";
  var logo = screenEl.querySelector(".order-topbar__logo");
  var auth = getAuth();
  var hideRestrictedNav = !!auth && (auth.role === "partner" || auth.role === "worker");

  if (logo) {
    logo.classList.toggle("order-topbar__logo--active", isHomeActive);
  }

  screenEl.querySelectorAll("[data-order-nav]").forEach(function (link) {
    var nav = link.getAttribute("data-order-nav");
    if (nav === "home") return;
    if (hideRestrictedNav && (nav === "order" || nav === "assign")) {
      link.style.display = "none";
      return;
    }
    link.style.display = "";
    var isActive = !isHomeActive && nav === activeNav;
    link.classList.toggle("order-topbar__link--active", isActive);
  });
}

function updateOrderLoginMessage() {
  var active = document.querySelector(".screen.is-active");
  var el = active ? active.querySelector(".order-topbar__login-msg") : null;
  if (!el) return;
  var auth = getAuth();
  if (auth) {
    var id = auth.userId || auth.name || "사용자";
    el.textContent = id + "님이 로그인중입니다.";
  } else {
    el.textContent = "";
  }
}

function getStoredOrders() {
  try {
    var raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveStoredOrders(orders) {
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  localStorage.setItem(EFFEX_CLOUD_REV_KEY, String(Date.now()));
  saveUiState();
  notifyEffexDataChanged();
  scheduleCloudSync();
}

var effexDataChannel =
  typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("effex-data") : null;
var cloudSyncTimer = null;
var cloudSyncRunning = false;
var cloudPullTimer = null;

function notifyEffexDataChanged() {
  window.dispatchEvent(new CustomEvent("effex-data-changed"));
  if (effexDataChannel) {
    try {
      effexDataChannel.postMessage({ t: Date.now() });
    } catch (e) {
      /* ignore */
    }
  }
}

function jsonBlobUrl(id) {
  return "https://jsonblob.com/api/jsonBlob/" + id;
}

function getCloudDataBlobId() {
  return localStorage.getItem(EFFEX_CLOUD_DATA_ID_KEY) || "";
}

function setCloudDataBlobId(id) {
  if (id) localStorage.setItem(EFFEX_CLOUD_DATA_ID_KEY, id);
}

function buildCloudPayload() {
  return {
    orders: getStoredOrders(),
    users: getRegisteredUsers(),
    updatedAt: Date.now(),
  };
}

function applyCloudPayload(payload) {
  if (!payload || !payload.updatedAt) return false;
  var localRev = parseInt(localStorage.getItem(EFFEX_CLOUD_REV_KEY) || "0", 10);
  if (payload.updatedAt <= localRev) return false;
  if (Array.isArray(payload.orders)) {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(payload.orders));
  }
  if (Array.isArray(payload.users)) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(payload.users));
  }
  localStorage.setItem(EFFEX_CLOUD_REV_KEY, String(payload.updatedAt));
  loadUiState();
  applyUiStateToControls();
  refreshDataFromStorage();
  return true;
}

function fetchJsonBlob(id) {
  return fetch(jsonBlobUrl(id), { cache: "no-store" }).then(function (res) {
    if (!res.ok) return null;
    return res.json();
  });
}

function createJsonBlob(data) {
  return fetch("https://jsonblob.com/api/jsonBlob", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data || {}),
  }).then(function (res) {
    if (!res.ok) return "";
    var loc = res.headers.get("Location") || "";
    var parts = loc.split("/");
    return parts[parts.length - 1] || "";
  });
}

function putJsonBlob(id, data) {
  return fetch(jsonBlobUrl(id), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

function resolveCloudDataBlobId() {
  var cached = getCloudDataBlobId();
  if (cached) {
    return Promise.resolve(cached);
  }
  return fetchJsonBlob(EFFEX_CLOUD_POINTER).then(function (pointer) {
    if (pointer && pointer.dataBlobId) {
      setCloudDataBlobId(pointer.dataBlobId);
      return pointer.dataBlobId;
    }
    return "";
  });
}

function ensureCloudDataBlobId() {
  return resolveCloudDataBlobId().then(function (id) {
    if (id) return id;
    var payload = buildCloudPayload();
    return createJsonBlob(payload).then(function (newId) {
      if (!newId) return "";
      setCloudDataBlobId(newId);
      return putJsonBlob(EFFEX_CLOUD_POINTER, {
        dataBlobId: newId,
        updatedAt: payload.updatedAt,
      })
        .catch(function () {
          /* pointer PUT may fail on first use */
        })
        .then(function () {
          return newId;
        });
    });
  });
}

function scheduleCloudSync() {
  if (!getAuth()) return;
  clearTimeout(cloudSyncTimer);
  cloudSyncTimer = setTimeout(runCloudSync, 400);
}

function runCloudSync() {
  if (!getAuth() || cloudSyncRunning) return;
  cloudSyncRunning = true;
  pullCloudData(true)
    .then(function () {
      return pushCloudData();
    })
    .finally(function () {
      cloudSyncRunning = false;
    });
}

function pullCloudData(silent) {
  if (!getAuth()) return Promise.resolve();
  return resolveCloudDataBlobId()
    .then(function (id) {
      if (!id) return null;
      return fetchJsonBlob(id);
    })
    .then(function (remote) {
      if (remote) applyCloudPayload(remote);
    })
    .catch(function () {
      if (!silent) {
        /* offline */
      }
    });
}

function pushCloudData() {
  if (!getAuth()) return Promise.resolve();
  return ensureCloudDataBlobId()
    .then(function (id) {
      if (!id) return;
      var payload = buildCloudPayload();
      return putJsonBlob(id, payload).then(function (res) {
        if (!res.ok) return;
        localStorage.setItem(EFFEX_CLOUD_REV_KEY, String(payload.updatedAt));
        return putJsonBlob(EFFEX_CLOUD_POINTER, {
          dataBlobId: id,
          updatedAt: payload.updatedAt,
        }).catch(function () {
          /* ignore */
        });
      });
    })
    .catch(function () {
      /* offline */
    });
}

function bindEffexDataListeners() {
  window.addEventListener("effex-data-changed", refreshDataFromStorage);
  if (effexDataChannel) {
    effexDataChannel.onmessage = function () {
      refreshDataFromStorage();
    };
  }
}

function startCloudPullInterval() {
  if (cloudPullTimer) return;
  cloudPullTimer = setInterval(function () {
    if (getAuth()) pullCloudData(true);
  }, EFFEX_CLOUD_PULL_MS);
}

function loadUiState() {
  try {
    var raw = localStorage.getItem(UI_STATE_KEY);
    if (!raw) return;
    var state = JSON.parse(raw);
    if (state.orderSummary) {
      if (state.orderSummary.year != null) {
        orderSummaryFilterState.year = clampOrderYear(state.orderSummary.year);
      }
      if (state.orderSummary.month != null) {
        orderSummaryFilterState.month = state.orderSummary.month;
      }
      if (state.orderSummary.metric) {
        summaryMetricState =
          state.orderSummary.metric === "ratio" ? "ratio" : "count";
      }
    }
    if (state.assign) {
      ["assign", "status", "open"].forEach(function (key) {
        if (!state.assign[key] || !assignPickerStates[key]) return;
        var saved = state.assign[key];
        var picker = assignPickerStates[key];
        if (saved.year != null) picker.year = clampOrderYear(saved.year);
        if (saved.month != null) picker.month = parseInt(saved.month, 10) || picker.month;
        if (saved.day != null) picker.day = parseInt(saved.day, 10) || picker.day;
        if (saved.workerFilter != null) picker.workerFilter = saved.workerFilter;
        if (saved.actionFilter != null) picker.actionFilter = saved.actionFilter;
      });
    }
    if (state.stats && state.stats.picker) {
      var sp = state.stats.picker;
      if (sp.year != null) statsPickerState.year = clampOrderYear(sp.year);
      if (sp.mode) statsPickerState.mode = sp.mode;
      if (sp.view) statsPickerState.view = sp.view;
    }
    if (state.stats && state.stats.filters) {
      statsUiFilterState = state.stats.filters;
    }
  } catch (e) {
    /* ignore */
  }
}

var statsUiFilterState = null;

function saveUiState() {
  try {
    var statsFilters = null;
    if (document.getElementById("statsYear")) {
      statsFilters = {
        year: document.getElementById("statsYear").value,
        partner: document.getElementById("statsPartner")
          ? document.getElementById("statsPartner").value
          : STATS_FILTER_ALL,
        worker: document.getElementById("statsWorker")
          ? document.getElementById("statsWorker").value
          : STATS_FILTER_ALL,
        item: document.getElementById("statsItem")
          ? document.getElementById("statsItem").value
          : "",
        aggregate: document.getElementById("statsAggregate")
          ? document.getElementById("statsAggregate").value
          : "count",
        rank: document.getElementById("statsRank")
          ? document.getElementById("statsRank").value
          : "best",
      };
    }
    localStorage.setItem(
      UI_STATE_KEY,
      JSON.stringify({
        orderSummary: {
          year: orderSummaryFilterState.year,
          month: orderSummaryFilterState.month,
          metric: summaryMetricState,
        },
        assign: assignPickerStates,
        stats: {
          picker: statsPickerState,
          filters: statsFilters,
        },
      })
    );
  } catch (e) {
    /* ignore */
  }
}

function applyUiStateToControls() {
  var yearEl = document.getElementById("orderSummaryYear");
  var monthEl = document.getElementById("orderSummaryMonth");
  if (yearEl) yearEl.value = String(orderSummaryFilterState.year);
  if (monthEl) monthEl.value = orderSummaryFilterState.month;
  applyOrderSummaryMetricToControls();

  ["assign", "status", "open"].forEach(function (pageKey) {
    var cfg = getAssignConfig(pageKey);
    var picker = getAssignPicker(pageKey);
    var y = document.getElementById(cfg.ids.year);
    var m = document.getElementById(cfg.ids.month);
    if (y) y.value = String(picker.year);
    if (m) m.value = String(picker.month);
  });

  var statsYear = document.getElementById("statsYear");
  if (statsYear) statsYear.value = String(statsPickerState.year);

  if (statsUiFilterState) {
    var sf = statsUiFilterState;
    var partnerEl = document.getElementById("statsPartner");
    var workerEl = document.getElementById("statsWorker");
    var itemEl = document.getElementById("statsItem");
    var aggregateEl = document.getElementById("statsAggregate");
    var rankEl = document.getElementById("statsRank");
    if (statsYear && sf.year != null) statsYear.value = String(sf.year);
    if (partnerEl && sf.partner != null) partnerEl.value = sf.partner;
    if (workerEl && sf.worker != null) workerEl.value = sf.worker;
    if (itemEl && sf.item != null) itemEl.value = sf.item;
    if (aggregateEl && sf.aggregate != null) aggregateEl.value = sf.aggregate;
    if (rankEl && sf.rank != null) rankEl.value = sf.rank;
  }
}

function applyOrderSummaryMetricToControls() {
  var metric = summaryMetricState === "ratio" ? "ratio" : "count";
  var group = document.getElementById("orderSummaryMetricToggle");
  if (group) {
    group.querySelectorAll("[data-summary-metric]").forEach(function (btn) {
      var active = btn.getAttribute("data-summary-metric") === metric;
      btn.classList.toggle("order-summary-toggle__btn--active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }
  var metricSelect = document.getElementById("orderSummaryMetricSelect");
  if (metricSelect) metricSelect.value = metric;
}

function isMobileLayout() {
  return window.matchMedia("(max-width: 768px)").matches;
}

function refreshDataFromStorage() {
  loadUiState();
  applyUiStateToControls();
  var active = document.querySelector(".screen.is-active");
  if (!active) return;
  var page = active.id.replace(/^screen-/, "");
  if (page === "order-summary") {
    renderOrderSummaryTable();
  } else if (page === "order-stats") {
    renderStatsView();
  } else if (page === "order-assign") {
    renderAssignCalendars("assign");
    renderAssignTable("assign");
  } else if (page === "order-status") {
    renderAssignCalendars("status");
    renderAssignTable("status");
  } else if (page === "order-open") {
    renderAssignCalendars("open");
    renderAssignTable("open");
  }
}

var crossTabDataSyncBound = false;
var lastMobileLayoutState = null;

function bindCrossTabDataSync() {
  if (crossTabDataSyncBound) return;
  crossTabDataSyncBound = true;
  lastMobileLayoutState = isMobileLayout();

  window.addEventListener("focus", function () {
    pullCloudData(true);
    refreshDataFromStorage();
  });
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) {
      pullCloudData(true);
      refreshDataFromStorage();
    }
  });
  window.addEventListener("pageshow", function (e) {
    if (e.persisted) {
      pullCloudData(true);
      refreshDataFromStorage();
    }
  });
  window.addEventListener("resize", function () {
    var nowMobile = isMobileLayout();
    if (nowMobile !== lastMobileLayoutState) {
      lastMobileLayoutState = nowMobile;
      pullCloudData(true);
      refreshDataFromStorage();
    }
  });
}

function getOrderScopePrefix() {
  var selected = getOrderScopeValues();
  var prefix = "";

  ORDER_SCOPE_CODE_ORDER.forEach(function (key) {
    if (selected.indexOf(key) >= 0 && ORDER_SCOPE_CODES[key]) {
      prefix += ORDER_SCOPE_CODES[key];
    }
  });

  return prefix;
}

function generateOrderNumber() {
  var prefix = getOrderScopePrefix();
  var digitLen = 7 - prefix.length;

  if (digitLen < 1) {
    prefix = prefix.slice(0, 6);
    digitLen = 1;
  }

  var orders = getStoredOrders();
  var used = {};
  orders.forEach(function (o) {
    if (o.orderNo) used[o.orderNo] = true;
  });

  var num;
  var attempts = 0;
  do {
    var max = Math.pow(10, digitLen);
    var n = Math.floor(Math.random() * max);
    var digits = String(n);
    while (digits.length < digitLen) {
      digits = "0" + digits;
    }
    num = prefix + digits;
    attempts++;
  } while (used[num] && attempts < 200);

  return num;
}

function getOrderScopeGroupElement() {
  return document.getElementById("orderScopeGroup");
}

function getOrderScopeSalesListElement() {
  return document.getElementById("orderScopeSalesList");
}

function getOrderScopeValues() {
  var group = getOrderScopeGroupElement();
  if (!group) return [];
  var values = [];
  group.querySelectorAll(".order-scope-option--active").forEach(function (btn) {
    values.push(btn.getAttribute("data-value"));
  });
  return values;
}

function formatOrderConstructDateDisplay(iso) {
  if (!iso) return "";
  var parts = iso.split("-");
  if (parts.length !== 3) return iso;
  return parts[0] + "년 " + parseInt(parts[1], 10) + "월 " + parseInt(parts[2], 10) + "일";
}

function getOrderConstructDateIso() {
  var input = document.getElementById("orderConstructDate");
  return input ? input.getAttribute("data-iso") || "" : "";
}

function setOrderConstructDate(iso) {
  var input = document.getElementById("orderConstructDate");
  if (!input) return;
  input.setAttribute("data-iso", iso || "");
  input.value = iso ? formatOrderConstructDateDisplay(iso) : "";
  orderDatePickerState.selectedIso = iso || "";
  updateOrderFieldFilledStates();
}

function renderOrderDatePickerGrid() {
  var grid = document.getElementById("orderDatePickerGrid");
  var title = document.getElementById("orderDatePickerTitle");
  if (!grid || !title) return;

  var year = orderDatePickerState.year;
  var month = orderDatePickerState.month;
  var lastDate = new Date(year, month, 0).getDate();
  var firstWeekday = new Date(year, month - 1, 1).getDay();
  var html = "";
  var d;

  title.textContent = year + "년 " + month + "월";

  for (d = 0; d < firstWeekday; d++) {
    html += '<button type="button" class="order-date-picker__day order-date-picker__day--blank" tabindex="-1" disabled></button>';
  }

  for (d = 1; d <= lastDate; d++) {
    var iso =
      year +
      "-" +
      String(month).padStart(2, "0") +
      "-" +
      String(d).padStart(2, "0");
    var selected = orderDatePickerState.selectedIso === iso ? " order-date-picker__day--selected" : "";
    html +=
      '<button type="button" class="order-date-picker__day' +
      selected +
      '" data-iso="' +
      iso +
      '">' +
      d +
      "</button>";
  }

  grid.innerHTML = html;

  grid.querySelectorAll(".order-date-picker__day[data-iso]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setOrderConstructDate(btn.getAttribute("data-iso"));
      closeOrderDatePicker();
    });
  });
}

function openOrderDatePicker() {
  var popup = document.getElementById("orderDatePickerPopup");
  var btn = document.getElementById("btnOrderDatePicker");
  if (!popup || !btn) return;

  var existing = getOrderConstructDateIso();
  var base = existing ? new Date(existing) : new Date();
  orderDatePickerState.year = clampOrderYear(base.getFullYear());
  orderDatePickerState.month = base.getMonth() + 1;
  orderDatePickerState.selectedIso = existing;

  renderOrderDatePickerGrid();

  if (isMobileOrderViewport()) {
    bindOrderDatePickerMobileViewport();
    clearMobileOrderDatePickerPosition(popup);
    var backdrop = ensureOrderDatePickerBackdrop();
    mountOrderDatePickerToBodyIfMobile();
    if (popup.parentNode !== backdrop) {
      backdrop.appendChild(popup);
    }
    document.body.classList.add("order-date-picker-modal-open");
    backdrop.hidden = false;
    backdrop.setAttribute("aria-hidden", "false");
    popup.hidden = false;
    applyMobileOrderDatePickerCenter(popup);
    requestAnimationFrame(function () {
      mountOrderDatePickerToBodyIfMobile();
      applyMobileOrderDatePickerCenter(popup);
    });
    window.setTimeout(function () {
      if (!popup.hidden && isMobileOrderViewport()) {
        mountOrderDatePickerToBodyIfMobile();
        applyMobileOrderDatePickerCenter(popup);
      }
    }, 50);
    return;
  } else {
    restoreOrderDatePickerFromBody();
    clearMobileOrderDatePickerPosition(popup);
    popup.hidden = false;
    var rect = btn.getBoundingClientRect();
    popup.style.position = "fixed";
    popup.style.top = rect.bottom + 8 + "px";
    popup.style.left = rect.left + "px";
    popup.style.right = "auto";
    popup.style.bottom = "auto";
    popup.style.transform = "";
    popup.style.zIndex = "1000";
  }
}

function closeOrderDatePicker() {
  var popup = document.getElementById("orderDatePickerPopup");
  if (!popup) return;
  popup.hidden = true;
  var backdrop = document.getElementById("orderDatePickerBackdrop");
  if (backdrop) {
    backdrop.hidden = true;
    backdrop.setAttribute("aria-hidden", "true");
  }
  document.body.classList.remove("order-date-picker-modal-open");
  clearMobileOrderDatePickerPosition(popup);
  if (isMobileOrderViewport()) {
    restoreOrderDatePickerFromBody();
  }
}

function clampOrderYear(year) {
  var y = parseInt(year, 10);
  if (!isFinite(y)) y = ORDER_YEAR_MIN;
  if (y < ORDER_YEAR_MIN) return ORDER_YEAR_MIN;
  if (y > ORDER_YEAR_MAX) return ORDER_YEAR_MAX;
  return y;
}

function populateOrderYearSelect(selectEl, selectedYear) {
  if (!selectEl) return;
  var current = clampOrderYear(
    selectedYear != null ? selectedYear : selectEl.value || ORDER_YEAR_MIN
  );
  var html = "";
  var y;
  for (y = ORDER_YEAR_MIN; y <= ORDER_YEAR_MAX; y++) {
    html +=
      '<option value="' +
      y +
      '"' +
      (y === current ? " selected" : "") +
      ">" +
      y +
      "년</option>";
  }
  selectEl.innerHTML = html;
  selectEl.value = String(current);
}

function populateAllOrderYearSelects() {
  ORDER_YEAR_SELECT_IDS.forEach(function (id) {
    populateOrderYearSelect(document.getElementById(id));
  });
}

function shiftOrderDatePickerMonth(delta) {
  orderDatePickerState.month += delta;
  if (orderDatePickerState.month > 12) {
    orderDatePickerState.month = 1;
    orderDatePickerState.year += 1;
  } else if (orderDatePickerState.month < 1) {
    orderDatePickerState.month = 12;
    orderDatePickerState.year -= 1;
  }
  orderDatePickerState.year = clampOrderYear(orderDatePickerState.year);
  renderOrderDatePickerGrid();
}

function initOrderDatePicker() {
  if (initializedScreens.orderDatePicker) return;
  initializedScreens.orderDatePicker = true;

  var openBtn = document.getElementById("btnOrderDatePicker");
  var popup = document.getElementById("orderDatePickerPopup");
  var prevBtn = document.getElementById("orderDatePickerPrev");
  var nextBtn = document.getElementById("orderDatePickerNext");

  ensureOrderDatePickerBackdrop();

  if (openBtn) {
    openBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (popup && !popup.hidden) {
        closeOrderDatePicker();
        return;
      }
      orderDatePickerOpening = true;
      openOrderDatePicker();
      window.setTimeout(function () {
        orderDatePickerOpening = false;
      }, 0);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      shiftOrderDatePickerMonth(-1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      shiftOrderDatePickerMonth(1);
    });
  }

  document.addEventListener("click", function (e) {
    if (orderDatePickerOpening) return;
    if (!popup || popup.hidden) return;
    if (
      e.target.closest("#orderDatePickerPopup") ||
      e.target.closest("#btnOrderDatePicker") ||
      e.target.closest("#orderDatePickerBackdrop")
    ) {
      return;
    }
    closeOrderDatePicker();
  });
}

function validateOrderForm() {
  var constructDate = getOrderConstructDateIso();
  var scopes = getOrderScopeValues();
  var siteName = document.getElementById("orderSiteName").value.trim();
  var city = document.getElementById("orderCity").value;
  var district = document.getElementById("orderDistrict").value;
  var address = document.getElementById("orderAddress").value.trim();

  if (!constructDate) {
    alert("시공일자를 선택해 주세요.");
    document.getElementById("btnOrderDatePicker").focus();
    return false;
  }

  if (scopes.length === 0) {
    alert("시공구분을 1개 이상 선택해 주세요.");
    return false;
  }

  if (!siteName) {
    alert("현장명을 입력해 주세요.");
    document.getElementById("orderSiteName").focus();
    return false;
  }

  if (!city || !district) {
    alert("권역(도/시, 군/구)을 선택해 주세요.");
    return false;
  }

  if (!address) {
    alert("상세주소를 입력해 주세요.");
    document.getElementById("orderAddress").focus();
    return false;
  }

  var missingScope = null;
  var i;
  for (i = 0; i < scopes.length; i++) {
    var scopeKey = scopes[i];
    var salesInput = document.getElementById("orderSales-" + scopeKey);
    if (!salesInput) continue;
    if (!orderSalesDigitsOnly(salesInput.value)) {
      missingScope = scopeKey;
      break;
    }
  }

  if (missingScope) {
    var label = ORDER_SCOPE_LABELS[missingScope] || missingScope;
    alert(label + " 시공매출을 입력해 주세요.");
    var focusInput = document.getElementById("orderSales-" + missingScope);
    if (focusInput) focusInput.focus();
    return false;
  }

  return true;
}

function buildOrderRecord(orderNo) {
  var auth = getAuth();
  var salesData = buildOrderScopeSalesFromForm();
  return {
    orderNo: orderNo,
    constructDate: getOrderConstructDateIso(),
    scope: getOrderScopeValues(),
    siteName: document.getElementById("orderSiteName").value.trim(),
    city: document.getElementById("orderCity").value,
    district: document.getElementById("orderDistrict").value,
    address: document.getElementById("orderAddress").value.trim(),
    scopeSales: salesData.scopeSales,
    sales: salesData.sales,
    salesAmount: salesData.salesAmount,
    issue: document.getElementById("orderIssue").value.trim(),
    drawing1: document.getElementById("orderDrawing1").value,
    drawing2: document.getElementById("orderDrawing2").value,
    drawing3: document.getElementById("orderDrawing3").value,
    createdBy: auth ? auth.userId : "",
    createdAt: new Date().toISOString(),
  };
}

function updateOrderFieldFilledStates() {
  var form = document.getElementById("orderForm");
  if (!form) return;

  form.querySelectorAll(".order-field__control").forEach(function (control) {
    var filled = false;

    if (
      control.querySelector(".order-scope-options") ||
      control.querySelector(".order-scope-sales-options")
    ) {
      return;
    }

    control.querySelectorAll("input:not([type='file']), select").forEach(function (el) {
        if (el.disabled) return;
        if (el.tagName === "SELECT" && el.value) {
          filled = true;
        } else if (el.value && String(el.value).trim()) {
          filled = true;
        }
      });

    control.classList.toggle("order-field__control--filled", filled);
  });
}

function resetOrderForm() {
  setOrderConstructDate("");

  var scopeGroup = getOrderScopeGroupElement();
  if (scopeGroup) {
    scopeGroup.querySelectorAll(".order-scope-option").forEach(function (btn) {
      btn.classList.toggle(
        "order-scope-option--active",
        btn.getAttribute("data-value") === "kitchen-product"
      );
    });
  }

  var siteName = document.getElementById("orderSiteName");
  var address = document.getElementById("orderAddress");
  var issue = document.getElementById("orderIssue");
  if (siteName) siteName.value = "";
  if (address) address.value = "";
  if (issue) issue.value = "";

  var salesList = getOrderScopeSalesListElement();
  if (salesList) {
    salesList.querySelectorAll(".order-scope-sales-input").forEach(function (input) {
      input.value = "";
    });
  }
  updateOrderScopeSalesEnabled();

  ["orderDrawing1", "orderDrawing2", "orderDrawing3"].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.value = "";
  });

  ["orderDrawingFile1", "orderDrawingFile2", "orderDrawingFile3"].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.value = "";
  });

  [1, 2, 3].forEach(function (n) {
    updateOrderDrawingDeleteState(n);
  });

  var citySelect = document.getElementById("orderCity");
  var districtSelect = document.getElementById("orderDistrict");
  if (citySelect) {
    citySelect.value = "";
    citySelect.dispatchEvent(new Event("change"));
  }
  if (districtSelect) {
    districtSelect.value = "";
    districtSelect.disabled = true;
  }

  updateOrderFieldFilledStates();
}

function registerOrder() {
  if (!validateOrderForm()) return;

  var orderNo = generateOrderNumber();
  var orders = getStoredOrders();
  orders.push(buildOrderRecord(orderNo));
  saveStoredOrders(orders);

  alert("등록이 완료되었습니다.\n오더번호: " + orderNo);
  resetOrderForm();
}

function getEventTargetElement(event) {
  var target = event && event.target;
  if (!target) return null;
  return target.nodeType === 1 ? target : target.parentElement || null;
}

function initOrderNavDelegation() {
  if (initializedScreens.orderNav) return;
  initializedScreens.orderNav = true;
  var lastNavHandledAt = 0;
  var lastNavTarget = "";
  var touchMoved = false;

  function handleOrderTopbarNav(e) {
    var target = getEventTargetElement(e);
    if (!target) return;

    var editProfile = target.closest("[data-action='signup-edit']");
    if (
      editProfile &&
      (editProfile.closest(".order-topbar__aside") ||
        editProfile.closest(".order-mobile-footer"))
    ) {
      e.preventDefault();
      if (getAuth()) goToSignupEdit();
      return;
    }

    var link = target.closest("[data-order-nav]");
    if (!link || !link.closest(".order-page")) return;
    e.preventDefault();
    var nav = link.getAttribute("data-order-nav");
    if (nav === "order") {
      if (!canAccessOrderPageByRole("order")) {
        showScreen("order-status");
        return;
      }
      showScreen("order");
      return;
    }
    if (nav === "assign") {
      if (!canAccessOrderPageByRole("order-assign")) {
        showScreen("order-status");
        return;
      }
      showScreen("order-assign");
      return;
    }
    if (nav === "status") {
      showScreen("order-status");
      return;
    }
    if (nav === "open") {
      showScreen("order-open");
      return;
    }
    if (nav === "stats") {
      showScreen("order-stats");
      return;
    }
    if (nav === "home") {
      showScreen("order-summary");
      return;
    }
    alert("준비 중인 메뉴입니다.");
  }

  function shouldSkipDuplicate(e, targetKey) {
    var now = Date.now();
    var duplicate =
      now - lastNavHandledAt < 450 &&
      targetKey &&
      lastNavTarget &&
      targetKey === lastNavTarget;
    if (!duplicate) return false;
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    return true;
  }

  function markHandled(targetKey) {
    lastNavHandledAt = Date.now();
    lastNavTarget = targetKey || "";
  }

  function getNavTargetKey(e) {
    var target = getEventTargetElement(e);
    if (!target) return "";
    var navLink = target.closest("[data-order-nav]");
    if (navLink) return "nav:" + (navLink.getAttribute("data-order-nav") || "");
    var editProfile = target.closest("[data-action='signup-edit']");
    if (editProfile) return "action:signup-edit";
    return "";
  }

  function runOrderNavDelegation(e) {
    if (e && e.type === "touchmove") {
      touchMoved = true;
      return;
    }
    if (e && e.type === "touchstart") {
      touchMoved = false;
      return;
    }
    if (e && e.type === "touchend" && touchMoved) return;
    var key = getNavTargetKey(e);
    if (shouldSkipDuplicate(e, key)) return;
    if (key) markHandled(key);
    handleOrderTopbarNav(e);
  }

  // iOS/모바일 환경에서 click 누락이 발생할 수 있어 touchend도 함께 처리
  document.addEventListener("click", runOrderNavDelegation);
  document.addEventListener("pointerup", runOrderNavDelegation);
  document.addEventListener("touchstart", runOrderNavDelegation, { passive: true });
  document.addEventListener("touchmove", runOrderNavDelegation, { passive: true });
  document.addEventListener("touchend", runOrderNavDelegation, { passive: false });

  // 모바일 브라우저에서 문서 위임이 누락되는 케이스를 막기 위해
  // 상단 메뉴/가입수정에도 직접 이벤트를 보조로 바인딩한다.
  var topbarTargets = document.querySelectorAll(
    ".order-page [data-order-nav], .order-page [data-action='signup-edit'], .order-mobile-footer [data-action='signup-edit']"
  );
  topbarTargets.forEach(function (el) {
    if (!el || el.dataset.orderNavBound === "1") return;
    el.dataset.orderNavBound = "1";
    el.addEventListener("click", runOrderNavDelegation);
    el.addEventListener("pointerup", runOrderNavDelegation);
    el.addEventListener("touchstart", runOrderNavDelegation, { passive: true });
    el.addEventListener("touchmove", runOrderNavDelegation, { passive: true });
    el.addEventListener("touchend", runOrderNavDelegation, { passive: false });
  });
}

function formatOrderScopeLabels(scope) {
  if (!scope || !scope.length) return "";
  var labels = [];
  ORDER_SCOPE_CODE_ORDER.forEach(function (key) {
    if (scope.indexOf(key) >= 0 && ORDER_SCOPE_LABELS[key]) {
      labels.push(ORDER_SCOPE_LABELS[key]);
    }
  });
  return labels.join(", ");
}

function formatAssignScopeLabels(scope) {
  if (!scope || !scope.length) return "";
  var labels = [];
  ORDER_SCOPE_CODE_ORDER.forEach(function (key) {
    if (scope.indexOf(key) >= 0 && ASSIGN_SCOPE_LABELS[key]) {
      labels.push(ASSIGN_SCOPE_LABELS[key]);
    }
  });
  return labels.join(", ");
}

function getOrderScopeKeys(scope) {
  if (!scope || !scope.length) return [];
  return ORDER_SCOPE_CODE_ORDER.filter(function (key) {
    return scope.indexOf(key) >= 0;
  });
}

function formatAssignPartnerLabels(order) {
  var keys = getOrderScopeKeys(order.scope);
  var partners = normalizeOrderAssignedPartners(order);
  if (!keys.length) return getPartnerDisplayName(order.assignedPartner);
  var labels = keys
    .map(function (key) {
      return getPartnerDisplayName(partners[key] || "");
    })
    .filter(Boolean);
  return labels.length ? labels.join(", ") : getPartnerDisplayName(order.assignedPartner);
}

function normalizeOrderAssignedPartners(order) {
  var partners = order.assignedPartners;
  if (partners && typeof partners === "object" && !Array.isArray(partners)) {
    return partners;
  }
  partners = {};
  var keys = getOrderScopeKeys(order.scope);
  if (order.assignedPartner && keys.length) {
    keys.forEach(function (key) {
      partners[key] = order.assignedPartner;
    });
  } else if (order.assignedPartner) {
    partners["kitchen-wood"] = order.assignedPartner;
  }
  return partners;
}

function syncOrderAssignedPartner(order) {
  var partners = normalizeOrderAssignedPartners(order);
  var keys = getOrderScopeKeys(order.scope);
  var first = "";
  var i;
  for (i = 0; i < keys.length; i++) {
    if (partners[keys[i]]) {
      first = partners[keys[i]];
      break;
    }
  }
  order.assignedPartners = partners;
  order.assignedPartner = first;
}

function isOrderAssigned(order) {
  if ((order.assignedPartner || "").trim()) return true;
  var partners = normalizeOrderAssignedPartners(order);
  var keys = getOrderScopeKeys(order.scope);
  var i;
  for (i = 0; i < keys.length; i++) {
    if ((partners[keys[i]] || "").trim()) return true;
  }
  return false;
}

function getAssignPartnerOptions(selectedUserId, scopeKey) {
  var partners = getRegisteredPartners();
  if (scopeKey) {
    partners = partners.filter(function (p) {
      if (!p.scope || !p.scope.length) return true;
      return p.scope.indexOf(scopeKey) >= 0;
    });
  }
  var html = '<option value="">선택</option>';

  function optionTag(value, label) {
    var selected = selectedUserId && selectedUserId === value ? " selected" : "";
    return '<option value="' + escapeHtml(value) + '"' + selected + ">" + escapeHtml(label) + "</option>";
  }

  partners.forEach(function (p) {
    var name = p.partnerCompany || p.name || p.userId;
    html += optionTag(p.userId, name);
  });
  return html;
}

function getAssignWorkerOptions(selectedWorker, partnerUserId, scopeKey) {
  var workers = getRegisteredWorkers(partnerUserId);
  if (scopeKey) {
    workers = workers.filter(function (w) {
      if (!w.scope || !w.scope.length) return true;
      return w.scope.indexOf(scopeKey) >= 0;
    });
  }
  var html = '<option value="">선택</option>';
  var normalizedSelected = (selectedWorker || "").trim();

  workers.forEach(function (w) {
    var workerId = (w.userId || "").trim();
    var workerName = (w.name || workerId).trim();
    var selected =
      normalizedSelected &&
      (normalizedSelected === workerId || normalizedSelected === workerName)
        ? " selected"
        : "";
    html +=
      '<option value="' +
      escapeHtml(workerId) +
      '"' +
      selected +
      ">" +
      escapeHtml(workerName || workerId) +
      "</option>";
  });
  return html;
}

function renderAssignScopeCell(order, useStack, scopeKeys) {
  var keys = scopeKeys || getOrderScopeKeys(order.scope);
  if (!useStack || keys.length <= 1) {
    var text = keys.length === 1 ? ASSIGN_SCOPE_LABELS[keys[0]] || "" : formatAssignScopeLabels(order.scope);
    return assignCellBox(escapeHtml(text), "assign-cell-box--center");
  }
  var items = keys
    .map(function (key) {
      return (
        '<div class="assign-stack-item">' + escapeHtml(ASSIGN_SCOPE_LABELS[key] || "") + "</div>"
      );
    })
    .join("");
  return '<div class="assign-cell-stack assign-cell-stack--scope">' + items + "</div>";
}

function renderAssignPartnerCell(order, idx, useStack, scopeKeys, disabled, readonly) {
  var keys = scopeKeys || getOrderScopeKeys(order.scope);
  var partners = normalizeOrderAssignedPartners(order);
  if (readonly) {
    if (!keys.length) {
      return assignCellBox("", "assign-cell-box--center");
    }
    if (!useStack || keys.length <= 1) {
      var oneKey = keys[0] || "";
      var partnerText = getPartnerDisplayName(oneKey ? partners[oneKey] || "" : order.assignedPartner || "");
      return assignCellBox(escapeHtml(partnerText), "assign-cell-box--center");
    }
    return (
      '<div class="assign-cell-stack assign-cell-stack--partner">' +
      keys
        .map(function (key) {
          return (
            '<div class="assign-stack-item">' +
            escapeHtml(getPartnerDisplayName(partners[key] || "")) +
            "</div>"
          );
        })
        .join("") +
      "</div>"
    );
  }
  var disabledAttr = disabled ? " disabled" : "";
  if (!keys.length) {
    return (
      '<select class="assign-partner-select" data-order-index="' +
      idx +
      '" disabled><option value="">선택</option></select>'
    );
  }
  if (!useStack || keys.length <= 1) {
    var scopeKey = keys[0] || "";
    var selected = scopeKey ? partners[scopeKey] || "" : order.assignedPartner || "";
    return (
      '<select class="assign-partner-select" data-order-index="' +
      idx +
      '" data-scope-key="' +
      escapeHtml(scopeKey) +
      '"' +
      disabledAttr +
      ">" +
      getAssignPartnerOptions(selected, scopeKey) +
      "</select>"
    );
  }
  return (
    '<div class="assign-cell-stack assign-cell-stack--partner">' +
    keys
      .map(function (key) {
        return (
          '<select class="assign-partner-select" data-order-index="' +
          idx +
          '" data-scope-key="' +
          escapeHtml(key) +
          '"' +
          disabledAttr +
          ">" +
          getAssignPartnerOptions(partners[key] || "", key) +
          "</select>"
        );
      })
      .join("") +
    "</div>"
  );
}

function renderAssignWorkerCell(order, idx, useStack, scopeKeys, readonly) {
  var keys = scopeKeys || getOrderScopeKeys(order.scope);
  var partners = normalizeOrderAssignedPartners(order);
  var workInfo = normalizeOrderScopeWorkInfo(order);
  if (readonly) {
    if (!keys.length) {
      return assignCellBox("", "assign-cell-box--center");
    }
    if (!useStack || keys.length <= 1) {
      var oneKey = keys[0] || "";
      var workerText =
        (oneKey && workInfo[oneKey] && workInfo[oneKey].worker) || order.constructionWorker || "";
      return assignCellBox(escapeHtml(workerText), "assign-cell-box--center");
    }
    return (
      '<div class="assign-cell-stack assign-cell-stack--worker">' +
      keys
        .map(function (key) {
          var workerText = (workInfo[key] && workInfo[key].worker) || "";
          return '<div class="assign-stack-item">' + escapeHtml(workerText) + "</div>";
        })
        .join("") +
      "</div>"
    );
  }
  if (!keys.length) {
    return (
      '<select class="assign-worker-select" data-order-index="' +
      idx +
      '" disabled><option value="">선택</option></select>'
    );
  }
  if (!useStack || keys.length <= 1) {
    var scopeKey = keys[0] || "";
    var partnerId = scopeKey ? partners[scopeKey] || "" : order.assignedPartner || "";
    var selectedWorker =
      (scopeKey && workInfo[scopeKey] && workInfo[scopeKey].worker) || order.constructionWorker || "";
    return (
      '<select class="assign-worker-select" data-order-index="' +
      idx +
      '" data-scope-key="' +
      escapeHtml(scopeKey) +
      '" data-partner-id="' +
      escapeHtml(partnerId) +
      '">' +
      getAssignWorkerOptions(selectedWorker, partnerId, scopeKey) +
      "</select>"
    );
  }
  return (
    '<div class="assign-cell-stack assign-cell-stack--worker">' +
    keys
      .map(function (key) {
        var partnerId = partners[key] || "";
        var selectedWorker = (workInfo[key] && workInfo[key].worker) || "";
        return (
          '<select class="assign-worker-select" data-order-index="' +
          idx +
          '" data-scope-key="' +
          escapeHtml(key) +
          '" data-partner-id="' +
          escapeHtml(partnerId) +
          '">' +
          getAssignWorkerOptions(selectedWorker, partnerId, key) +
          "</select>"
        );
      })
      .join("") +
    "</div>"
  );
}

function getOrderAccidentScopeKeys(order) {
  var keys = getOrderScopeKeys(order.scope);
  var info = normalizeOrderScopeWorkInfo(order);
  return keys.filter(function (key) {
    var type = ((info[key] && info[key].accidentType) || "").trim();
    return !!type && type !== "선택";
  });
}

function pad2(n) {
  return n < 10 ? "0" + n : String(n);
}

function toConstructDateIso(year, month, day) {
  return year + "-" + pad2(month) + "-" + pad2(day);
}

function syncAssignPickerFromControls(pageKey) {
  var cfg = getAssignConfig(pageKey);
  var picker = getAssignPicker(pageKey);
  var ym = getAssignYearMonth(pageKey);
  picker.year = ym.year;
  picker.month = ym.month;
  var lastDate = new Date(ym.year, ym.month, 0).getDate();
  if (picker.day > lastDate) {
    picker.day = lastDate;
  }
  if (picker.day < 1) {
    picker.day = 1;
  }
}

function isOrderClosed(order) {
  var s = (order.progressStatus || "").trim();
  return s === "완료" || s === "마감" || s === "완료됨";
}

function hasOrderScopeAccidentType(order) {
  var keys = getOrderScopeKeys(order.scope);
  var info = order.scopeWorkInfo;
  var i;
  var type;

  if (info && typeof info === "object" && keys.length) {
    for (i = 0; i < keys.length; i++) {
      type = ((info[keys[i]] && info[keys[i]].accidentType) || "").trim();
      if (type && type !== "선택") return true;
    }
    return false;
  }

  type = (order.accidentType || "").trim();
  return !!type && type !== "선택";
}

function isOrderOpen(order) {
  return isOrderAssigned(order) && hasOrderScopeAccidentType(order) && !isOrderClosed(order);
}

function getOrderProgressScopeKeys(order) {
  return getOrderScopeKeys(order.scope);
}

function hasScopeWorkerSaved(order, scopeKey) {
  var info = normalizeOrderScopeWorkInfo(order);
  if (scopeKey) return !!((info[scopeKey] && info[scopeKey].worker) || "").trim();
  return !!(order.constructionWorker || "").trim();
}

function hasAllOrderScopeWorkersSaved(order) {
  var keys = getOrderProgressScopeKeys(order);
  var i;
  if (!keys.length) return hasScopeWorkerSaved(order, "");
  for (i = 0; i < keys.length; i++) {
    if (!hasScopeWorkerSaved(order, keys[i])) return false;
  }
  return true;
}

function hasScopeAccidentTypeRegistered(order, scopeKey) {
  var info = normalizeOrderScopeWorkInfo(order);
  var data = scopeKey ? info[scopeKey] || {} : info[""] || {};
  var type = (data.accidentType || order.accidentType || "").trim();
  return !!type && type !== "선택";
}

function hasAnyOrderScopeAccidentRegistered(order) {
  var keys = getOrderProgressScopeKeys(order);
  var i;
  if (!keys.length) return hasScopeAccidentTypeRegistered(order, "");
  for (i = 0; i < keys.length; i++) {
    if (hasScopeAccidentTypeRegistered(order, keys[i])) return true;
  }
  return false;
}

function isConstructDatePlusOneDayPassed(constructDateIso) {
  if (!constructDateIso || !/^\d{4}-\d{2}-\d{2}$/.test(constructDateIso)) return false;
  var parts = constructDateIso.split("-");
  var threshold = new Date(
    parseInt(parts[0], 10),
    parseInt(parts[1], 10) - 1,
    parseInt(parts[2], 10)
  );
  threshold.setDate(threshold.getDate() + 1);
  threshold.setHours(0, 0, 0, 0);
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.getTime() >= threshold.getTime();
}

function hasAllOrderScopesActionCompleted(order) {
  var keys = getOrderProgressScopeKeys(order);
  var info = normalizeOrderScopeWorkInfo(order);
  var i;
  if (!keys.length) return isScopeActionResultCompleted(info[""] || {});
  for (i = 0; i < keys.length; i++) {
    if (!isScopeActionResultCompleted(info[keys[i]] || {})) return false;
  }
  return true;
}

function computeOrderProgressStatus(order) {
  if (hasAllOrderScopesActionCompleted(order)) return "조치완료";
  if (!hasAllOrderScopeWorkersSaved(order)) return "배정대기";
  if (hasAnyOrderScopeAccidentRegistered(order)) return "시공미결";
  if (isConstructDatePlusOneDayPassed(order.constructDate)) return "시공완료";
  return "배정완료";
}

function applyComputedProgressStatusToOrder(order) {
  var info = normalizeOrderScopeWorkInfo(order);
  var keys = getOrderProgressScopeKeys(order);
  var progress = computeOrderProgressStatus(order);
  var i;

  if (!keys.length) {
    if (!info[""]) info[""] = getOrderScopeWorkData(order, "");
    info[""].progress = progress;
  } else {
    for (i = 0; i < keys.length; i++) {
      if (!info[keys[i]]) info[keys[i]] = getOrderScopeWorkData(order, keys[i]);
      info[keys[i]].progress = progress;
    }
  }

  order.scopeWorkInfo = info;
  order.progressStatus = progress;
}

function hasOrderActionCompleted(order) {
  return hasAllOrderScopesActionCompleted(order);
}

function matchesOpenActionFilter(order, actionFilter) {
  if (!isOrderOpen(order)) return false;
  if (actionFilter === "done") return hasOrderActionCompleted(order);
  if (actionFilter === "pending") return !hasOrderActionCompleted(order);
  return true;
}

function getOpenActionFilter() {
  var picker = getAssignPicker("open");
  return picker.actionFilter || "pending";
}

function syncOpenActionFilterFromControls() {
  var group = document.getElementById("openActionFilter");
  var picker = getAssignPicker("open");
  if (!group) {
    picker.actionFilter = picker.actionFilter || "pending";
    return;
  }
  var active = group.querySelector(".assign-open-filter__btn--active");
  picker.actionFilter = active
    ? active.getAttribute("data-open-action-filter") || "pending"
    : "pending";
}

function hasOrderWorkerAssigned(order) {
  return hasAllOrderScopeWorkersSaved(order);
}

function getStatusWorkerFilter() {
  var picker = getAssignPicker("status");
  return picker.workerFilter || "assigned";
}

function syncStatusWorkerFilterFromControls() {
  var auth = getAuth();
  if (auth && auth.role === "worker") {
    getAssignPicker("status").workerFilter = "assigned";
    return;
  }
  var group = document.getElementById("statusWorkerFilter");
  var picker = getAssignPicker("status");
  if (!group) {
    picker.workerFilter = picker.workerFilter || "assigned";
    return;
  }
  var active = group.querySelector(".assign-open-filter__btn--active");
  picker.workerFilter = active
    ? active.getAttribute("data-status-worker-filter") || "assigned"
    : "assigned";
}

function matchesStatusWorkerFilter(order) {
  var hasWorker = hasOrderWorkerAssigned(order);
  if (getStatusWorkerFilter() === "unassigned") return !hasWorker;
  return hasWorker;
}

function getOrdersForAssignDate(year, month, day, filterMode) {
  var iso = toConstructDateIso(year, month, day);
  return getVisibleOrdersForCurrentUser().filter(function (order) {
    if (order.constructDate !== iso) return false;
    if (filterMode === "assigned") {
      return isOrderAssigned(order) && matchesStatusWorkerFilter(order);
    }
    if (filterMode === "open") return matchesOpenActionFilter(order, getOpenActionFilter());
    return !isOrderAssigned(order);
  });
}

function countOrdersForAssignDate(year, month, day, filterMode) {
  return getOrdersForAssignDate(year, month, day, filterMode).length;
}

function getAssignYearMonth(pageKey) {
  var cfg = getAssignConfig(pageKey);
  var picker = getAssignPicker(pageKey);
  var yearEl = document.getElementById(cfg.ids.year);
  var monthEl = document.getElementById(cfg.ids.month);
  return {
    year: yearEl ? parseInt(yearEl.value, 10) : picker.year,
    month: monthEl ? parseInt(monthEl.value, 10) : picker.month,
  };
}

function setAssignSelectedDay(day, pageKey) {
  getAssignPicker(pageKey).day = day;
  updateAssignDateTitle(pageKey);
  renderAssignTable(pageKey);
}

function renderAssignCalendars(pageKey) {
  var cfg = getAssignConfig(pageKey);
  var container = document.getElementById(cfg.ids.calendar);
  if (!container) return;

  syncAssignPickerFromControls(pageKey);
  var picker = getAssignPicker(pageKey);
  var year = picker.year;
  var month = picker.month;
  var selectedDay = picker.day;
  var lastDate = new Date(year, month, 0).getDate();
  var firstWeekday = new Date(year, month - 1, 1).getDay();
  var weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  var cells = [];
  var d;

  for (d = 0; d < firstWeekday; d++) {
    cells.push('<span class="assign-mini-cal__day assign-mini-cal__day--blank"></span>');
  }

  for (d = 1; d <= lastDate; d++) {
    var dow = new Date(year, month - 1, d).getDay();
    var orderCount = countOrdersForAssignDate(year, month, d, cfg.filterMode);
    var cls = "assign-mini-cal__day-btn";
    if (d === selectedDay) cls += " assign-mini-cal__day-btn--selected";
    if (dow === 0) cls += " assign-mini-cal__day-btn--sun";
    if (dow === 6) cls += " assign-mini-cal__day-btn--sat";
    if (orderCount > 0) cls += " assign-mini-cal__day-btn--has-count";

    cells.push(
      '<button type="button" class="' +
        cls +
        '" data-assign-day="' +
        d +
        '"><span class="assign-mini-cal__day-num">' +
        d +
        '</span><span class="assign-mini-cal__day-count">' +
        orderCount +
        "</span></button>"
    );
  }

  while (cells.length % 7 !== 0) {
    cells.push('<span class="assign-mini-cal__day assign-mini-cal__day--blank"></span>');
  }

  var headerCells = weekdays
    .map(function (w, i) {
      var wdCls = "assign-mini-cal__wd";
      if (i === 0) wdCls += " assign-mini-cal__wd--sun";
      if (i === 6) wdCls += " assign-mini-cal__wd--sat";
      return '<span class="' + wdCls + '">' + w + "</span>";
    })
    .join("");

  container.innerHTML =
    '<div class="assign-mini-cal assign-mini-cal--month"><div class="assign-mini-cal__head">' +
    headerCells +
    '</div><div class="assign-mini-cal__grid">' +
    cells.join("") +
    "</div></div>";

  container.querySelectorAll("[data-assign-day]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setAssignSelectedDay(parseInt(btn.getAttribute("data-assign-day"), 10), pageKey);
    });
  });
}

var ASSIGN_WEEKDAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];

function updateAssignDateTitle(pageKey) {
  var cfg = getAssignConfig(pageKey);
  var titleEl = document.getElementById(cfg.ids.dateTitle);
  if (!titleEl) return;
  syncAssignPickerFromControls(pageKey);
  var picker = getAssignPicker(pageKey);
  var dow = new Date(picker.year, picker.month - 1, picker.day).getDay();
  titleEl.textContent = picker.month + "월 " + picker.day + "일 (" + ASSIGN_WEEKDAY_NAMES[dow] + ")";
  renderAssignCalendars(pageKey);
}

function assignCellBox(content, extraClass) {
  return (
    '<div class="assign-cell-box' +
    (extraClass ? " " + extraClass : "") +
    '">' +
    content +
    "</div>"
  );
}

function getOrderIndexInStorage(orderNo) {
  var orders = getStoredOrders();
  for (var i = 0; i < orders.length; i++) {
    if (orders[i].orderNo === orderNo) return i;
  }
  return -1;
}

function renderAssignTable(pageKey) {
  var cfg = getAssignConfig(pageKey);
  var tbody = document.getElementById(cfg.ids.tableBody);
  if (!tbody) return;

  syncAssignPickerFromControls(pageKey);
  var picker = getAssignPicker(pageKey);
  var orders = getOrdersForAssignDate(picker.year, picker.month, picker.day, cfg.filterMode);
  var html = "";
  var rowNum = 0;
  var showsWorkerColumn = pageKey === "status" || pageKey === "open";

  orders.forEach(function (order) {
    var idx = getOrderIndexInStorage(order.orderNo);
    if (idx < 0) return;
    var scopeKeys = pageKey === "open" ? getOrderAccidentScopeKeys(order) : getOrderScopeKeys(order.scope);
    if (!scopeKeys.length) return;

    rowNum += 1;
    var useStack = pageKey === "assign" || pageKey === "status" || pageKey === "open";
    var addressText = [order.city, order.district, order.address].filter(Boolean).join(" ");
    var scopeTdClass =
      useStack && scopeKeys.length > 1 ? ' class="assign-table__cell-scope assign-table__cell-scope--stacked"' : "";
    var partnerTdClass =
      useStack && scopeKeys.length > 1
        ? ' class="assign-table__cell-partner assign-table__cell-partner--stacked"'
        : ' class="assign-table__cell-partner"';
    var workerTdClass =
      useStack && scopeKeys.length > 1
        ? ' class="assign-table__cell-worker assign-table__cell-worker--stacked"'
        : ' class="assign-table__cell-worker"';

    html +=
      '<tr class="assign-table__row-main" data-order-index="' +
      idx +
      '"><td class="assign-table__cell-no">' +
      assignCellBox(String(rowNum), "assign-cell-box--center assign-cell-box--no") +
      '</td><td>' +
      assignCellBox(escapeHtml(order.orderNo || ""), "assign-cell-box--center") +
      "</td><td" +
      scopeTdClass +
      ">" +
      renderAssignScopeCell(order, useStack, scopeKeys) +
      "</td><td>" +
      assignCellBox(escapeHtml(order.siteName || ""), "assign-cell-box--center") +
      "</td><td>" +
      assignCellBox(escapeHtml(addressText), "assign-cell-box--wide") +
      "</td><td" +
      partnerTdClass +
      ">" +
      renderAssignPartnerCell(
        order,
        idx,
        useStack,
        scopeKeys,
        pageKey === "open",
        pageKey === "open"
      ) +
      "</td>" +
      (showsWorkerColumn
        ? "<td" +
          workerTdClass +
          ">" +
          renderAssignWorkerCell(order, idx, useStack, scopeKeys, pageKey === "open") +
          "</td>"
        : "") +
      '<td class="assign-table__cell-confirm">' +
      assignCellBox(
        '<button type="button" class="assign-detail-link" data-order-index="' + idx + '">상세</button>',
        "assign-cell-box--center assign-cell-box--compact"
      ) +
      '</td><td class="assign-table__cell-delete">' +
      assignCellBox(
        '<input type="checkbox" class="assign-delete-check" data-order-index="' + idx + '" aria-label="삭제 선택" />',
        "assign-cell-box--center assign-cell-box--check assign-cell-box--compact"
      ) +
      "</td></tr>";
  });

  tbody.innerHTML = html;

  tbody.querySelectorAll(".assign-detail-link").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var idx = parseInt(btn.getAttribute("data-order-index"), 10);
      var list = getStoredOrders();
      var order = list[idx];
      if (!order) return;
      if (pageKey === "status" || pageKey === "open") {
        openStatusDetailModal(order);
      } else {
        openAssignDetailModal(order);
      }
    });
  });
}

function getPartnerDisplayName(userId) {
  if (!userId) return "";
  var partners = getRegisteredPartners();
  for (var i = 0; i < partners.length; i++) {
    if (partners[i].userId === userId) {
      return partners[i].partnerCompany || partners[i].name || partners[i].userId;
    }
  }
  return userId;
}

function setStatusDetailText(id, value) {
  var el = document.getElementById(id);
  if (el) el.textContent = value || "";
}

function normalizeOrderScopeWorkInfo(order) {
  var info = order.scopeWorkInfo;
  if (info && typeof info === "object" && !Array.isArray(info)) {
    return info;
  }

  info = {};
  var keys = getOrderScopeKeys(order.scope);
  var legacy = {
    worker: order.constructionWorker || "",
    progress: order.progressStatus || "",
    accidentType: order.accidentType || "",
    accidentContent: order.accidentContent || "",
    actionSchedule: order.actionSchedule || "",
    actionWorker: order.actionWorker || "",
    actionContent: order.actionContent || "",
    actionResult: order.actionResult || "",
    actionPartner: order.actionPartner || "",
  };

  if (keys.length) {
    keys.forEach(function (key) {
      info[key] = {
        worker: legacy.worker,
        progress: legacy.progress,
        accidentType: legacy.accidentType,
        accidentContent: legacy.accidentContent,
        actionSchedule: legacy.actionSchedule,
        actionWorker: legacy.actionWorker,
        actionContent: legacy.actionContent,
        actionResult: legacy.actionResult,
        actionPartner: legacy.actionPartner,
      };
    });
  } else {
    info[""] = legacy;
  }

  return info;
}

function getOrderScopeWorkData(order, scopeKey) {
  var info = normalizeOrderScopeWorkInfo(order);
  var data = info[scopeKey] || info[""] || {};
  return {
    worker: data.worker || "",
    progress: data.progress || "",
    accidentType: data.accidentType || "",
    accidentContent: data.accidentContent || "",
    actionSchedule: data.actionSchedule || "",
    actionWorker: data.actionWorker || "",
    actionContent: data.actionContent || "",
    actionResult: data.actionResult || "",
    actionPartner: data.actionPartner || "",
  };
}

function syncOrderLegacyWorkFields(order) {
  var info = normalizeOrderScopeWorkInfo(order);
  var keys = getOrderScopeKeys(order.scope);
  var key = keys.length ? keys[0] : "";
  var data = info[key] || info[""] || {};

  order.scopeWorkInfo = info;
  order.constructionWorker = data.worker || "";
  order.progressStatus = data.progress || "";
  order.accidentType = data.accidentType || "";
  order.accidentContent = data.accidentContent || "";
  order.actionSchedule = data.actionSchedule || "";
  order.actionWorker = data.actionWorker || "";
  order.actionContent = data.actionContent || "";
  order.actionResult = data.actionResult || "";
  order.actionPartner = data.actionPartner || "";
}

function createEmptyActionRoundData() {
  return {
    actionSchedule: "",
    actionPartner: "",
    actionWorker: "",
    actionContent: "",
    actionResult: "",
  };
}

function normalizeActionRounds(workData) {
  var data = workData || {};
  if (data.actionRounds && typeof data.actionRounds === "object" && !Array.isArray(data.actionRounds)) {
    return data.actionRounds;
  }
  return {
    1: {
      actionSchedule: data.actionSchedule || "",
      actionPartner: data.actionPartner || "",
      actionWorker: data.actionWorker || "",
      actionContent: data.actionContent || "",
      actionResult: data.actionResult || "",
    },
  };
}

function getActionRoundData(rounds, roundNum) {
  var key = String(roundNum);
  var round = rounds[key] || rounds[roundNum];
  if (!round || typeof round !== "object") return createEmptyActionRoundData();
  return {
    actionSchedule: round.actionSchedule || "",
    actionPartner: round.actionPartner || "",
    actionWorker: round.actionWorker || "",
    actionContent: round.actionContent || "",
    actionResult: round.actionResult || "",
  };
}

function getVisibleActionRoundNumbers(rounds) {
  var nums = [1];
  var round = 1;
  while (round < 50) {
    if (getActionRoundData(rounds, round).actionResult === "재미결") {
      round += 1;
      nums.push(round);
    } else {
      break;
    }
  }
  return nums;
}

function isScopeActionResultCompleted(workData) {
  var rounds = normalizeActionRounds(workData || {});
  var nums = getVisibleActionRoundNumbers(rounds);
  var latestRound = nums[nums.length - 1];
  var result = getActionRoundData(rounds, latestRound).actionResult;
  return result === "조치완료" || result === "조치완결";
}

function syncFlatActionFieldsFromRounds(entry) {
  var rounds = entry.actionRounds || normalizeActionRounds(entry);
  var nums = getVisibleActionRoundNumbers(rounds);
  var latest = nums[nums.length - 1];
  var data = getActionRoundData(rounds, latest);
  entry.actionSchedule = data.actionSchedule || "";
  entry.actionPartner = data.actionPartner || "";
  entry.actionWorker = data.actionWorker || "";
  entry.actionContent = data.actionContent || "";
  entry.actionResult = data.actionResult || "";
}

function getActiveStatusDetailScopeKey() {
  var activeTag = document.querySelector(
    "#statusDetailWorkScopeTags .status-detail-modal__scope-tag--active"
  );
  if (activeTag) return activeTag.getAttribute("data-scope-key") || "";
  var activeBlock = document.querySelector(
    "#statusDetailWorkBlocks .status-detail-modal__work-block:not([hidden])"
  );
  return activeBlock ? activeBlock.getAttribute("data-scope-key") || "" : "";
}

function getActiveActionRoundForScope(scopeKey) {
  return statusDetailActiveActionRound[scopeKey] || 1;
}

function getStatusActionResultOptionsHtml(selected) {
  return STATUS_ACTION_RESULT_OPTIONS.map(function (value) {
    var label = value || "선택";
    var isSelected = value === (selected || "");
    return (
      '<option value="' +
      escapeHtml(value) +
      '"' +
      (isSelected ? " selected" : "") +
      ">" +
      escapeHtml(label) +
      "</option>"
    );
  }).join("");
}

function getStatusAccidentTypeOptionsHtml(selected) {
  return STATUS_ACCIDENT_TYPE_OPTIONS.map(function (value) {
    var label = value || "선택";
    var isSelected = value === (selected || "");
    return (
      '<option value="' +
      escapeHtml(value) +
      '"' +
      (isSelected ? " selected" : "") +
      ">" +
      escapeHtml(label) +
      "</option>"
    );
  }).join("");
}

function buildStatusDetailWorkBlockHtml(scopeKey, scopeLabel, partnerText, workData, opts) {
  var options = opts || {};
  var isOpenMode = !!options.isOpenMode;
  var partnerUserId = options.partnerUserId || "";
  var scheduleIso = parseStatusActionScheduleIso(workData.actionSchedule);
  var scheduleDisplay = scheduleIso ? formatOrderConstructDateDisplay(scheduleIso) : "";
  var scopeKeyAttr = escapeHtml(scopeKey);
  var workerReadOnlyAttr = isOpenMode ? " readonly" : "";
  var accidentContentReadOnlyAttr = isOpenMode ? " readonly" : "";
  var progressStatus = options.progressStatus || workData.progress || "";
  var accidentTypeFieldHtml = isOpenMode
    ? '<input type="text" class="modal-field-input status-detail-accident-type-readonly" value="' +
      escapeHtml(workData.accidentType || "") +
      '" readonly aria-label="' +
      escapeHtml(scopeLabel + " 사고유형") +
      '" />'
    : '<select class="modal-field-input status-detail-accident-type" aria-label="' +
      escapeHtml(scopeLabel + " 사고유형") +
      '">' +
      getStatusAccidentTypeOptionsHtml(workData.accidentType) +
      "</select>";

  var actionFieldsHtml = isOpenMode
    ? ""
    : buildStatusDetailActionFieldsInnerHtml(
        scopeKeyAttr,
        scopeLabel,
        scheduleIso,
        scheduleDisplay,
        partnerUserId,
        scopeKey,
        workData,
        false
      );

  return (
    '<div class="status-detail-modal__work-block" data-scope-key="' +
    scopeKeyAttr +
    '">' +
    '<div class="order-field">' +
    '<div class="order-field__label"><span>시공구분</span></div>' +
    '<span class="order-field__divider" aria-hidden="true"></span>' +
    '<div class="order-field__control order-field__control--md">' +
    '<span class="modal-field-value">' +
    escapeHtml(scopeLabel) +
    "</span></div></div>" +
    '<div class="order-field">' +
    '<div class="order-field__label"><span>시공협력사</span></div>' +
    '<span class="order-field__divider" aria-hidden="true"></span>' +
    '<div class="order-field__control order-field__control--md">' +
    '<span class="modal-field-value">' +
    escapeHtml(partnerText) +
    "</span></div></div>" +
    '<div class="order-field">' +
    '<div class="order-field__label"><span>시공사원</span></div>' +
    '<span class="order-field__divider" aria-hidden="true"></span>' +
    '<div class="order-field__control order-field__control--md">' +
    '<input type="text" class="modal-field-input status-detail-worker" value="' +
    escapeHtml(workData.worker) +
    '"' +
    workerReadOnlyAttr +
    ' aria-label="' +
    escapeHtml(scopeLabel + " 시공사원") +
    '" /></div></div>' +
    '<div class="order-field">' +
    '<div class="order-field__label"><span>진행상태</span></div>' +
    '<span class="order-field__divider" aria-hidden="true"></span>' +
    '<div class="order-field__control order-field__control--md">' +
    '<span class="modal-field-value status-detail-progress" aria-label="' +
    escapeHtml(scopeLabel + " 진행상태") +
    '">' +
    escapeHtml(progressStatus) +
    "</span></div></div>" +
    '<div class="order-field">' +
    '<div class="order-field__label"><span>사고유형</span></div>' +
    '<span class="order-field__divider" aria-hidden="true"></span>' +
    '<div class="order-field__control order-field__control--md">' +
    accidentTypeFieldHtml +
    "</div></div>" +
    '<div class="order-field">' +
    '<div class="order-field__label"><span>사고내용</span></div>' +
    '<span class="order-field__divider" aria-hidden="true"></span>' +
    '<div class="order-field__control order-field__control--full">' +
    '<input type="text" class="modal-field-input status-detail-accident-content" value="' +
    escapeHtml(workData.accidentContent) +
    '"' +
    accidentContentReadOnlyAttr +
    ' aria-label="' +
    escapeHtml(scopeLabel + " 사고내용") +
    '" /></div></div>' +
    actionFieldsHtml +
    "</div></div>"
  );
}

function refreshStatusDetailActionWorkerSelect(panel) {
  if (!panel) return;
  var block = panel.closest(".status-detail-modal__work-block");
  var partnerEl = panel.querySelector(".status-detail-action-partner");
  var workerEl = panel.querySelector(".status-detail-action-worker");
  if (!workerEl) return;
  var scopeKey = block ? block.getAttribute("data-scope-key") || "" : "";
  var partnerId = partnerEl ? partnerEl.value || "" : "";
  var selectedWorker = workerEl.value || "";
  workerEl.innerHTML = getAssignWorkerOptions(selectedWorker, partnerId, scopeKey);
}

function buildStatusDetailActionFieldsInnerHtml(
  scopeKeyAttr,
  scopeLabel,
  scheduleIso,
  scheduleDisplay,
  partnerUserId,
  scopeKey,
  workData,
  includeResult
) {
  var actionPartnerId = (workData.actionPartner || partnerUserId || "").trim();
  var actionPartnerOptions = getAssignPartnerOptions(actionPartnerId, scopeKey);
  var actionWorkerOptions = getAssignWorkerOptions(
    workData.actionWorker || "",
    actionPartnerId,
    scopeKey
  );
  var actionDateFieldHtml =
    '<div class="order-field order-field--date">' +
    '<div class="order-field__label"><span>조치일자</span></div>' +
    '<span class="order-field__divider" aria-hidden="true"></span>' +
    '<div class="order-field__control order-field__control--date">' +
    '<input type="text" class="modal-field-input status-detail-action-schedule" readonly placeholder="일자를 선택하세요" data-iso="' +
    escapeHtml(scheduleIso) +
    '" value="' +
    escapeHtml(scheduleDisplay) +
    '" aria-label="' +
    escapeHtml(scopeLabel + " 조치일자") +
    '" />' +
    '<button type="button" class="order-date-btn" data-status-action-picker="' +
    scopeKeyAttr +
    '" aria-haspopup="dialog" aria-controls="statusActionDatePickerPopup" aria-label="달력">' +
    '<svg class="order-date-btn__icon" width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
    '<rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>' +
    '<path d="M3 10h18M8 2v4M16 2v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
    "</svg></button></div></div>";
  var actionPartnerFieldHtml = includeResult
    ? '<div class="order-field">' +
      '<div class="order-field__label"><span>시공협력사</span></div>' +
      '<span class="order-field__divider" aria-hidden="true"></span>' +
      '<div class="order-field__control order-field__control--md">' +
      '<select class="modal-field-input status-detail-action-partner" aria-label="' +
      escapeHtml(scopeLabel + " 시공협력사") +
      '">' +
      actionPartnerOptions +
      "</select></div></div>"
    : "";
  var actionWorkerFieldHtml =
    '<div class="order-field">' +
    '<div class="order-field__label"><span>조치사원</span></div>' +
    '<span class="order-field__divider" aria-hidden="true"></span>' +
    '<div class="order-field__control order-field__control--md">' +
    '<select class="modal-field-input status-detail-action-worker" aria-label="' +
    escapeHtml(scopeLabel + " 조치사원") +
    '">' +
    actionWorkerOptions +
    "</select></div></div>";
  var actionContentFieldHtml =
    '<div class="order-field">' +
    '<div class="order-field__label"><span>조치내용</span></div>' +
    '<span class="order-field__divider" aria-hidden="true"></span>' +
    '<div class="order-field__control order-field__control--full">' +
    '<input type="text" class="modal-field-input status-detail-action-content" value="' +
    escapeHtml(workData.actionContent) +
    '" aria-label="' +
    escapeHtml(scopeLabel + " 조치내용") +
    '" /></div></div>';
  var actionResultFieldHtml =
    '<div class="order-field">' +
    '<div class="order-field__label"><span>조치결과</span></div>' +
    '<span class="order-field__divider" aria-hidden="true"></span>' +
    '<div class="order-field__control order-field__control--md">' +
    '<select class="modal-field-input status-detail-action-result" aria-label="' +
    escapeHtml(scopeLabel + " 조치결과") +
    '">' +
    getStatusActionResultOptionsHtml(workData.actionResult) +
    "</select></div></div>";

  return (
    actionDateFieldHtml +
    actionPartnerFieldHtml +
    actionWorkerFieldHtml +
    actionContentFieldHtml +
    (includeResult ? actionResultFieldHtml : "")
  );
}

function buildStatusDetailActionBlockHtml(scopeKey, scopeLabel, partnerUserId, workData) {
  var rounds = normalizeActionRounds(workData);
  var roundNums = getVisibleActionRoundNumbers(rounds);
  var scopeKeyAttr = escapeHtml(scopeKey);
  var html =
    '<div class="status-detail-modal__work-block" data-scope-key="' + scopeKeyAttr + '">';
  var i;

  for (i = 0; i < roundNums.length; i++) {
    var roundNum = roundNums[i];
    var roundData = getActionRoundData(rounds, roundNum);
    var scheduleIso = parseStatusActionScheduleIso(roundData.actionSchedule);
    var scheduleDisplay = scheduleIso ? formatOrderConstructDateDisplay(scheduleIso) : "";
    var roundLabel = scopeLabel ? scopeLabel + " " + roundNum + "차" : roundNum + "차";

    html +=
      '<div class="status-detail-modal__action-round-panel" data-action-round="' +
      roundNum +
      '"' +
      (roundNum === 1 ? "" : " hidden") +
      ">" +
      buildStatusDetailActionFieldsInnerHtml(
        scopeKeyAttr,
        roundLabel,
        scheduleIso,
        scheduleDisplay,
        partnerUserId,
        scopeKey,
        roundData,
        true
      ) +
      "</div>";
  }

  html += "</div>";
  return html;
}

function renderStatusDetailActionRoundTags(scopeKey) {
  var container = document.getElementById("statusDetailActionRoundTags");
  if (!container) return;

  var block = document.querySelector(
    '#statusDetailActionBlocks .status-detail-modal__work-block[data-scope-key="' + scopeKey + '"]'
  );
  if (!block) {
    container.innerHTML = "";
    return;
  }

  var panels = block.querySelectorAll(".status-detail-modal__action-round-panel");
  var nums = [];
  var i;

  for (i = 0; i < panels.length; i++) {
    nums.push(parseInt(panels[i].getAttribute("data-action-round"), 10));
  }
  nums.sort(function (a, b) {
    return a - b;
  });

  container.innerHTML = nums
    .map(function (n) {
      return (
        '<button type="button" class="status-detail-modal__scope-tag status-detail-modal__action-round-tag" data-action-round="' +
        n +
        '" aria-pressed="false">' +
        n +
        "차</button>"
      );
    })
    .join("");
}

function setActiveStatusDetailActionRound(scopeKey, roundNum) {
  statusDetailActiveActionRound[scopeKey] = roundNum;

  var block = document.querySelector(
    '#statusDetailActionBlocks .status-detail-modal__work-block[data-scope-key="' + scopeKey + '"]'
  );
  if (block) {
    var panels = block.querySelectorAll(".status-detail-modal__action-round-panel");
    var i;
    for (i = 0; i < panels.length; i++) {
      var panelRound = parseInt(panels[i].getAttribute("data-action-round"), 10);
      panels[i].hidden = panelRound !== roundNum;
    }
  }

  var tags = document.querySelectorAll(
    "#statusDetailActionRoundTags .status-detail-modal__action-round-tag"
  );
  var j;
  for (j = 0; j < tags.length; j++) {
    var tagRound = parseInt(tags[j].getAttribute("data-action-round"), 10);
    var tagActive = tagRound === roundNum;
    tags[j].classList.toggle("status-detail-modal__scope-tag--active", tagActive);
    tags[j].setAttribute("aria-pressed", tagActive ? "true" : "false");
  }

  closeStatusActionDatePicker();
}

function renderStatusDetailScopeTags(keys) {
  var container = document.getElementById("statusDetailWorkScopeTags");
  if (!container) return;

  if (!keys.length) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = keys
    .map(function (key) {
      return (
        '<button type="button" class="status-detail-modal__scope-tag" data-scope-key="' +
        escapeHtml(key) +
        '" aria-pressed="false">' +
        escapeHtml(ASSIGN_SCOPE_LABELS[key] || key) +
        "</button>"
      );
    })
    .join("");
}

function setActiveStatusDetailScope(scopeKey) {
  var tags = document.querySelectorAll("#statusDetailWorkScopeTags .status-detail-modal__scope-tag");
  var blocks = document.querySelectorAll("#statusDetailWorkBlocks .status-detail-modal__work-block");
  var actionBlocks = document.querySelectorAll(
    "#statusDetailActionBlocks .status-detail-modal__work-block"
  );
  var i;

  for (i = 0; i < tags.length; i++) {
    var tagKey = tags[i].getAttribute("data-scope-key") || "";
    var tagActive = tagKey === scopeKey;
    tags[i].classList.toggle("status-detail-modal__scope-tag--active", tagActive);
    tags[i].setAttribute("aria-pressed", tagActive ? "true" : "false");
  }

  for (i = 0; i < blocks.length; i++) {
    var blockKey = blocks[i].getAttribute("data-scope-key") || "";
    var blockActive = blockKey === scopeKey;
    blocks[i].hidden = !blockActive;
    blocks[i].classList.toggle("status-detail-modal__work-block--active", blockActive);
  }

  for (i = 0; i < actionBlocks.length; i++) {
    var actionBlockKey = actionBlocks[i].getAttribute("data-scope-key") || "";
    var actionBlockActive = actionBlockKey === scopeKey;
    actionBlocks[i].hidden = !actionBlockActive;
    actionBlocks[i].classList.toggle("status-detail-modal__work-block--active", actionBlockActive);
  }

  if (activeAssignPageKey === "open") {
    var activeRound = statusDetailActiveActionRound[scopeKey] || 1;
    var actionBlock = document.querySelector(
      '#statusDetailActionBlocks .status-detail-modal__work-block[data-scope-key="' + scopeKey + '"]'
    );
    if (actionBlock) {
      var actionPanels = actionBlock.querySelectorAll(".status-detail-modal__action-round-panel");
      var maxRound = 1;
      var p;
      for (p = 0; p < actionPanels.length; p++) {
        maxRound = Math.max(
          maxRound,
          parseInt(actionPanels[p].getAttribute("data-action-round"), 10) || 1
        );
      }
      if (activeRound > maxRound) activeRound = maxRound;
    }
    renderStatusDetailActionRoundTags(scopeKey);
    setActiveStatusDetailActionRound(scopeKey, activeRound);
  }

  closeStatusActionDatePicker();
}

function renderStatusDetailActionBlocks(order) {
  var container = document.getElementById("statusDetailActionBlocks");
  var section = document.getElementById("statusDetailActionSection");
  var isOpenMode = activeAssignPageKey === "open";

  if (section) section.hidden = !isOpenMode;
  if (!container) return;

  if (!isOpenMode) {
    container.innerHTML = "";
    return;
  }

  var keys = getOrderAccidentScopeKeys(order);
  var partners = normalizeOrderAssignedPartners(order);
  var scopeWorkInfo = normalizeOrderScopeWorkInfo(order);
  var html = "";

  if (!keys.length) {
    container.innerHTML = buildStatusDetailActionBlockHtml(
      "",
      "",
      order.assignedPartner || "",
      scopeWorkInfo[""] || getOrderScopeWorkData(order, "")
    );
    statusDetailActiveActionRound[""] = 1;
    return;
  }

  keys.forEach(function (key) {
    html += buildStatusDetailActionBlockHtml(
      key,
      ASSIGN_SCOPE_LABELS[key] || key,
      partners[key] || order.assignedPartner || "",
      scopeWorkInfo[key] || getOrderScopeWorkData(order, key)
    );
  });

  container.innerHTML = html;
}

function renderStatusDetailWorkBlocks(order) {
  var container = document.getElementById("statusDetailWorkBlocks");
  if (!container) return;

  var keys =
    activeAssignPageKey === "open" ? getOrderAccidentScopeKeys(order) : getOrderScopeKeys(order.scope);
  var partners = normalizeOrderAssignedPartners(order);
  var scopeWorkInfo = normalizeOrderScopeWorkInfo(order);
  var isOpenMode = activeAssignPageKey === "open";
  var progressStatus = computeOrderProgressStatus(order);
  var html = "";
  var activeKey = "";

  renderStatusDetailScopeTags(keys);

  if (!keys.length) {
    container.innerHTML = buildStatusDetailWorkBlockHtml(
      "",
      "",
      getPartnerDisplayName(order.assignedPartner),
      scopeWorkInfo[""] || getOrderScopeWorkData(order, ""),
      {
        isOpenMode: isOpenMode,
        partnerUserId: order.assignedPartner || "",
        progressStatus: progressStatus,
      }
    );
    renderStatusDetailActionBlocks(order);
    setActiveStatusDetailScope("");
    return;
  }

  keys.forEach(function (key) {
    html += buildStatusDetailWorkBlockHtml(
      key,
      ASSIGN_SCOPE_LABELS[key] || key,
      getPartnerDisplayName(partners[key] || ""),
      scopeWorkInfo[key] || getOrderScopeWorkData(order, key),
      {
        isOpenMode: isOpenMode,
        partnerUserId: partners[key] || order.assignedPartner || "",
        progressStatus: progressStatus,
      }
    );
  });

  container.innerHTML = html;
  renderStatusDetailActionBlocks(order);
  activeKey = keys[0];
  setActiveStatusDetailScope(activeKey);
}

function getStatusDetailScopeBlock(scopeKey) {
  var selector = '.status-detail-modal__work-block[data-scope-key="' + scopeKey + '"]';
  return (
    document.querySelector("#statusDetailActionBlocks " + selector) ||
    document.querySelector("#statusDetailWorkBlocks " + selector)
  );
}

function getStatusActionScheduleInput(scopeKey) {
  var block = getStatusDetailScopeBlock(scopeKey);
  if (!block) return null;
  var round = getActiveActionRoundForScope(scopeKey);
  var panel = block.querySelector(
    '.status-detail-modal__action-round-panel[data-action-round="' + round + '"]'
  );
  if (panel) return panel.querySelector(".status-detail-action-schedule");
  return block.querySelector(".status-detail-action-schedule");
}

function getStatusActionScheduleIso(scopeKey) {
  var input = getStatusActionScheduleInput(scopeKey);
  return input ? input.getAttribute("data-iso") || "" : "";
}

function setStatusActionScheduleForScope(scopeKey, iso) {
  var input = getStatusActionScheduleInput(scopeKey);
  if (!input) return;
  input.setAttribute("data-iso", iso || "");
  input.value = iso ? formatOrderConstructDateDisplay(iso) : "";
  statusActionDatePickerState.selectedIso = iso || "";
}

function parseStatusActionScheduleIso(value) {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  var match = String(value).match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/);
  if (!match) return "";
  return match[1] + "-" + pad2(parseInt(match[2], 10)) + "-" + pad2(parseInt(match[3], 10));
}

function renderStatusActionDatePickerGrid() {
  var grid = document.getElementById("statusActionDatePickerGrid");
  var title = document.getElementById("statusActionDatePickerTitle");
  if (!grid || !title) return;

  var year = statusActionDatePickerState.year;
  var month = statusActionDatePickerState.month;
  var lastDate = new Date(year, month, 0).getDate();
  var firstWeekday = new Date(year, month - 1, 1).getDay();
  var html = "";
  var d;

  title.textContent = year + "년 " + month + "월";

  for (d = 0; d < firstWeekday; d++) {
    html += '<button type="button" class="order-date-picker__day order-date-picker__day--blank" tabindex="-1" disabled></button>';
  }

  for (d = 1; d <= lastDate; d++) {
    var iso = year + "-" + pad2(month) + "-" + pad2(d);
    var selected =
      statusActionDatePickerState.selectedIso === iso ? " order-date-picker__day--selected" : "";
    html +=
      '<button type="button" class="order-date-picker__day' +
      selected +
      '" data-iso="' +
      iso +
      '">' +
      d +
      "</button>";
  }

  grid.innerHTML = html;

  grid.querySelectorAll(".order-date-picker__day[data-iso]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setStatusActionScheduleForScope(statusActionDatePickerScopeKey, btn.getAttribute("data-iso"));
      closeStatusActionDatePicker();
    });
  });
}

function openStatusActionDatePicker(scopeKey) {
  var popup = document.getElementById("statusActionDatePickerPopup");
  var btn = document.querySelector('[data-status-action-picker="' + scopeKey + '"]');
  if (!popup || !btn) return;

  statusActionDatePickerScopeKey = scopeKey || "";
  var existing = getStatusActionScheduleIso(statusActionDatePickerScopeKey);
  var base = existing ? new Date(existing) : new Date();
  statusActionDatePickerState.year = base.getFullYear();
  statusActionDatePickerState.month = base.getMonth() + 1;
  statusActionDatePickerState.selectedIso = existing;

  renderStatusActionDatePickerGrid();
  popup.hidden = false;

  var rect = btn.getBoundingClientRect();
  popup.style.top = rect.bottom + 8 + "px";
  popup.style.left = rect.left + "px";
}

function closeStatusActionDatePicker() {
  var popup = document.getElementById("statusActionDatePickerPopup");
  if (popup) popup.hidden = true;
}

function shiftStatusActionDatePickerMonth(delta) {
  statusActionDatePickerState.month += delta;
  if (statusActionDatePickerState.month > 12) {
    statusActionDatePickerState.month = 1;
    statusActionDatePickerState.year += 1;
  } else if (statusActionDatePickerState.month < 1) {
    statusActionDatePickerState.month = 12;
    statusActionDatePickerState.year -= 1;
  }
  renderStatusActionDatePickerGrid();
}

var STATUS_DETAIL_PHOTO_SLOT_COUNT = 4;

var statusPhotoViewerScopeKey = "";
var statusPhotoViewerSlot = 0;

function normalizeOrderScopePhotos(order) {
  var photos = order.scopePhotos;
  if (photos && typeof photos === "object" && !Array.isArray(photos)) {
    return photos;
  }

  photos = {};
  var keys = getOrderScopeKeys(order.scope);
  var legacy = {
    photo1: order.photo1 || "",
    photo1Data: order.photo1Data || "",
    photo2: order.photo2 || "",
    photo2Data: order.photo2Data || "",
    photo3: order.photo3 || "",
    photo3Data: order.photo3Data || "",
    photo4: order.photo4 || "",
    photo4Data: order.photo4Data || "",
  };

  if (keys.length) {
    keys.forEach(function (key) {
      photos[key] = {
        photo1: legacy.photo1,
        photo1Data: legacy.photo1Data,
        photo2: legacy.photo2,
        photo2Data: legacy.photo2Data,
        photo3: legacy.photo3,
        photo3Data: legacy.photo3Data,
        photo4: legacy.photo4,
        photo4Data: legacy.photo4Data,
      };
    });
  } else {
    photos[""] = legacy;
  }

  return photos;
}

function getOrderScopePhotoData(order, scopeKey) {
  var photos = normalizeOrderScopePhotos(order);
  var data = photos[scopeKey] || photos[""] || {};
  return {
    photo1: data.photo1 || "",
    photo1Data: data.photo1Data || "",
    photo2: data.photo2 || "",
    photo2Data: data.photo2Data || "",
    photo3: data.photo3 || "",
    photo3Data: data.photo3Data || "",
    photo4: data.photo4 || "",
    photo4Data: data.photo4Data || "",
  };
}

function syncOrderLegacyPhotos(order) {
  var photos = normalizeOrderScopePhotos(order);
  var keys = getOrderScopeKeys(order.scope);
  var key = keys.length ? keys[0] : "";
  var data = photos[key] || photos[""] || {};

  order.scopePhotos = photos;
  order.photo1 = data.photo1 || "";
  order.photo1Data = data.photo1Data || "";
  order.photo2 = data.photo2 || "";
  order.photo2Data = data.photo2Data || "";
  order.photo3 = data.photo3 || "";
  order.photo3Data = data.photo3Data || "";
  order.photo4 = data.photo4 || "";
  order.photo4Data = data.photo4Data || "";
}

function getStatusPhotoBlock(scopeKey) {
  return document.querySelector(
    '#statusDetailPhotoBlocks .status-detail-modal__photo-block[data-scope-key="' + scopeKey + '"]'
  );
}

function getStatusPhotoSlotEl(scopeKey, slot, selector) {
  var block = getStatusPhotoBlock(scopeKey);
  if (!block) return null;
  return block.querySelector(selector + '[data-photo-slot="' + slot + '"]');
}

function isStatusDetailPhotoFilled(scopeKey, slot) {
  var dataEl = getStatusPhotoSlotEl(scopeKey, slot, ".status-detail-photo-data");
  return !!(dataEl && dataEl.value);
}

function getStatusDetailPhotoData(scopeKey, slot) {
  var dataEl = getStatusPhotoSlotEl(scopeKey, slot, ".status-detail-photo-data");
  return dataEl ? dataEl.value : "";
}

function getStatusDetailPhotoName(scopeKey, slot) {
  var btn = getStatusPhotoSlotEl(scopeKey, slot, ".status-detail-modal__photo-box");
  return btn ? btn.getAttribute("data-filename") || "" : "";
}

function setStatusDetailPhotoDisplay(scopeKey, slot, fileName, dataUrl) {
  var btn = getStatusPhotoSlotEl(scopeKey, slot, ".status-detail-modal__photo-box");
  var preview = getStatusPhotoSlotEl(scopeKey, slot, ".status-detail-modal__photo-preview");
  var dataEl = getStatusPhotoSlotEl(scopeKey, slot, ".status-detail-photo-data");
  var fileInput = getStatusPhotoSlotEl(scopeKey, slot, ".status-detail-photo-file");
  var editBtn = getStatusPhotoSlotEl(scopeKey, slot, ".status-detail-photo-edit");
  var deleteBtn = getStatusPhotoSlotEl(scopeKey, slot, ".status-detail-photo-delete");
  if (!btn) return;

  var filled = !!(dataUrl && dataUrl.length);
  if (filled) {
    if (dataEl) dataEl.value = dataUrl;
    if (preview) {
      preview.src = dataUrl;
      preview.hidden = false;
    }
    btn.setAttribute("data-filename", fileName || "photo.jpg");
    btn.classList.add("status-detail-modal__photo-box--filled");
    btn.setAttribute("aria-label", "사진 " + slot + " 보기");
    if (editBtn) editBtn.disabled = false;
    if (deleteBtn) deleteBtn.disabled = false;
  } else {
    if (dataEl) dataEl.value = "";
    if (preview) {
      preview.src = "";
      preview.hidden = true;
    }
    btn.removeAttribute("data-filename");
    btn.classList.remove("status-detail-modal__photo-box--filled");
    btn.setAttribute("aria-label", "사진 " + slot + " 업로드");
    if (fileInput) fileInput.value = "";
    if (editBtn) editBtn.disabled = true;
    if (deleteBtn) deleteBtn.disabled = true;
  }
}

function buildStatusDetailPhotoItemHtml(scopeKey, scopeLabel, slot, fileName, dataUrl) {
  var filled = !!(dataUrl && dataUrl.length);
  var scopeKeyAttr = escapeHtml(scopeKey);
  var labelPrefix = scopeLabel ? scopeLabel + " " : "";

  return (
    '<div class="status-detail-modal__photo-item">' +
    '<span class="assign-detail-modal__field-label">사진 ' +
    slot +
    "</span>" +
    '<input type="file" class="sr-only status-detail-photo-file" data-photo-slot="' +
    slot +
    '" accept="image/*,.png,.jpg,.jpeg,.gif,.webp" />' +
    '<input type="hidden" class="status-detail-photo-data" data-photo-slot="' +
    slot +
    '" value="' +
    escapeHtml(dataUrl || "") +
    '" />' +
    '<button type="button" class="status-detail-modal__photo-box' +
    (filled ? " status-detail-modal__photo-box--filled" : "") +
    '" data-photo-slot="' +
    slot +
    '" data-filename="' +
    escapeHtml(fileName || "") +
    '" aria-label="' +
    escapeHtml(labelPrefix + "사진 " + slot + (filled ? " 보기" : " 업로드")) +
    '">' +
    '<span class="status-detail-modal__photo-upload-text">업로드</span>' +
    '<img class="status-detail-modal__photo-preview" data-photo-slot="' +
    slot +
    '" alt="' +
    escapeHtml(labelPrefix + "사진 " + slot) +
    '"' +
    (filled ? ' src="' + escapeHtml(dataUrl) + '"' : "") +
    (filled ? "" : " hidden") +
    " /></button>" +
    '<div class="status-detail-modal__photo-actions">' +
    '<button type="button" class="status-detail-modal__photo-action-btn status-detail-photo-edit" data-photo-slot="' +
    slot +
    '"' +
    (filled ? "" : " disabled") +
    ">수정</button>" +
    '<button type="button" class="status-detail-modal__photo-action-btn status-detail-photo-delete" data-photo-slot="' +
    slot +
    '"' +
    (filled ? "" : " disabled") +
    ">삭제</button></div></div>"
  );
}

function buildStatusDetailPhotoBlockHtml(scopeKey, scopeLabel, photoData) {
  var html = "";
  var n;

  for (n = 1; n <= STATUS_DETAIL_PHOTO_SLOT_COUNT; n++) {
    html += buildStatusDetailPhotoItemHtml(
      scopeKey,
      scopeLabel,
      n,
      photoData["photo" + n] || "",
      photoData["photo" + n + "Data"] || ""
    );
  }

  return (
    '<div class="status-detail-modal__photo-block" data-scope-key="' +
    escapeHtml(scopeKey) +
    '"><div class="status-detail-modal__photos">' +
    html +
    "</div></div>"
  );
}

function renderStatusDetailPhotoScopeTags(keys) {
  var container = document.getElementById("statusDetailPhotoScopeTags");
  if (!container) return;

  if (!keys.length) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = keys
    .map(function (key) {
      return (
        '<button type="button" class="status-detail-modal__scope-tag status-detail-modal__scope-tag--photo" data-scope-key="' +
        escapeHtml(key) +
        '" aria-pressed="false">' +
        escapeHtml(ASSIGN_SCOPE_LABELS[key] || key) +
        "</button>"
      );
    })
    .join("");
}

function setActiveStatusDetailPhotoScope(scopeKey) {
  var tags = document.querySelectorAll("#statusDetailPhotoScopeTags .status-detail-modal__scope-tag");
  var blocks = document.querySelectorAll("#statusDetailPhotoBlocks .status-detail-modal__photo-block");
  var i;

  for (i = 0; i < tags.length; i++) {
    var tagKey = tags[i].getAttribute("data-scope-key") || "";
    var tagActive = tagKey === scopeKey;
    tags[i].classList.toggle("status-detail-modal__scope-tag--active", tagActive);
    tags[i].setAttribute("aria-pressed", tagActive ? "true" : "false");
  }

  for (i = 0; i < blocks.length; i++) {
    var blockKey = blocks[i].getAttribute("data-scope-key") || "";
    var blockActive = blockKey === scopeKey;
    blocks[i].hidden = !blockActive;
    blocks[i].classList.toggle("status-detail-modal__photo-block--active", blockActive);
  }
}

function renderStatusDetailPhotoSection(order) {
  var container = document.getElementById("statusDetailPhotoBlocks");
  if (!container) return;

  var keys = getOrderScopeKeys(order.scope);
  var scopePhotos = normalizeOrderScopePhotos(order);
  var html = "";

  renderStatusDetailPhotoScopeTags(keys);

  if (!keys.length) {
    container.innerHTML = buildStatusDetailPhotoBlockHtml(
      "",
      "",
      scopePhotos[""] || getOrderScopePhotoData(order, "")
    );
    setActiveStatusDetailPhotoScope("");
    return;
  }

  keys.forEach(function (key) {
    html += buildStatusDetailPhotoBlockHtml(
      key,
      ASSIGN_SCOPE_LABELS[key] || key,
      scopePhotos[key] || getOrderScopePhotoData(order, key)
    );
  });

  container.innerHTML = html;
  setActiveStatusDetailPhotoScope(keys[0]);
}

function readStatusDetailPhotoFile(file, scopeKey, slot) {
  if (!file) return;
  if (!file.type || file.type.indexOf("image") !== 0) {
    alert("이미지 파일만 업로드할 수 있습니다.");
    return;
  }
  var reader = new FileReader();
  reader.onload = function (e) {
    setStatusDetailPhotoDisplay(scopeKey, slot, file.name, e.target.result);
  };
  reader.readAsDataURL(file);
}

function openStatusPhotoViewer(scopeKey, slot) {
  var dataUrl = getStatusDetailPhotoData(scopeKey, slot);
  if (!dataUrl) return;
  statusPhotoViewerScopeKey = scopeKey;
  statusPhotoViewerSlot = slot;
  var img = document.getElementById("statusPhotoViewerImg");
  if (img) img.src = dataUrl;
  openModal("modal-status-photo-viewer");
}

function clearStatusDetailPhoto(scopeKey, slot) {
  setStatusDetailPhotoDisplay(scopeKey, slot, "", "");
}

function initStatusDetailPhotoHandlers() {
  if (initializedScreens.statusDetailPhotoHandlers) return;
  initializedScreens.statusDetailPhotoHandlers = true;

  var photoScopeTags = document.getElementById("statusDetailPhotoScopeTags");
  var photoBlocks = document.getElementById("statusDetailPhotoBlocks");

  if (photoScopeTags) {
    photoScopeTags.addEventListener("click", function (e) {
      var tagBtn = e.target.closest(".status-detail-modal__scope-tag");
      if (!tagBtn) return;
      e.preventDefault();
      setActiveStatusDetailPhotoScope(tagBtn.getAttribute("data-scope-key") || "");
    });
  }

  if (photoBlocks) {
    photoBlocks.addEventListener("click", function (e) {
      var block = e.target.closest(".status-detail-modal__photo-block");
      if (!block) return;
      var scopeKey = block.getAttribute("data-scope-key") || "";
      var deleteBtn = e.target.closest(".status-detail-photo-delete");
      var editBtn = e.target.closest(".status-detail-photo-edit");
      var photoBtn = e.target.closest(".status-detail-modal__photo-box");
      var slot = 0;

      if (deleteBtn) {
        slot = parseInt(deleteBtn.getAttribute("data-photo-slot"), 10);
        if (!slot) return;
        e.preventDefault();
        e.stopPropagation();
        clearStatusDetailPhoto(scopeKey, slot);
        return;
      }

      if (editBtn) {
        slot = parseInt(editBtn.getAttribute("data-photo-slot"), 10);
        if (!slot) return;
        e.preventDefault();
        e.stopPropagation();
        var editInput = getStatusPhotoSlotEl(scopeKey, slot, ".status-detail-photo-file");
        if (editInput) editInput.click();
        return;
      }

      if (!photoBtn) return;
      slot = parseInt(photoBtn.getAttribute("data-photo-slot"), 10);
      if (!slot) return;

      if (isStatusDetailPhotoFilled(scopeKey, slot)) {
        openStatusPhotoViewer(scopeKey, slot);
      } else {
        var fileInput = getStatusPhotoSlotEl(scopeKey, slot, ".status-detail-photo-file");
        if (fileInput) fileInput.click();
      }
    });

    photoBlocks.addEventListener("change", function (e) {
      var fileInput = e.target.closest(".status-detail-photo-file");
      if (!fileInput) return;
      var block = fileInput.closest(".status-detail-modal__photo-block");
      if (!block) return;
      var scopeKey = block.getAttribute("data-scope-key") || "";
      var slot = parseInt(fileInput.getAttribute("data-photo-slot"), 10);
      if (!slot || !fileInput.files || !fileInput.files[0]) return;
      readStatusDetailPhotoFile(fileInput.files[0], scopeKey, slot);
    });
  }
}

function saveStatusDetailFromModal() {
  var idxEl = document.getElementById("statusDetailOrderIndex");
  var idx = idxEl ? parseInt(idxEl.value, 10) : -1;
  if (idx < 0) return;

  var orders = getStoredOrders();
  if (!orders[idx]) return;

  var scopeWorkInfo = {};

  function ensureScopeWorkEntry(key) {
    if (!scopeWorkInfo[key]) {
      scopeWorkInfo[key] = {
        worker: "",
        progress: "",
        accidentType: "",
        accidentContent: "",
        actionSchedule: "",
        actionWorker: "",
        actionContent: "",
        actionResult: "",
        actionPartner: "",
        actionRounds: null,
      };
    }
    return scopeWorkInfo[key];
  }

  function readStatusDetailActionFieldsFromPanel(panel, roundEntry) {
    var scheduleInput = panel.querySelector(".status-detail-action-schedule");
    var actionPartnerEl = panel.querySelector(".status-detail-action-partner");
    var actionWorkerEl = panel.querySelector(".status-detail-action-worker");
    var actionContentEl = panel.querySelector(".status-detail-action-content");
    var actionResultEl = panel.querySelector(".status-detail-action-result");

    roundEntry.actionSchedule = scheduleInput ? scheduleInput.getAttribute("data-iso") || "" : "";
    roundEntry.actionPartner = actionPartnerEl ? actionPartnerEl.value : "";
    roundEntry.actionWorker = actionWorkerEl ? actionWorkerEl.value.trim() : "";
    roundEntry.actionContent = actionContentEl ? actionContentEl.value.trim() : "";
    roundEntry.actionResult = actionResultEl ? actionResultEl.value : "";
  }

  function readStatusDetailActionFieldsFromBlock(block, entry) {
    var panel = block.querySelector(".status-detail-modal__action-round-panel");
    if (panel) {
      entry.actionRounds = {};
      block.querySelectorAll(".status-detail-modal__action-round-panel").forEach(function (roundPanel) {
        var roundKey = roundPanel.getAttribute("data-action-round");
        if (roundKey === null) return;
        var roundEntry = createEmptyActionRoundData();
        readStatusDetailActionFieldsFromPanel(roundPanel, roundEntry);
        entry.actionRounds[roundKey] = roundEntry;
      });
      syncFlatActionFieldsFromRounds(entry);
      return;
    }

    readStatusDetailActionFieldsFromPanel(block, entry);
  }

  document
    .querySelectorAll("#statusDetailWorkBlocks .status-detail-modal__work-block")
    .forEach(function (block) {
      var scopeKey = block.getAttribute("data-scope-key");
      if (scopeKey === null) return;
      var entry = ensureScopeWorkEntry(scopeKey);
      var typeEl =
        block.querySelector(".status-detail-accident-type") ||
        block.querySelector(".status-detail-accident-type-readonly");
      var contentEl = block.querySelector(".status-detail-accident-content");
      var workerEl = block.querySelector(".status-detail-worker");

      entry.worker = workerEl ? workerEl.value.trim() : "";
      entry.accidentType = typeEl ? typeEl.value : "";
      entry.accidentContent = contentEl ? contentEl.value.trim() : "";

      if (block.querySelector(".status-detail-action-schedule")) {
        readStatusDetailActionFieldsFromBlock(block, entry);
      }
    });

  document
    .querySelectorAll("#statusDetailActionBlocks .status-detail-modal__work-block")
    .forEach(function (block) {
      var scopeKey = block.getAttribute("data-scope-key");
      if (scopeKey === null) return;
      readStatusDetailActionFieldsFromBlock(block, ensureScopeWorkEntry(scopeKey));
    });

  orders[idx].scopeWorkInfo = scopeWorkInfo;
  applyComputedProgressStatusToOrder(orders[idx]);
  syncOrderLegacyWorkFields(orders[idx]);
  var scopePhotos = {};
  document
    .querySelectorAll("#statusDetailPhotoBlocks .status-detail-modal__photo-block")
    .forEach(function (block) {
      var scopeKey = block.getAttribute("data-scope-key");
      if (scopeKey === null) return;
      var photoEntry = {};
      var n;
      for (n = 1; n <= STATUS_DETAIL_PHOTO_SLOT_COUNT; n++) {
        photoEntry["photo" + n] = getStatusDetailPhotoName(scopeKey, n);
        photoEntry["photo" + n + "Data"] = getStatusDetailPhotoData(scopeKey, n);
      }
      scopePhotos[scopeKey] = photoEntry;
    });

  orders[idx].scopePhotos = scopePhotos;
  syncOrderLegacyPhotos(orders[idx]);
  orders[idx].drawing1 = getStatusModalDrawingName(1);
  orders[idx].drawing1Data = getStatusModalDrawingData(1);
  orders[idx].drawing2 = getStatusModalDrawingName(2);
  orders[idx].drawing2Data = getStatusModalDrawingData(2);
  orders[idx].drawing3 = getStatusModalDrawingName(3);
  orders[idx].drawing3Data = getStatusModalDrawingData(3);

  saveStoredOrders(orders);
  alert("저장이 완료되었습니다.");
  closeStatusActionDatePicker();
  closeModal("modal-status-detail");

  if (activeAssignPageKey === "status" || activeAssignPageKey === "open") {
    updateAssignDateTitle(activeAssignPageKey);
    renderAssignTable(activeAssignPageKey);
  }
}

function initStatusDetailModal() {
  if (initializedScreens.statusDetailModal) return;
  initializedScreens.statusDetailModal = true;

  var saveBtn = document.getElementById("btnStatusDetailSave");
  if (saveBtn) {
    saveBtn.addEventListener("click", function () {
      saveStatusDetailFromModal();
    });
  }

  var workBlocks = document.getElementById("statusDetailWorkBlocks");
  var actionBlocks = document.getElementById("statusDetailActionBlocks");
  var popup = document.getElementById("statusActionDatePickerPopup");
  var prevBtn = document.getElementById("statusActionDatePickerPrev");
  var nextBtn = document.getElementById("statusActionDatePickerNext");

  function bindStatusActionDatePickerClick(container) {
    if (!container) return;
    container.addEventListener("click", function (e) {
      var pickerBtn = e.target.closest("[data-status-action-picker]");
      if (!pickerBtn) return;
      e.preventDefault();
      e.stopPropagation();
      var scopeKey = pickerBtn.getAttribute("data-status-action-picker") || "";
      if (popup && !popup.hidden && statusActionDatePickerScopeKey === scopeKey) {
        closeStatusActionDatePicker();
        return;
      }
      openStatusActionDatePicker(scopeKey);
    });
  }

  var scopeTags = document.getElementById("statusDetailWorkScopeTags");
  if (scopeTags) {
    scopeTags.addEventListener("click", function (e) {
      var tagBtn = e.target.closest(".status-detail-modal__scope-tag");
      if (!tagBtn) return;
      e.preventDefault();
      setActiveStatusDetailScope(tagBtn.getAttribute("data-scope-key") || "");
    });
  }

  bindStatusActionDatePickerClick(workBlocks);
  bindStatusActionDatePickerClick(actionBlocks);

  var actionRoundTags = document.getElementById("statusDetailActionRoundTags");
  if (actionRoundTags) {
    actionRoundTags.addEventListener("click", function (e) {
      var tagBtn = e.target.closest(".status-detail-modal__action-round-tag");
      if (!tagBtn) return;
      e.preventDefault();
      var roundNum = parseInt(tagBtn.getAttribute("data-action-round"), 10);
      if (!roundNum) return;
      setActiveStatusDetailActionRound(getActiveStatusDetailScopeKey(), roundNum);
    });
  }

  if (actionBlocks) {
    actionBlocks.addEventListener("change", function (e) {
      var partnerEl = e.target.closest(".status-detail-action-partner");
      if (!partnerEl) return;
      var panel = partnerEl.closest(".status-detail-modal__action-round-panel");
      if (!panel) panel = partnerEl.closest(".status-detail-modal__work-block");
      if (!panel) return;
      var workerEl = panel.querySelector(".status-detail-action-worker");
      if (workerEl) workerEl.value = "";
      refreshStatusDetailActionWorkerSelect(panel);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      shiftStatusActionDatePickerMonth(-1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      shiftStatusActionDatePickerMonth(1);
    });
  }

  document.addEventListener("click", function (e) {
    if (!popup || popup.hidden) return;
    if (
      e.target.closest("#statusActionDatePickerPopup") ||
      e.target.closest("[data-status-action-picker]")
    ) {
      return;
    }
    closeStatusActionDatePicker();
  });

  initStatusDetailPhotoHandlers();
  initStatusDetailDrawingHandlers();
}

function openStatusDetailModal(order) {
  var scopeText = formatAssignScopeLabels(order.scope);
  var addressText = [order.city, order.district, order.address].filter(Boolean).join(" ");
  var idx = getOrderIndexInStorage(order.orderNo);
  var idxEl = document.getElementById("statusDetailOrderIndex");

  if (idxEl) idxEl.value = idx >= 0 ? String(idx) : "";

  setStatusDetailText("statusDetailOrderNo", order.orderNo);
  setStatusDetailText("statusDetailScope", scopeText);
  setStatusDetailText("statusDetailSite", order.siteName);
  setStatusDetailText("statusDetailAddress", addressText);
  setStatusDetailText("statusDetailIssue", order.issue);
  renderStatusDetailWorkBlocks(order);

  renderStatusDetailPhotoSection(order);

  setModalDrawingDisplay("statusDetailDown1", order.drawing1, order.drawing1Data || "");
  setModalDrawingDisplay("statusDetailDown2", order.drawing2, order.drawing2Data || "");
  setModalDrawingDisplay("statusDetailDown3", order.drawing3, order.drawing3Data || "");

  statusDetailActiveActionRound = {};
  closeStatusActionDatePicker();
  openModal("modal-status-detail");
}

function renderAssignDetailScopeAndSales(order) {
  var activeKeys = getOrderScopeKeys(order.scope);
  var scopeSales = order.scopeSales || {};
  var scopeGroup = document.getElementById("assignDetailScopeGroup");

  if (scopeGroup) {
    scopeGroup.querySelectorAll(".order-scope-option").forEach(function (btn) {
      var key = btn.getAttribute("data-value") || "";
      btn.classList.toggle("order-scope-option--active", activeKeys.indexOf(key) >= 0);
      btn.disabled = true;
    });
  }

  ORDER_SCOPE_CODE_ORDER.forEach(function (key) {
    var input = document.getElementById("assignDetailSales-" + key);
    if (!input) return;
    var on = activeKeys.indexOf(key) >= 0;
    var cell = input.closest(".order-scope-sales-cell");
    var raw = scopeSales[key];
    var display = "";

    if (on) {
      if (raw != null && raw !== "") {
        display = formatOrderSales(String(raw));
      } else if (activeKeys.length === 1) {
        var total = order.salesAmount || orderSalesDigitsOnly(order.sales || "");
        display = total ? formatOrderSales(String(total)) : "";
      }
    }

    input.value = display;
    input.disabled = true;
    input.readOnly = true;
    if (cell) {
      cell.classList.toggle("order-scope-sales-cell--active", on);
    }
  });
}

function openAssignDetailModal(order) {
  var orderNoEl = document.getElementById("assignDetailOrderNo");
  var siteEl = document.getElementById("assignDetailSite");
  var addressEl = document.getElementById("assignDetailAddress");
  var issueEl = document.getElementById("assignDetailIssue");
  if (!orderNoEl || !siteEl || !addressEl || !issueEl) return;

  var addressText = [order.city, order.district, order.address].filter(Boolean).join(" ");
  var idx = getOrderIndexInStorage(order.orderNo);
  var idxEl = document.getElementById("assignDetailOrderIndex");

  if (idxEl) idxEl.value = idx >= 0 ? String(idx) : "";

  orderNoEl.textContent = order.orderNo || "";
  siteEl.textContent = order.siteName || "";
  addressEl.textContent = addressText;
  issueEl.textContent = order.issue || "";

  renderAssignDetailScopeAndSales(order);
  loadAssignDetailDrawingDraft(order);
  applyAssignDetailDrawingDraft();

  openModal("modal-assign-detail");
}

function collectAssignSelectionsFromDom(pageKey, orders) {
  var cfg = getAssignConfig(pageKey);
  var screen = document.getElementById(cfg.screenId);
  if (!screen) return;

  screen.querySelectorAll(".assign-partner-select").forEach(function (select) {
    var idx = parseInt(select.getAttribute("data-order-index"), 10);
    var scopeKey = select.getAttribute("data-scope-key");
    if (!orders[idx]) return;
    if (!orders[idx].assignedPartners || typeof orders[idx].assignedPartners !== "object") {
      orders[idx].assignedPartners = normalizeOrderAssignedPartners(orders[idx]);
    }
    if (scopeKey) {
      orders[idx].assignedPartners[scopeKey] = select.value;
    } else {
      orders[idx].assignedPartner = select.value;
    }
    syncOrderAssignedPartner(orders[idx]);
  });

  screen.querySelectorAll(".assign-worker-select").forEach(function (select) {
    var idx = parseInt(select.getAttribute("data-order-index"), 10);
    var scopeKey = select.getAttribute("data-scope-key");
    if (!orders[idx]) return;
    var selectedWorker = (select.value || "").trim();
    if (!orders[idx].scopeWorkInfo || typeof orders[idx].scopeWorkInfo !== "object") {
      orders[idx].scopeWorkInfo = normalizeOrderScopeWorkInfo(orders[idx]);
    }
    var key = scopeKey || "";
    if (!orders[idx].scopeWorkInfo[key]) {
      orders[idx].scopeWorkInfo[key] = getOrderScopeWorkData(orders[idx], key);
    }
    orders[idx].scopeWorkInfo[key].worker = selectedWorker;
    syncOrderLegacyWorkFields(orders[idx]);
  });
}

function persistAssignSelectionsFromDom(pageKey) {
  var orders = getStoredOrders();
  collectAssignSelectionsFromDom(pageKey, orders);
  saveStoredOrders(orders);
  updateAssignDateTitle(pageKey);
  renderAssignCalendars(pageKey);
  ["assign", "status", "open"].forEach(function (key) {
    if (key !== pageKey) renderAssignCalendars(key);
  });
}

function bindAssignTableLiveSync(pageKey) {
  var initKey = "assignLiveSync_" + pageKey;
  if (initializedScreens[initKey]) return;
  initializedScreens[initKey] = true;

  var cfg = getAssignConfig(pageKey);
  var screen = document.getElementById(cfg.screenId);
  if (!screen) return;

  screen.addEventListener("change", function (e) {
    if (
      e.target.matches(".assign-partner-select") ||
      e.target.matches(".assign-worker-select")
    ) {
      persistAssignSelectionsFromDom(pageKey);
    }
  });
}

function saveAssignOrders(pageKey) {
  var cfg = getAssignConfig(pageKey);
  var screen = document.getElementById(cfg.screenId);
  if (!screen) return;

  var orders = getStoredOrders();
  var deleteIndices = [];

  collectAssignSelectionsFromDom(pageKey, orders);

  screen.querySelectorAll(".assign-delete-check:checked").forEach(function (check) {
    var idx = parseInt(check.getAttribute("data-order-index"), 10);
    if (idx >= 0) deleteIndices.push(idx);
  });

  deleteIndices.sort(function (a, b) {
    return b - a;
  });
  deleteIndices.forEach(function (idx) {
    orders.splice(idx, 1);
  });

  saveStoredOrders(orders);
  alert("저장이 완료되었습니다.");
  updateAssignDateTitle(pageKey);
  renderAssignTable(pageKey);
  ["assign", "status", "open"].forEach(function (key) {
    if (key !== pageKey) renderAssignCalendars(key);
  });
}

function initAssignDateControls(pageKey) {
  var initKey = "assignDate_" + pageKey;
  if (initializedScreens[initKey]) return;
  initializedScreens[initKey] = true;

  var cfg = getAssignConfig(pageKey);
  var screen = document.getElementById(cfg.screenId);
  if (!screen) return;

  var yearEl = document.getElementById(cfg.ids.year);
  var monthEl = document.getElementById(cfg.ids.month);
  if (!yearEl || !monthEl) return;

  populateOrderYearSelect(yearEl, getAssignPicker(pageKey).year);

  yearEl.addEventListener("change", function () {
    syncAssignPickerFromControls(pageKey);
    saveUiState();
    updateAssignDateTitle(pageKey);
    renderAssignTable(pageKey);
  });
  monthEl.addEventListener("change", function () {
    syncAssignPickerFromControls(pageKey);
    saveUiState();
    updateAssignDateTitle(pageKey);
    renderAssignTable(pageKey);
  });

  screen.querySelectorAll("[data-assign-year]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var delta = parseInt(btn.getAttribute("data-assign-year"), 10);
      var idx = yearEl.selectedIndex + delta;
      if (idx >= 0 && idx < yearEl.options.length) {
        yearEl.selectedIndex = idx;
        updateAssignDateTitle(pageKey);
        renderAssignTable(pageKey);
      }
    });
  });

  screen.querySelectorAll("[data-assign-month]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var delta = parseInt(btn.getAttribute("data-assign-month"), 10);
      var idx = monthEl.selectedIndex + delta;
      if (idx >= 0 && idx < monthEl.options.length) {
        monthEl.selectedIndex = idx;
        updateAssignDateTitle(pageKey);
        renderAssignTable(pageKey);
      }
    });
  });
}

/* 4번: 오더배정 */
function initOrderAssignPage(screen) {
  if (!getAuth()) return;

  initLogout(screen);
  initOrderNavDelegation();

  if (!initializedScreens.orderAssign) {
    initializedScreens.orderAssign = true;
    initAssignDateControls("assign");
    initAssignDetailDrawingHandlers();
    bindAssignTableLiveSync("assign");

    var btnSave = document.getElementById("btnAssignSave");
    if (btnSave) {
      btnSave.addEventListener("click", function () {
        saveAssignOrders("assign");
      });
    }
  }

  syncAssignPickerFromControls("assign");
  updateAssignDateTitle("assign");
  renderAssignTable("assign");
}

/* 5번: 배정현황 */
function initOrderStatusPage(screen) {
  if (!getAuth()) return;

  initLogout(screen);
  initOrderNavDelegation();
  updateStatusWorkerFilterVisibilityByRole();

  if (!initializedScreens.orderStatus) {
    initializedScreens.orderStatus = true;
    initAssignDateControls("status");
    initStatusWorkerFilterControls();
    initStatusDetailModal();
    bindAssignTableLiveSync("status");

    var editProfileDetail = document.getElementById("btnEditProfileStatusDetail");
    if (editProfileDetail) {
      editProfileDetail.addEventListener("click", function (e) {
        e.preventDefault();
        closeModal("modal-status-detail");
        goToSignupEdit();
      });
    }


    var btnSave = document.getElementById("btnStatusSave");
    if (btnSave) {
      btnSave.addEventListener("click", function () {
        saveAssignOrders("status");
      });
    }
  }

  syncStatusWorkerFilterFromControls();
  syncAssignPickerFromControls("status");
  updateAssignDateTitle("status");
  renderAssignTable("status");
}

function initStatusWorkerFilterControls() {
  if (initializedScreens.statusWorkerFilter) return;
  initializedScreens.statusWorkerFilter = true;

  var group = document.getElementById("statusWorkerFilter");
  if (!group) return;

  group.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-status-worker-filter]");
    if (!btn) return;
    e.preventDefault();
    group.querySelectorAll(".assign-open-filter__btn").forEach(function (el) {
      var active = el === btn;
      el.classList.toggle("assign-open-filter__btn--active", active);
      el.setAttribute("aria-pressed", active ? "true" : "false");
    });
    syncStatusWorkerFilterFromControls();
    updateAssignDateTitle("status");
    renderAssignTable("status");
    renderAssignCalendars("status");
  });
}

function updateStatusWorkerFilterVisibilityByRole() {
  var auth = getAuth();
  var group = document.getElementById("statusWorkerFilter");
  if (!group) return;
  var isWorkerRole = !!auth && auth.role === "worker";
  group.style.display = isWorkerRole ? "none" : "";
  if (isWorkerRole) {
    group.querySelectorAll(".assign-open-filter__btn").forEach(function (el) {
      var active = el.getAttribute("data-status-worker-filter") === "assigned";
      el.classList.toggle("assign-open-filter__btn--active", active);
      el.setAttribute("aria-pressed", active ? "true" : "false");
    });
    var picker = getAssignPicker("status");
    if (picker) picker.workerFilter = "assigned";
  }
}

function initOpenActionFilterControls() {
  if (initializedScreens.openActionFilter) return;
  initializedScreens.openActionFilter = true;

  var group = document.getElementById("openActionFilter");
  if (!group) return;

  group.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-open-action-filter]");
    if (!btn) return;
    e.preventDefault();
    group.querySelectorAll(".assign-open-filter__btn").forEach(function (el) {
      var active = el === btn;
      el.classList.toggle("assign-open-filter__btn--active", active);
      el.setAttribute("aria-pressed", active ? "true" : "false");
    });
    syncOpenActionFilterFromControls();
    updateAssignDateTitle("open");
    renderAssignTable("open");
    renderAssignCalendars("open");
  });
}

function syncStatsModeFromControls() {
  var group = document.getElementById("statsModeNav");
  if (!group) {
    statsPickerState.mode = statsPickerState.mode || "assign";
    statsPickerState.view = statsPickerState.view || "assign";
    return;
  }
  var active = group.querySelector(".stats-mode-nav__btn--active");
  var view = active ? active.getAttribute("data-stats-mode") || "assign" : "assign";
  statsPickerState.view = view;
  if (view === "assign" || view === "open") {
    statsPickerState.mode = view;
  }
}

var STATS_KR_HOLIDAY_ISO = {
  2024: [
    "2024-01-01",
    "2024-02-09",
    "2024-02-10",
    "2024-02-11",
    "2024-02-12",
    "2024-03-01",
    "2024-04-10",
    "2024-05-05",
    "2024-05-06",
    "2024-05-15",
    "2024-06-06",
    "2024-08-15",
    "2024-09-16",
    "2024-09-17",
    "2024-09-18",
    "2024-10-03",
    "2024-10-09",
    "2024-12-25",
  ],
  2025: [
    "2025-01-01",
    "2025-01-28",
    "2025-01-29",
    "2025-01-30",
    "2025-03-01",
    "2025-03-03",
    "2025-05-05",
    "2025-05-06",
    "2025-06-06",
    "2025-08-15",
    "2025-10-03",
    "2025-10-05",
    "2025-10-06",
    "2025-10-07",
    "2025-10-08",
    "2025-10-09",
    "2025-12-25",
  ],
  2026: [
    "2026-01-01",
    "2026-02-16",
    "2026-02-17",
    "2026-02-18",
    "2026-03-01",
    "2026-03-02",
    "2026-05-05",
    "2026-05-25",
    "2026-06-06",
    "2026-08-15",
    "2026-09-24",
    "2026-09-25",
    "2026-09-26",
    "2026-10-03",
    "2026-10-09",
    "2026-12-25",
  ],
  2027: [
    "2027-01-01",
    "2027-02-06",
    "2027-02-07",
    "2027-02-08",
    "2027-03-01",
    "2027-05-05",
    "2027-05-13",
    "2027-06-06",
    "2027-08-15",
    "2027-09-14",
    "2027-09-15",
    "2027-09-16",
    "2027-10-03",
    "2027-10-09",
    "2027-10-11",
    "2027-12-25",
  ],
};

function getStatsKrHolidaySet(year) {
  var list = STATS_KR_HOLIDAY_ISO[year] || [];
  var set = {};
  var i;
  for (i = 0; i < list.length; i++) {
    set[list[i]] = true;
  }
  return set;
}

function isStatsBusinessDay(year, month, day, holidaySet) {
  var dow = new Date(year, month - 1, day).getDay();
  if (dow === 0 || dow === 6) return false;
  return !holidaySet[toConstructDateIso(year, month, day)];
}

function countStatsBusinessDaysInMonth(year, month, holidaySet) {
  var lastDate = new Date(year, month, 0).getDate();
  var count = 0;
  var d;
  for (d = 1; d <= lastDate; d++) {
    if (isStatsBusinessDay(year, month, d, holidaySet)) count++;
  }
  return count;
}

function countStatsBusinessDaysInYear(year, holidaySet) {
  var total = 0;
  var m;
  for (m = 1; m <= 12; m++) {
    total += countStatsBusinessDaysInMonth(year, m, holidaySet);
  }
  return total;
}

function orderMatchesStatsMode(order, mode) {
  if (!mode) return true;
  if (mode === "assign") return isOrderAssigned(order);
  if (mode === "open") return isOrderOpen(order);
  return true;
}

function getStatsAffiliatedWorkerCount(filters, rowKey, dimension) {
  if (dimension === "worker") return 1;
  if (dimension === "partner") {
    return Math.max(1, getRegisteredWorkers(rowKey).length);
  }
  if (filters.worker && filters.worker !== STATS_FILTER_ALL) return 1;
  if (filters.partner && filters.partner !== STATS_FILTER_ALL) {
    return Math.max(1, getRegisteredWorkers(filters.partner).length);
  }
  return Math.max(1, getRegisteredWorkers().length);
}

function getStatsAffiliatedWorkerCountTotal(filters, dimension, rowKeys) {
  var total = 0;
  var i;
  if (dimension === "worker") return Math.max(1, rowKeys.length);
  if (dimension === "partner") {
    for (i = 0; i < rowKeys.length; i++) {
      total += getRegisteredWorkers(rowKeys[i]).length;
    }
    return Math.max(1, total);
  }
  if (filters.worker && filters.worker !== STATS_FILTER_ALL) return 1;
  if (filters.partner && filters.partner !== STATS_FILTER_ALL) {
    return Math.max(1, getRegisteredWorkers(filters.partner).length);
  }
  return Math.max(1, getRegisteredWorkers().length);
}

function countStatsAssignedItemScopesForRowMonth(filters, rowKey, dimension, monthIndex) {
  var count = 0;
  var month = monthIndex + 1;

  getVisibleOrdersForCurrentUser().forEach(function (order) {
    if (!order.constructDate) return;
    var parts = String(order.constructDate).split("-");
    if (parts.length < 2) return;
    var year = parseInt(parts[0], 10);
    var m = parseInt(parts[1], 10);
    if (year !== filters.year || m !== month) return;

    var scopeKeys = getOrderStatsScopeKeys(order, filters);
    if (!scopeKeys.length) return;

    var k;
    var scopeKey;
    var seen = {};
    var partnersMap;
    var partnerId;
    var info;
    var workerVal;
    var workerId;

    if (dimension === "partner") {
      partnersMap = normalizeOrderAssignedPartners(order);
      for (k = 0; k < scopeKeys.length; k++) {
        scopeKey = scopeKeys[k];
        partnerId = (partnersMap[scopeKey] || order.assignedPartner || "").trim();
        if (!partnerId || partnerId !== rowKey || seen[partnerId]) continue;
        seen[partnerId] = true;
        count++;
      }
      return;
    }

    if (dimension === "worker") {
      info = normalizeOrderScopeWorkInfo(order);
      for (k = 0; k < scopeKeys.length; k++) {
        scopeKey = scopeKeys[k];
        workerVal = ((info[scopeKey] && info[scopeKey].worker) || "").trim();
        if (!workerVal) workerVal = (order.constructionWorker || "").trim();
        workerId = resolveStatsWorkerRowKey(workerVal);
        if (!workerId || workerId !== rowKey || seen[workerId]) continue;
        seen[workerId] = true;
        count++;
      }
      return;
    }

    for (k = 0; k < scopeKeys.length; k++) {
      scopeKey = scopeKeys[k];
      if (scopeKey === rowKey) count++;
    }
  });

  return count;
}

function countStatsAssignedItemScopesTotalMonth(filters, dimension, rowKeys, monthIndex) {
  var total = 0;
  var i;
  for (i = 0; i < rowKeys.length; i++) {
    total += countStatsAssignedItemScopesForRowMonth(filters, rowKeys[i], dimension, monthIndex);
  }
  return total;
}

function applyStatsAssignRatioRates(result, filters) {
  var holidaySet = getStatsKrHolidaySet(filters.year);
  var yearBusinessDays = countStatsBusinessDaysInYear(filters.year, holidaySet);
  if (yearBusinessDays < 1) yearBusinessDays = 1;
  var rowKeys = result.rowKeys || [];
  var dimension = result.dimension;
  var m;
  var key;
  var workers;
  var monthBusinessDays;
  var denom;

  rowKeys.forEach(function (rowKey) {
    if (!result.matrix[rowKey]) return;
    workers = getStatsAffiliatedWorkerCount(filters, rowKey, dimension);
    for (m = 0; m < 12; m++) {
      monthBusinessDays = countStatsBusinessDaysInMonth(filters.year, m + 1, holidaySet);
      if (monthBusinessDays < 1) monthBusinessDays = 1;
      denom = workers * monthBusinessDays;
      result.matrix[rowKey][m] = (result.matrix[rowKey][m] / denom) * 100;
    }
    denom = workers * yearBusinessDays;
    result.rowTotals[rowKey] = (result.rowTotals[rowKey] / denom) * 100;
  });

  var totalWorkers = getStatsAffiliatedWorkerCountTotal(filters, dimension, rowKeys);
  for (m = 0; m < 12; m++) {
    monthBusinessDays = countStatsBusinessDaysInMonth(filters.year, m + 1, holidaySet);
    if (monthBusinessDays < 1) monthBusinessDays = 1;
    denom = totalWorkers * monthBusinessDays;
    result.colTotals[m] = (result.colTotals[m] / denom) * 100;
  }

  denom = totalWorkers * yearBusinessDays;
  result.grandTotal = (result.grandTotal / denom) * 100;
}

function applyStatsOpenRatioRates(result, filters) {
  var rowKeys = result.rowKeys || [];
  var dimension = result.dimension;
  var m;
  var key;
  var workers;
  var orderScopes;
  var denom;

  rowKeys.forEach(function (rowKey) {
    if (!result.matrix[rowKey]) return;
    workers = getStatsAffiliatedWorkerCount(filters, rowKey, dimension);
    for (m = 0; m < 12; m++) {
      orderScopes = countStatsAssignedItemScopesForRowMonth(filters, rowKey, dimension, m);
      denom = workers * orderScopes;
      if (denom < 1) denom = 1;
      result.matrix[rowKey][m] = (result.matrix[rowKey][m] / denom) * 100;
    }

    orderScopes = 0;
    for (m = 0; m < 12; m++) {
      orderScopes += countStatsAssignedItemScopesForRowMonth(filters, rowKey, dimension, m);
    }
    denom = workers * orderScopes;
    if (denom < 1) denom = 1;
    result.rowTotals[rowKey] = (result.rowTotals[rowKey] / denom) * 100;
  });

  var totalWorkers = getStatsAffiliatedWorkerCountTotal(filters, dimension, rowKeys);
  for (m = 0; m < 12; m++) {
    orderScopes = countStatsAssignedItemScopesTotalMonth(filters, dimension, rowKeys, m);
    denom = totalWorkers * orderScopes;
    if (denom < 1) denom = 1;
    result.colTotals[m] = (result.colTotals[m] / denom) * 100;
  }

  orderScopes = 0;
  for (m = 0; m < 12; m++) {
    orderScopes += countStatsAssignedItemScopesTotalMonth(filters, dimension, rowKeys, m);
  }
  denom = totalWorkers * orderScopes;
  if (denom < 1) denom = 1;
  result.grandTotal = (result.grandTotal / denom) * 100;
}

function getStatsFilterValues() {
  syncStatsModeFromControls();
  var auth = getAuth();
  var isPartnerRole = !!auth && auth.role === "partner";
  var isWorkerRole = !!auth && auth.role === "worker";
  var partnerEl = document.getElementById("statsPartner");
  var workerEl = document.getElementById("statsWorker");
  var yearEl = document.getElementById("statsYear");
  var itemEl = document.getElementById("statsItem");
  var aggregateEl = document.getElementById("statsAggregate");
  var rankEl = document.getElementById("statsRank");
  var metric = aggregateEl ? aggregateEl.value : "count";
  if (metric !== "count" && metric !== "sales") metric = "count";
  if (statsPickerState.view === "ratio") metric = "ratio";
  var partnerValue = partnerEl ? partnerEl.value : STATS_FILTER_ALL;
  if (isPartnerRole) {
    partnerValue = (auth.userId || "").trim() || STATS_FILTER_ALL;
  } else if (isWorkerRole) {
    partnerValue = (auth.partnerUserId || "").trim() || STATS_FILTER_ALL;
  }
  var workerValue = workerEl ? workerEl.value : STATS_FILTER_ALL;
  if (isWorkerRole) {
    workerValue = (auth.userId || "").trim() || STATS_FILTER_ALL;
  }
  return {
    partner: partnerValue,
    worker: workerValue,
    metric: metric,
    year: yearEl ? clampOrderYear(yearEl.value) : statsPickerState.year,
    item: resolveStatsItemValue(itemEl ? itemEl.value : ""),
    mode: statsPickerState.mode || "assign",
    rank: rankEl ? rankEl.value : "best",
  };
}

function sortStatsRowKeys(rowKeys, rowTotals, rank, mode) {
  var keys = rowKeys.slice();
  var higherIsBetter = mode !== "open";
  keys.sort(function (a, b) {
    var va = rowTotals[a] || 0;
    var vb = rowTotals[b] || 0;
    if (higherIsBetter) {
      return rank === "worst" ? va - vb : vb - va;
    }
    return rank === "worst" ? vb - va : va - vb;
  });
  return keys;
}

function getStatsRowDimension(filters) {
  if (filters.partner === STATS_FILTER_ALL) return "partner";
  if (filters.worker === STATS_FILTER_ALL) return "worker";
  return "scope";
}

function createEmptyStatsMatrixRowKeys(rowKeys, rowLabels) {
  var matrix = {};
  var rowTotals = {};
  var i;
  for (i = 0; i < rowKeys.length; i++) {
    matrix[rowKeys[i]] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    rowTotals[rowKeys[i]] = 0;
  }
  return { matrix: matrix, rowTotals: rowTotals, rowLabels: rowLabels || {} };
}

function getOrderStatsScopeKeys(order, filters) {
  var keys = getOrderScopeKeys(order.scope);
  if (!keys.length) return [];
  if (filters.item && filters.item !== STATS_FILTER_ALL) {
    if (keys.indexOf(filters.item) < 0) return [];
    return [filters.item];
  }
  return keys;
}

function getOrderStatsRawValue(order, filters) {
  if (filters.metric === "sales") {
    return parseInt(order.salesAmount || orderSalesDigitsOnly(order.sales || ""), 10) || 0;
  }
  return 1;
}

function statsAddMatrixValue(matrix, rowTotals, colTotals, grandTotalRef, rowKey, monthIndex, value) {
  if (!matrix[rowKey]) {
    matrix[rowKey] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    rowTotals[rowKey] = 0;
  }
  matrix[rowKey][monthIndex] += value;
  rowTotals[rowKey] += value;
  colTotals[monthIndex] += value;
  grandTotalRef.value += value;
}

function resolveStatsWorkerRowKey(workerValue) {
  var v = (workerValue || "").trim();
  if (!v) return "";
  var users = getRegisteredUsers().filter(function (u) {
    return u.role === "worker";
  });
  var i;
  for (i = 0; i < users.length; i++) {
    if (users[i].userId === v || users[i].name === v) return users[i].userId;
  }
  return v;
}

function getPartnerDisplayLabel(partnerId) {
  var partner = getRegisteredPartners().find(function (p) {
    return p.userId === partnerId;
  });
  if (!partner) return partnerId;
  return partner.partnerCompany || partner.name || partner.userId;
}

function getWorkerDisplayLabel(workerId) {
  var worker = getRegisteredUsers().find(function (u) {
    return u.userId === workerId;
  });
  if (!worker) return workerId;
  return worker.name || worker.userId;
}

function syncStatsPickerFromControls() {
  var yearEl = document.getElementById("statsYear");
  if (yearEl) statsPickerState.year = parseInt(yearEl.value, 10);
}

function orderMatchesStatsPartnerFilter(order, partnerId) {
  if (!partnerId || partnerId === STATS_FILTER_ALL) return true;
  var partners = normalizeOrderAssignedPartners(order);
  var keys = getOrderScopeKeys(order.scope);
  var i;
  for (i = 0; i < keys.length; i++) {
    if ((partners[keys[i]] || "") === partnerId) return true;
  }
  return (order.assignedPartner || "") === partnerId;
}

function orderMatchesStatsWorkerFilter(order, workerId) {
  if (!workerId || workerId === STATS_FILTER_ALL) return true;
  var worker = getRegisteredUsers().find(function (u) {
    return u.userId === workerId;
  });
  if (!worker) return false;

  var name = worker.name || worker.userId;
  var info = normalizeOrderScopeWorkInfo(order);
  var keys = getOrderScopeKeys(order.scope);
  var i;
  var w;

  if (keys.length) {
    for (i = 0; i < keys.length; i++) {
      w = ((info[keys[i]] && info[keys[i]].worker) || "").trim();
      if (w === name || w === worker.userId) return true;
    }
    return false;
  }

  w = (order.constructionWorker || "").trim();
  return w === name || w === worker.userId;
}

function finalizeStatsMatrixResult(base, filters, rowKeys, rowLabels, dimension) {
  var result = {
    matrix: base.matrix,
    rowTotals: base.rowTotals,
    colTotals: base.colTotals,
    grandTotal: base.grandTotal,
    rowKeys: rowKeys,
    rowLabels: rowLabels,
    dimension: dimension,
  };

  if (filters.metric === "ratio") {
    if (filters.mode === "open") {
      applyStatsOpenRatioRates(result, filters);
    } else {
      applyStatsAssignRatioRates(result, filters);
    }
  }

  return result;
}

function getStatsPartnerMatrix(filters) {
  var partners = getRegisteredPartners();
  var rowKeys = partners.map(function (p) {
    return p.userId;
  });
  var rowLabels = {};
  var i;
  var base = createEmptyStatsMatrixRowKeys(rowKeys, rowLabels);
  var matrix = base.matrix;
  var rowTotals = base.rowTotals;
  var colTotals = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  var grandTotalRef = { value: 0 };

  for (i = 0; i < partners.length; i++) {
    rowLabels[partners[i].userId] = getPartnerDisplayLabel(partners[i].userId);
  }

  getVisibleOrdersForCurrentUser().forEach(function (order) {
    if (!order.constructDate) return;
    var parts = String(order.constructDate).split("-");
    if (parts.length < 2) return;
    var year = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10);
    if (year !== filters.year || month < 1 || month > 12) return;
    if (!orderMatchesStatsMode(order, filters.mode)) return;
    if (!orderMatchesStatsWorkerFilter(order, filters.worker)) return;

    var scopeKeys = getOrderStatsScopeKeys(order, filters);
    if (!scopeKeys.length) return;

    var partnersMap = normalizeOrderAssignedPartners(order);
    var seen = {};
    var k;
    var partnerId;

    for (k = 0; k < scopeKeys.length; k++) {
      partnerId = (partnersMap[scopeKeys[k]] || order.assignedPartner || "").trim();
      if (!partnerId || seen[partnerId]) continue;
      seen[partnerId] = true;
      statsAddMatrixValue(
        matrix,
        rowTotals,
        colTotals,
        grandTotalRef,
        partnerId,
        month - 1,
        getOrderStatsScopeSalesValue(order, scopeKeys[k], filters)
      );
    }
  });

  return finalizeStatsMatrixResult(
    {
      matrix: matrix,
      rowTotals: rowTotals,
      colTotals: colTotals,
      grandTotal: grandTotalRef.value,
    },
    filters,
    rowKeys,
    rowLabels,
    "partner"
  );
}

function getStatsWorkerMatrix(filters) {
  var workers = getRegisteredWorkers(filters.partner);
  var rowKeys = workers.map(function (w) {
    return w.userId;
  });
  var rowLabels = {};
  var i;
  var base = createEmptyStatsMatrixRowKeys(rowKeys, rowLabels);
  var matrix = base.matrix;
  var rowTotals = base.rowTotals;
  var colTotals = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  var grandTotalRef = { value: 0 };

  for (i = 0; i < workers.length; i++) {
    rowLabels[workers[i].userId] = getWorkerDisplayLabel(workers[i].userId);
  }

  getVisibleOrdersForCurrentUser().forEach(function (order) {
    if (!order.constructDate) return;
    var parts = String(order.constructDate).split("-");
    if (parts.length < 2) return;
    var year = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10);
    if (year !== filters.year || month < 1 || month > 12) return;
    if (!orderMatchesStatsMode(order, filters.mode)) return;
    if (!orderMatchesStatsPartnerFilter(order, filters.partner)) return;

    var scopeKeys = getOrderStatsScopeKeys(order, filters);
    if (!scopeKeys.length) return;

    var info = normalizeOrderScopeWorkInfo(order);
    var seen = {};
    var k;
    var workerId;
    var workerVal;

    for (k = 0; k < scopeKeys.length; k++) {
      workerVal = ((info[scopeKeys[k]] && info[scopeKeys[k]].worker) || "").trim();
      if (!workerVal && !scopeKeys.length) {
        workerVal = (order.constructionWorker || "").trim();
      }
      workerId = resolveStatsWorkerRowKey(workerVal);
      if (!workerId || seen[workerId]) continue;
      seen[workerId] = true;
      statsAddMatrixValue(
        matrix,
        rowTotals,
        colTotals,
        grandTotalRef,
        workerId,
        month - 1,
        getOrderStatsScopeSalesValue(order, scopeKeys[k], filters)
      );
    }
  });

  return finalizeStatsMatrixResult(
    {
      matrix: matrix,
      rowTotals: rowTotals,
      colTotals: colTotals,
      grandTotal: grandTotalRef.value,
    },
    filters,
    rowKeys,
    rowLabels,
    "worker"
  );
}

function getStatsScopeMatrix(filters) {
  var rowKeys = ORDER_SCOPE_CODE_ORDER.slice();
  var rowLabels = {};
  var i;
  for (i = 0; i < rowKeys.length; i++) {
    rowLabels[rowKeys[i]] =
      ASSIGN_SCOPE_LABELS[rowKeys[i]] || ORDER_SCOPE_LABELS[rowKeys[i]] || rowKeys[i];
  }

  var base = createEmptyStatsMatrixRowKeys(rowKeys, rowLabels);
  var matrix = base.matrix;
  var rowTotals = base.rowTotals;
  var colTotals = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  var grandTotalRef = { value: 0 };

  getVisibleOrdersForCurrentUser().forEach(function (order) {
    if (!order.constructDate) return;
    var parts = String(order.constructDate).split("-");
    if (parts.length < 2) return;
    var year = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10);
    if (year !== filters.year || month < 1 || month > 12) return;
    if (!orderMatchesStatsMode(order, filters.mode)) return;
    if (!orderMatchesStatsPartnerFilter(order, filters.partner)) return;
    if (!orderMatchesStatsWorkerFilter(order, filters.worker)) return;

    var keys = getOrderStatsScopeKeys(order, filters);
    if (!keys.length) return;

    keys.forEach(function (key) {
      statsAddMatrixValue(
        matrix,
        rowTotals,
        colTotals,
        grandTotalRef,
        key,
        month - 1,
        getOrderStatsScopeSalesValue(order, key, filters)
      );
    });
  });

  if (filters.item && filters.item !== STATS_FILTER_ALL) {
    rowKeys = [filters.item];
  }

  return finalizeStatsMatrixResult(
    {
      matrix: matrix,
      rowTotals: rowTotals,
      colTotals: colTotals,
      grandTotal: grandTotalRef.value,
    },
    filters,
    rowKeys,
    rowLabels,
    "scope"
  );
}

function getStatsMatrix(filters) {
  var dimension = getStatsRowDimension(filters);
  if (dimension === "partner") return getStatsPartnerMatrix(filters);
  if (dimension === "worker") return getStatsWorkerMatrix(filters);
  return getStatsScopeMatrix(filters);
}

function formatStatsPercent(value) {
  var n = Number(value);
  if (!isFinite(n)) n = 0;
  return n.toFixed(1) + "%";
}

function formatStatsSalesInMillion(value) {
  var n = Number(value);
  if (!isFinite(n)) n = 0;
  if (n === 0) return "0";

  var million = n / 1000000;
  var text;

  if (Math.abs(million) >= 10) {
    text = String(Math.round(million));
  } else {
    var rounded = Math.round(million * 10) / 10;
    text = rounded % 1 === 0 ? String(rounded) : rounded.toFixed(1);
  }

  var parts = text.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

function updateStatsUnitLabel(metric) {
  var el = document.getElementById("statsUnitLabel");
  if (!el) return;
  if (metric === "sales") {
    el.textContent = "[ 단위 : 백만원 ]";
  } else if (metric === "ratio") {
    el.textContent = "[ 단위 : % ]";
  } else {
    el.textContent = "[ 단위 : 건수 ]";
  }
}

function updateStatsRatioFormula(filters) {
  var el = document.getElementById("statsRatioFormula");
  if (!el) return;
  el.hidden = !filters || filters.metric !== "ratio";
}

function updateStatsAggregateControlState() {
  var aggregateEl = document.getElementById("statsAggregate");
  if (!aggregateEl) return;
  aggregateEl.disabled = statsPickerState.view === "ratio";
}

function formatStatsValue(value, metric) {
  if (metric === "ratio") {
    return formatStatsPercent(value);
  }
  if (metric === "sales") {
    return formatStatsSalesInMillion(value);
  }
  return String(Math.round(value));
}

function populateStatsPartnerSelect() {
  var select = document.getElementById("statsPartner");
  if (!select) return;
  var auth = getAuth();
  var isPartnerRole = !!auth && auth.role === "partner";
  var isWorkerRole = !!auth && auth.role === "worker";
  var field = select.closest(".order-field");
  if (field) field.style.display = isPartnerRole || isWorkerRole ? "none" : "";

  if (isPartnerRole || isWorkerRole) {
    var partnerId = isPartnerRole
      ? (auth.userId || "").trim()
      : (auth.partnerUserId || "").trim();
    if (partnerId) {
      select.innerHTML = '<option value="' + escapeHtml(partnerId) + '">내 협력사</option>';
      select.value = partnerId;
    } else {
      select.innerHTML = '<option value="' + STATS_FILTER_ALL + '">전체</option>';
      select.value = STATS_FILTER_ALL;
    }
    return;
  }

  var current = select.value || STATS_FILTER_ALL;
  var html = '<option value="' + STATS_FILTER_ALL + '">전체</option>';
  getRegisteredPartners().forEach(function (p) {
    var name = p.partnerCompany || p.name || p.userId;
    html +=
      '<option value="' +
      escapeHtml(p.userId) +
      '">' +
      escapeHtml(name) +
      "</option>";
  });
  select.innerHTML = html;

  if (select.querySelector('option[value="' + current + '"]')) {
    select.value = current;
  } else {
    select.value = STATS_FILTER_ALL;
  }
}

function populateStatsWorkerSelect() {
  var auth = getAuth();
  var isPartnerRole = !!auth && auth.role === "partner";
  var isWorkerRole = !!auth && auth.role === "worker";
  var partnerEl = document.getElementById("statsPartner");
  var select = document.getElementById("statsWorker");
  if (!select) return;
  var field = select.closest(".order-field");
  if (field) field.style.display = isWorkerRole ? "none" : "";

  var partnerId = isPartnerRole
    ? (auth.userId || "").trim()
    : isWorkerRole
    ? (auth.partnerUserId || "").trim()
    : partnerEl
    ? partnerEl.value
    : STATS_FILTER_ALL;
  var current = select.value || STATS_FILTER_ALL;
  var html = '<option value="' + STATS_FILTER_ALL + '">전체</option>';

  if (isWorkerRole) {
    var selfId = (auth.userId || "").trim();
    var selfName = (auth.name || auth.userId || "").trim();
    if (selfId) {
      html += '<option value="' + escapeHtml(selfId) + '">' + escapeHtml(selfName) + "</option>";
      current = selfId;
    }
  } else if (partnerId && partnerId !== STATS_FILTER_ALL) {
    getRegisteredWorkers(partnerId).forEach(function (w) {
      var name = w.name || w.userId;
      html +=
        '<option value="' +
        escapeHtml(w.userId) +
        '">' +
        escapeHtml(name) +
        "</option>";
    });
  }

  select.innerHTML = html;
  if (select.querySelector('option[value="' + current + '"]')) {
    select.value = current;
  } else {
    select.value = STATS_FILTER_ALL;
  }
}

function getDefaultStatsItem() {
  return ORDER_SCOPE_CODE_ORDER[0] || "";
}

function resolveStatsItemValue(raw) {
  if (raw && raw !== STATS_FILTER_ALL && ORDER_SCOPE_CODE_ORDER.indexOf(raw) >= 0) {
    return raw;
  }
  return getDefaultStatsItem();
}

function populateStatsItemSelect() {
  var select = document.getElementById("statsItem");
  if (!select) return;

  var current = resolveStatsItemValue(select.value);
  var html = "";
  ORDER_SCOPE_CODE_ORDER.forEach(function (key) {
    var label = ASSIGN_SCOPE_LABELS[key] || ORDER_SCOPE_LABELS[key] || key;
    html +=
      '<option value="' + escapeHtml(key) + '">' + escapeHtml(label) + "</option>";
  });
  select.innerHTML = html;
  select.value = current;
}

function updateStatsWorkerControlState() {
  var auth = getAuth();
  var isPartnerRole = !!auth && auth.role === "partner";
  var isWorkerRole = !!auth && auth.role === "worker";
  var partnerEl = document.getElementById("statsPartner");
  var workerEl = document.getElementById("statsWorker");
  if (!partnerEl || !workerEl) return;

  if (isWorkerRole) {
    workerEl.disabled = true;
    populateStatsWorkerSelect();
    return;
  }

  if (isPartnerRole) {
    workerEl.disabled = false;
    populateStatsWorkerSelect();
    return;
  }

  var isAll = partnerEl.value === STATS_FILTER_ALL;
  workerEl.disabled = isAll;
  if (isAll) {
    workerEl.value = STATS_FILTER_ALL;
  } else {
    populateStatsWorkerSelect();
  }
}

function statsShowsTotals() {
  return true;
}

function updateStatsTotalsVisibility(filters) {
  var table = document.querySelector(".stats-table");
  if (!table) return;
  table.classList.toggle("stats-table--no-totals", !statsShowsTotals());
}

function getStatsChartMonths(filters, result) {
  var empty = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  if (result.dimension === "scope") {
    return result.matrix[filters.item] || empty;
  }
  return result.colTotals ? result.colTotals.slice() : empty;
}

function getStatsRatioNiceStep(rawStep) {
  if (!isFinite(rawStep) || rawStep <= 0) return 1;
  var magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
  var residual = rawStep / magnitude;
  var nice;
  if (residual <= 1) nice = 1;
  else if (residual <= 2) nice = 2;
  else if (residual <= 5) nice = 5;
  else nice = 10;
  return nice * magnitude;
}

function getStatsRatioChartScale(dataMax) {
  var targetTicks = 5;
  var paddedMax = dataMax > 0 ? dataMax * 1.1 : 0;
  var step;
  var axisMax;

  if (paddedMax <= 0) {
    return { axisMax: 10, step: 2 };
  }

  step = getStatsRatioNiceStep(paddedMax / (targetTicks - 1));
  if (step < 0.1) step = 0.1;
  axisMax = Math.ceil(paddedMax / step) * step;
  if (axisMax < step * (targetTicks - 1)) {
    axisMax = step * (targetTicks - 1);
  }

  return { axisMax: axisMax, step: step };
}

function getStatsChartAxisMax(dataMax, filters) {
  if (filters.metric === "ratio") {
    return getStatsRatioChartScale(dataMax).axisMax;
  }
  if (dataMax <= 0) return 4;
  var m = Math.ceil(dataMax);
  if (m <= 4) return 4;
  if (m <= 10) return 10;
  if (m <= 20) return 20;
  if (m <= 50) return 50;
  if (m <= 100) return 100;
  var step = Math.pow(10, Math.floor(Math.log10(m)));
  return Math.ceil(m / step) * step;
}

function getStatsRatioTickValues(axisMax, step) {
  var ticks = [0];
  var v;
  var seen = { 0: true };
  var decimals = step < 1 ? 1 : 0;

  function pushTick(value) {
    var rounded = decimals
      ? Math.round(value * 10) / 10
      : Math.round(value);
    if (seen[rounded]) return;
    seen[rounded] = true;
    ticks.push(rounded);
  }

  for (v = step; v < axisMax; v += step) {
    pushTick(v);
  }
  pushTick(axisMax);

  ticks.sort(function (a, b) {
    return a - b;
  });
  return ticks;
}

function getStatsChartTickValues(axisMax, filters) {
  var ticks = [];
  var count;
  var i;
  var v;
  var seen = {};

  if (axisMax <= 0) return [0];

  if (filters && filters.metric === "ratio") {
    var ratioStep = getStatsRatioNiceStep(axisMax / 4);
    if (ratioStep < 0.1) ratioStep = 0.1;
    return getStatsRatioTickValues(axisMax, ratioStep);
  }

  count = axisMax <= 4 ? axisMax + 1 : 5;
  for (i = 0; i < count; i++) {
    v = Math.round((axisMax * i) / (count - 1));
    if (!seen[v]) {
      seen[v] = true;
      ticks.push(v);
    }
  }
  ticks.sort(function (a, b) {
    return a - b;
  });
  return ticks;
}

function getStatsChartTickTopPct(tickValue, axisMax) {
  if (axisMax <= 0) return 100;
  return (1 - tickValue / axisMax) * 100;
}

function isStatsDisplayZeroText(text, metric) {
  var s = (text == null ? "" : String(text)).trim();
  if (!s) return true;
  if (metric === "ratio") {
    // e.g. "0.0%"
    return /^0(\.0+)?%$/.test(s);
  }
  // count/sales: formatStatsValue returns "0" when rounded to zero
  return s === "0";
}

function normalizeStatsDisplayText(text, metric) {
  return isStatsDisplayZeroText(text, metric) ? "-" : text;
}

function buildStatsChartScopeHtml(axisMax, filters, ratioScale) {
  var tickValues = ratioScale
    ? getStatsRatioTickValues(ratioScale.axisMax, ratioScale.step)
    : getStatsChartTickValues(axisMax, filters);
  tickValues = tickValues.filter(function (v) {
    return v !== 0;
  });
  var html =
    '<div class="stats-chart-scope">' +
    '<div class="stats-chart-yaxis" aria-hidden="true">' +
    '<div class="stats-chart-yaxis__ticks">';
  var i;
  var topPct;
  for (i = 0; i < tickValues.length; i++) {
    topPct = getStatsChartTickTopPct(tickValues[i], axisMax);
    var tickText = normalizeStatsDisplayText(
      formatStatsValue(tickValues[i], filters.metric),
      filters.metric
    );
    html +=
      '<span class="stats-chart-yaxis__tick" style="top:' +
      topPct +
      '%">' +
      '<span class="stats-chart-yaxis__tick-label">' +
      escapeHtml(tickText) +
      "</span>" +
      '<span class="stats-chart-yaxis__tick-mark" aria-hidden="true"></span>' +
      "</span>";
  }
  html += "</div></div></div>";
  return html;
}

function renderStatsChart() {
  var row = document.getElementById("statsChartRow");
  if (!row) return;

  var cells = row.querySelectorAll(".stats-chart-row__cell");
  if (!cells.length) return;

  var filters = getStatsFilterValues();
  var result = getStatsMatrix(filters);
  var months = getStatsChartMonths(filters, result);
  var max = 0;
  var m;
  var axisMax;
  var ratioScale = null;
  var scopeCell = row.querySelector(".stats-chart-row__scope");

  for (m = 0; m < months.length; m++) {
    if (months[m] > max) max = months[m];
  }

  if (filters.metric === "ratio") {
    ratioScale = getStatsRatioChartScale(max);
    axisMax = ratioScale.axisMax;
  } else {
    axisMax = getStatsChartAxisMax(max, filters);
  }

  if (scopeCell) {
    scopeCell.innerHTML = buildStatsChartScopeHtml(axisMax, filters, ratioScale);
  }

  for (m = 0; m < 12; m++) {
    var value = months[m];
    var heightPct = axisMax > 0 ? (value / axisMax) * 100 : 0;
    var valueText = formatStatsValue(value, filters.metric);
    var valueDisplayText = normalizeStatsDisplayText(valueText, filters.metric);
    var valueBottom = heightPct > 0 ? heightPct : 0;
    var valueHtml = "";
    var isZeroText = isStatsDisplayZeroText(valueText, filters.metric);

    if (value > 0) {
      valueHtml =
        '<span class="stats-chart__bar-value" style="bottom:calc(' +
        valueBottom +
        '% + 4px)">' +
        escapeHtml(valueDisplayText) +
        "</span>";
    }

    var titleAttr = ' title="' + escapeHtml(valueDisplayText) + '"';
    cells[m].innerHTML =
      '<div class="stats-chart__plot">' +
      '<div class="stats-chart__bar-area">' +
      valueHtml +
      '<div class="stats-chart__bar" style="height:' +
      heightPct +
      '%"' +
      titleAttr +
      '></div>' +
      "</div></div>";
  }
}

function renderStatsTable() {
  var tbody = document.getElementById("statsTableBody");
  if (!tbody) return;

  var filters = getStatsFilterValues();
  var result = getStatsMatrix(filters);
  var matrix = result.matrix;
  var rowTotals = result.rowTotals;
  var colTotals = result.colTotals;
  var grandTotal = result.grandTotal;
  var rowLabels = result.rowLabels || {};
  var showTotals = statsShowsTotals();
  var html = "";
  var m;
  var rowKeys = (result.rowKeys || []).slice();

  if (rowKeys.length > 1) {
    rowKeys = sortStatsRowKeys(rowKeys, rowTotals, filters.rank, filters.mode);
  }

  rowKeys.forEach(function (key, index) {
    var label = rowLabels[key] || key;
    var rowMonths = matrix[key] || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    html += "<tr>";
    html +=
      '<td class="assign-table__td stats-table__rank-col">' +
      escapeHtml(String(index + 1)) +
      "</td>";
    html +=
      '<td class="assign-table__td assign-table__td--scope">' +
      escapeHtml(label) +
      "</td>";
    for (m = 0; m < 12; m++) {
      var monthText = normalizeStatsDisplayText(
        formatStatsValue(rowMonths[m], filters.metric),
        filters.metric
      );
      html +=
        '<td class="assign-table__td stats-table__month-col">' +
        escapeHtml(monthText) +
        "</td>";
    }
    if (showTotals) {
      var rowTotalText = normalizeStatsDisplayText(
        formatStatsValue(rowTotals[key] || 0, filters.metric),
        filters.metric
      );
      html +=
        '<td class="assign-table__td assign-table__td--total stats-table__total-col">' +
        escapeHtml(rowTotalText) +
        "</td>";
    }
    html += "</tr>";
  });

  if (showTotals) {
    html += '<tr class="stats-table__totals-row">';
    html += '<td class="assign-table__td stats-table__rank-col"></td>';
    html += '<td class="assign-table__td assign-table__td--scope">합계</td>';
    for (m = 0; m < 12; m++) {
      var colTotalText = normalizeStatsDisplayText(
        formatStatsValue(colTotals[m], filters.metric),
        filters.metric
      );
      html +=
        '<td class="assign-table__td assign-table__td--total stats-table__month-col">' +
        escapeHtml(colTotalText) +
        "</td>";
    }
    var grandTotalText = normalizeStatsDisplayText(
      formatStatsValue(grandTotal, filters.metric),
      filters.metric
    );
    html +=
      '<td class="assign-table__td assign-table__td--total stats-table__total-col">' +
      escapeHtml(grandTotalText) +
      "</td>";
    html += "</tr>";
  }

  tbody.innerHTML = html;
  updateStatsTotalsVisibility(filters);
}

function renderStatsView() {
  syncStatsPickerFromControls();
  var filters = getStatsFilterValues();
  updateStatsAggregateControlState();
  updateStatsUnitLabel(filters.metric);
  updateStatsRatioFormula(filters);
  updateStatsTotalsVisibility(filters);
  renderStatsChart();
  renderStatsTable();
}

function initStatsModeNavControls() {
  if (initializedScreens.statsModeNav) return;
  initializedScreens.statsModeNav = true;

  var group = document.getElementById("statsModeNav");
  if (!group) return;

  group.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-stats-mode]");
    if (!btn) return;
    e.preventDefault();
    group.querySelectorAll(".stats-mode-nav__btn").forEach(function (el) {
      var active = el === btn;
      el.classList.toggle("stats-mode-nav__btn--active", active);
      el.setAttribute("aria-pressed", active ? "true" : "false");
    });
    syncStatsModeFromControls();
    renderStatsView();
  });
}

function initStatsFilterControls() {
  if (initializedScreens.statsFilters) return;
  initializedScreens.statsFilters = true;

  var yearEl = document.getElementById("statsYear");
  var partnerEl = document.getElementById("statsPartner");
  var workerEl = document.getElementById("statsWorker");
  var itemEl = document.getElementById("statsItem");
  var aggregateEl = document.getElementById("statsAggregate");
  var rankEl = document.getElementById("statsRank");

  if (yearEl) {
    yearEl.addEventListener("change", function () {
      saveUiState();
      renderStatsView();
    });
  }

  if (partnerEl) {
    partnerEl.addEventListener("change", function () {
      updateStatsWorkerControlState();
      saveUiState();
      renderStatsView();
    });
  }

  if (workerEl) {
    workerEl.addEventListener("change", function () {
      saveUiState();
      renderStatsView();
    });
  }

  if (itemEl) {
    itemEl.addEventListener("change", function () {
      saveUiState();
      renderStatsView();
    });
  }

  if (aggregateEl) {
    aggregateEl.addEventListener("change", function () {
      saveUiState();
      renderStatsView();
    });
  }

  if (rankEl) {
    rankEl.addEventListener("change", function () {
      saveUiState();
      renderStatsView();
    });
  }
}

/* 7번: 통계 */
function initOrderStatsPage(screen) {
  if (!getAuth()) return;

  initLogout(screen);
  initOrderNavDelegation();
  initStatsModeNavControls();
  initStatsFilterControls();

  if (!initializedScreens.orderStats) {
    initializedScreens.orderStats = true;

  }

  var yearEl = document.getElementById("statsYear");
  populateOrderYearSelect(yearEl, statsPickerState.year);

  populateStatsPartnerSelect();
  populateStatsItemSelect();
  updateStatsWorkerControlState();
  syncStatsModeFromControls();
  renderStatsView();
}

/* 6번: 미마감 */
function initOrderOpenPage(screen) {
  if (!getAuth()) return;

  initLogout(screen);
  initOrderNavDelegation();

  if (!initializedScreens.orderOpen) {
    initializedScreens.orderOpen = true;
    initAssignDateControls("open");
    initOpenActionFilterControls();
    initStatusDetailModal();
    bindAssignTableLiveSync("open");

    var btnSave = document.getElementById("btnOpenSave");
    if (btnSave) {
      btnSave.addEventListener("click", function () {
        saveAssignOrders("open");
      });
    }
  }

  syncOpenActionFilterFromControls();
  syncAssignPickerFromControls("open");
  updateAssignDateTitle("open");
  renderAssignTable("open");
}

/* 3번: 오더등록 */
function initOrderPage(screen) {
  if (!getAuth()) return;

  if (!initializedScreens.order) {
    initializedScreens.order = true;

    initLogout(screen);

    var scopeGroup = getOrderScopeGroupElement();
    if (scopeGroup) {
      scopeGroup.querySelectorAll(".order-scope-option").forEach(function (btn) {
        btn.addEventListener("click", function () {
          btn.classList.toggle("order-scope-option--active");
          updateOrderScopeSalesEnabled();
        });
      });
    }

    bindOrderScopeSalesInputs();

    initOrderRegionSelects();

    var orderForm = document.getElementById("orderForm");
    if (orderForm) {
      orderForm.addEventListener("input", updateOrderFieldFilledStates);
      orderForm.addEventListener("change", updateOrderFieldFilledStates);
    }

    var districtSelect = document.getElementById("orderDistrict");
    if (districtSelect) {
      districtSelect.addEventListener("change", updateOrderFieldFilledStates);
    }

    initOrderDatePicker();

    bindDrawingUpload("orderDrawing1", "orderDrawingFile1", "btnOrderUpload1");
    bindDrawingUpload("orderDrawing2", "orderDrawingFile2", "btnOrderUpload2");
    bindDrawingUpload("orderDrawing3", "orderDrawingFile3", "btnOrderUpload3");
    bindOrderDrawingDelete(1);
    bindOrderDrawingDelete(2);
    bindOrderDrawingDelete(3);

    initOrderNavDelegation();

    var btnRegister = document.getElementById("btnOrderRegister");
    if (btnRegister) {
      btnRegister.addEventListener("click", function () {
        registerOrder();
      });
    }

    if (orderForm) {
      orderForm.addEventListener("submit", function (e) {
        e.preventDefault();
      });
    }
  }

  updateOrderScopeSalesEnabled();
  updateOrderFieldFilledStates();
}

/* 로그인 */
function initLoginScreen() {
  if (initializedScreens.login) return;
  initializedScreens.login = true;

  var form = document.getElementById("loginForm");
  var btnSignup = document.getElementById("btnSignup");

  if (btnSignup) {
    btnSignup.addEventListener("click", function () {
      goToSignup();
    });
  }

  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var id = document.getElementById("userId").value.trim();
    var pw = document.getElementById("password").value;
    var result = authenticateLogin(id, pw);

    if (!result.ok) {
      alert(result.message);
      return;
    }

    setAuth(result.user);
    runCloudSync();
    startCloudPullInterval();
    showScreen(ROLES[result.user.role].home);
  });
}

/* 신규가입 */
var signupCurrentRole = "admin";

function signupDigitsOnly(str) {
  return (str || "").replace(/\D/g, "");
}

function formatPhone(value) {
  var d = signupDigitsOnly(value).slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 7) return d.slice(0, 3) + "-" + d.slice(3);
  return d.slice(0, 3) + "-" + d.slice(3, 7) + "-" + d.slice(7);
}

function formatBizNo(value) {
  var d = signupDigitsOnly(value).slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 5) return d.slice(0, 3) + "-" + d.slice(3);
  return d.slice(0, 3) + "-" + d.slice(3, 5) + "-" + d.slice(5);
}

function bindFormattedInput(inputId, formatter) {
  var el = document.getElementById(inputId);
  if (!el) return;

  el.addEventListener("input", function () {
    el.value = formatter(el.value);
  });

  el.addEventListener("keydown", function (e) {
    var allowed = ["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight", "Home", "End"];
    if (allowed.indexOf(e.key) >= 0) return;
    if (e.ctrlKey || e.metaKey) return;
    if (!/^\d$/.test(e.key)) e.preventDefault();
  });

  el.addEventListener("paste", function (e) {
    e.preventDefault();
    var text = (e.clipboardData || window.clipboardData).getData("text");
    el.value = formatter(text);
  });
}

function setSignupRole(role) {
  signupCurrentRole = role;
  var hidden = document.getElementById("signupRole");
  if (hidden) hidden.value = role;

  document.querySelectorAll(".signup-role-option").forEach(function (btn) {
    var isActive = btn.getAttribute("data-role") === role;
    btn.classList.toggle("signup-role-option--active", isActive);
    btn.setAttribute("aria-pressed", isActive ? "true" : "false");
  });

  document.querySelectorAll(".signup-extra").forEach(function (panel) {
    var panelRole = panel.getAttribute("data-role-panel");
    panel.classList.toggle("is-visible", panelRole === role);
  });

  if (role === "worker") refreshWorkerPartnerSelect();
}

function refreshWorkerPartnerSelect() {
  var select = document.getElementById("workerPartner");
  if (!select) return;

  var partners = getRegisteredPartners();
  var html = '<option value="">선택</option>';

  partners.forEach(function (p) {
    var name = p.partnerCompany || p.name || p.userId;
    html += '<option value="' + encodeURIComponent(p.userId) + '">' + escapeHtml(name) + "</option>";
  });

  if (partners.length === 0) {
    html += '<option value="" disabled>등록된 시공협력사가 없습니다</option>';
  }

  select.innerHTML = html;
}

function initSignupScreen() {
  if (initializedScreens.signup) return;
  initializedScreens.signup = true;

  bindFormattedInput("signupPhone", formatPhone);
  bindFormattedInput("bizNo", formatBizNo);

  document.querySelectorAll(".signup-role-option").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setSignupRole(btn.getAttribute("data-role"));
    });
  });
  setSignupRole("admin");

  document.querySelectorAll(".signup-scope-option").forEach(function (btn) {
    btn.addEventListener("click", function () {
      btn.classList.toggle("signup-scope-option--active");
    });
  });

  var idInput = document.getElementById("signupId");
  if (idInput) {
    idInput.addEventListener("blur", function () {
      var id = idInput.value.trim();
      if (!id) return;
      if (isSignupIdTakenForEdit(id)) {
        alert("이미 등록된 ID입니다. 다른 ID를 입력해 주세요.");
        idInput.focus();
      }
    });
  }

  var btnCancel = document.getElementById("btnCancel");
  if (btnCancel) {
    btnCancel.addEventListener("click", function () {
      leaveSignupScreen();
    });
  }

  var logo = document.querySelector(".signup-header__logo");
  if (logo) {
    logo.addEventListener("click", function (e) {
      e.preventDefault();
      if (signupEditMode) {
        leaveSignupScreen();
      } else {
        showScreen("login");
      }
    });
  }

  var form = document.getElementById("signupForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validateSignupForm()) return;

    if (signupEditMode) {
      updateRegisteredUser(buildSignupRecord());
      signupEditMode = false;
      canEnterSignup = false;
      alert("가입 정보가 수정되었습니다.");
      showScreen("order");
      return;
    }

    registerUser(buildSignupRecord());
    alert("가입 신청이 접수되었습니다. 관리자 승인 후 이용 가능합니다.");
    showScreen("login");
  });

  refreshWorkerPartnerSelect();
}

function getSignupScopeValues(groupSelector) {
  var groupEl = document.querySelector(groupSelector);
  return getScopeValues(groupEl);
}

function validateSignupForm() {
  var id = document.getElementById("signupId").value.trim();
  var pw = document.getElementById("signupPw").value;
  var name = document.getElementById("signupName").value.trim();
  var phoneRaw = signupDigitsOnly(document.getElementById("signupPhone").value);

  if (!id) {
    alert("ID를 입력해 주세요.");
    document.getElementById("signupId").focus();
    return false;
  }

  if (!pw) {
    alert("PW를 입력해 주세요.");
    document.getElementById("signupPw").focus();
    return false;
  }

  if (!name) {
    alert("이름을 입력해 주세요.");
    document.getElementById("signupName").focus();
    return false;
  }

  if (!phoneRaw) {
    alert("연락처를 입력해 주세요.");
    document.getElementById("signupPhone").focus();
    return false;
  }

  if (isSignupIdTakenForEdit(id)) {
    alert("이미 등록된 ID입니다. 저장할 수 없습니다.");
    document.getElementById("signupId").focus();
    return false;
  }

  if (phoneRaw.length !== 11) {
    alert("'-'를 제외하고 숫자만 입력하세요");
    document.getElementById("signupPhone").focus();
    return false;
  }

  if (signupCurrentRole === "partner") {
    var company = document.getElementById("partnerCompany").value.trim();
    var bizRaw = signupDigitsOnly(document.getElementById("bizNo").value);
    var address = document.getElementById("bizAddress").value.trim();
    var partnerScopes = getSignupScopeValues('[data-scope-group="partner"]');

    if (!company) {
      alert("시공협력사명을 입력해 주세요.");
      document.getElementById("partnerCompany").focus();
      return false;
    }

    if (!bizRaw) {
      alert("사업자등록번호를 입력해 주세요.");
      document.getElementById("bizNo").focus();
      return false;
    }

    if (bizRaw.length !== 10) {
      alert("'-'를 제외하고 숫자만 입력하세요");
      document.getElementById("bizNo").focus();
      return false;
    }

    if (!address) {
      alert("사업자주소를 입력해 주세요.");
      document.getElementById("bizAddress").focus();
      return false;
    }

    if (partnerScopes.length === 0) {
      alert("시공범위를 1개 이상 선택해 주세요.");
      return false;
    }
  }

  if (signupCurrentRole === "worker") {
    var partner = document.getElementById("workerPartner").value;
    var workerScopes = getSignupScopeValues('[data-scope-group="worker"]');

    if (getRegisteredPartners().length === 0) {
      alert("등록된 시공협력사가 없습니다. 시공협력사를 먼저 가입해 주세요.");
      return false;
    }

    if (!partner) {
      alert("시공협력사를 선택해 주세요.");
      document.getElementById("workerPartner").focus();
      return false;
    }

    if (workerScopes.length === 0) {
      alert("시공범위를 1개 이상 선택해 주세요.");
      return false;
    }
  }

  return true;
}

function buildSignupRecord() {
  var partnerScopeEl = document.querySelector('[data-scope-group="partner"]');
  var workerScopeEl = document.querySelector('[data-scope-group="worker"]');

  var record = {
    userId: document.getElementById("signupId").value.trim(),
    password: document.getElementById("signupPw").value,
    name: document.getElementById("signupName").value.trim(),
    phone: formatPhone(document.getElementById("signupPhone").value),
    role: signupCurrentRole,
    createdAt: new Date().toISOString(),
  };

  if (signupCurrentRole === "partner") {
    record.partnerCompany = document.getElementById("partnerCompany").value.trim();
    record.bizNo = formatBizNo(document.getElementById("bizNo").value);
    record.bizAddress = document.getElementById("bizAddress").value.trim();
    record.scope = getScopeValues(partnerScopeEl);
  }

  if (signupCurrentRole === "worker") {
    var partnerId = decodeURIComponent(document.getElementById("workerPartner").value);
    record.partnerUserId = partnerId;
    var partner = getRegisteredPartners().find(function (p) {
      return p.userId === partnerId;
    });
    record.partnerCompany = partner ? partner.partnerCompany || partner.name : "";
    record.scope = getScopeValues(workerScopeEl);
  }

  return record;
}

/* 전역 이벤트 */
document.addEventListener("click", function (e) {
  var target = getEventTargetElement(e);
  if (!target) return;
  var nav = target.closest("[data-nav]");
  if (nav) {
    e.preventDefault();
    var page = nav.getAttribute("data-nav");
    var id = nav.getAttribute("data-id");
    showScreen(page, id ? { id: decodeURIComponent(id) } : {});
  }
});

window.addEventListener("hashchange", function () {
  var parsed = parseHash();
  if (parsed.page === "signup" && !canEnterSignup) {
    location.replace("#login");
    return;
  }
  showScreen(parsed.page, parsed.params);
});

window.addEventListener("popstate", function () {
  var parsed = parseHash();
  if (parsed.page === "signup" && !canEnterSignup) {
    showScreen("login");
    return;
  }
  showScreen(parsed.page, parsed.params);
});

window.addEventListener("storage", function (e) {
  if (
    e.key !== ORDERS_STORAGE_KEY &&
    e.key !== UI_STATE_KEY &&
    e.key !== USERS_STORAGE_KEY
  ) {
    return;
  }
  if (e.key === UI_STATE_KEY) {
    loadUiState();
    applyUiStateToControls();
  }
  refreshDataFromStorage();
});

document.addEventListener("DOMContentLoaded", function () {
  initModals();
  bindEffexDataListeners();
  bindCrossTabDataSync();
  loadUiState();
  populateAllOrderYearSelects();
  applyUiStateToControls();

  if (getAuth()) {
    runCloudSync();
    startCloudPullInterval();
  }

  var parsed = parseHash();
  var page = parsed.page;

  if (getAuth() && (page === "login" || !page)) {
    page = ROLES[getAuth().role].home;
  }

  if (getAuth() && page === "signup" && !canEnterSignup) {
    page = ROLES[getAuth().role].home;
  }

  if (!page) page = "login";

  if (page === "signup") {
    page = "login";
    location.replace("#login");
  }

  showScreen(page, parsed.params);
});
