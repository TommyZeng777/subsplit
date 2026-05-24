const currencyOptions = ["CNY", "USD", "TRY", "INR", "IDR", "BRL", "MXN", "EGP", "JPY", "KRW", "TWD", "CAD", "EUR", "GBP"];
const currencyNames = {
  CNY: "人民币",
  USD: "美元",
  TRY: "土耳其里拉",
  INR: "印度卢比",
  IDR: "印尼盾",
  BRL: "巴西雷亚尔",
  MXN: "墨西哥比索",
  EGP: "埃及镑",
  EUR: "欧元",
  JPY: "日元",
  KRW: "韩元",
  TWD: "新台币",
  CAD: "加元",
  GBP: "英镑",
};

const standardReferences = (note = "官方美元月价参考") => [
  { id: "plus", name: "ChatGPT Plus", amount: 20, note },
  { id: "pro5x", name: "ChatGPT Pro 5x", amount: 100, note },
  { id: "pro20x", name: "ChatGPT Pro 20x", amount: 200, note },
  { id: "custom", name: "自定义套餐", amount: 0, note: "手动输入" },
];

const manualReferences = () => [
  { id: "plus", name: "ChatGPT Plus", amount: 0, note: "按当地支付页手动确认" },
  { id: "pro5x", name: "ChatGPT Pro 5x", amount: 0, note: "按当地支付页手动确认" },
  { id: "pro20x", name: "ChatGPT Pro 20x", amount: 0, note: "按当地支付页手动确认" },
  { id: "custom", name: "自定义套餐", amount: 0, note: "手动输入" },
];

const regionPresets = [
  {
    id: "us",
    name: "美区 US",
    currency: "USD",
    references: standardReferences(),
  },
  {
    id: "tr",
    name: "土耳其区 TR",
    currency: "TRY",
    references: [
      { id: "go", name: "ChatGPT Go", amount: 249.99, note: "App Store 土区参考价 / 月" },
      { id: "plus", name: "ChatGPT Plus", amount: 499.99, note: "App Store 土区参考价 / 月" },
      { id: "pro5x", name: "ChatGPT Pro 5x", amount: 5299.99, note: "App Store 土区参考价 / 月" },
      { id: "pro20x", name: "ChatGPT Pro 20x", amount: 7999.99, note: "App Store 土区参考价 / 月" },
      { id: "custom", name: "自定义套餐", amount: 0, note: "手动输入" },
    ],
  },
  { id: "in", name: "印度区 IN", currency: "INR", references: manualReferences() },
  { id: "id", name: "印尼区 ID", currency: "IDR", references: manualReferences() },
  { id: "br", name: "巴西区 BR", currency: "BRL", references: manualReferences() },
  { id: "mx", name: "墨西哥区 MX", currency: "MXN", references: manualReferences() },
  { id: "eg", name: "埃及区 EG", currency: "EGP", references: manualReferences() },
  { id: "jp", name: "日区 JP", currency: "JPY", references: manualReferences() },
  { id: "kr", name: "韩区 KR", currency: "KRW", references: manualReferences() },
  { id: "tw", name: "台区 TW", currency: "TWD", references: manualReferences() },
  { id: "ca", name: "加区 CA", currency: "CAD", references: manualReferences() },
  { id: "eu", name: "欧区 EU", currency: "EUR", references: manualReferences() },
  { id: "uk", name: "英区 UK", currency: "GBP", references: manualReferences() },
  {
    id: "custom",
    name: "其他地区",
    currency: "USD",
    references: [
      { id: "plus", name: "ChatGPT Plus", amount: 20, note: "参考美元价" },
      { id: "pro5x", name: "ChatGPT Pro 5x", amount: 100, note: "参考美元价" },
      { id: "pro20x", name: "ChatGPT Pro 20x", amount: 200, note: "参考美元价" },
      { id: "custom", name: "自定义套餐", amount: 0, note: "手动输入" },
    ],
  },
];

const STATE_VERSION = 3;
const STORAGE_KEY = "subsplit-state-v3";
const OLD_STORAGE_KEYS = ["carpool-cost-state", "subsplit-state-v2"];

function todayInputValue() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

const demoState = {
  appVersion: STATE_VERSION,
  rates: {
    CNY: 1,
    USD: 7.2,
    TRY: 0.23,
    INR: 0.086,
    IDR: 0.00044,
    BRL: 1.3,
    MXN: 0.39,
    EGP: 0.15,
    EUR: 7.8,
    JPY: 0.046,
    KRW: 0.0052,
    TWD: 0.22,
    CAD: 5.25,
    GBP: 9.1,
  },
  rateUpdated: "正在刷新最新汇率...",
  purchase: {
    regionId: "us",
    planId: "custom",
    amount: 0,
    currency: "USD",
    totalCostCny: "",
    rentalType: "monthly",
    startDate: todayInputValue(),
  },
  expenses: [{ id: crypto.randomUUID(), name: "订阅费用", amount: 0, currency: "CNY" }],
  pools: [
    { id: crypto.randomUUID(), name: "Codex", weight: 70 },
    { id: crypto.randomUUID(), name: "网页", weight: 30 },
  ],
  owner: {
    memberId: null,
    responsibilityPercent: 5,
    controlPercent: 3,
  },
  members: [
    { id: crypto.randomUUID(), userId: "成员A", name: "A：只用 Codex", uses: {} },
    { id: crypto.randomUUID(), userId: "成员B", name: "B：只用 Codex", uses: {} },
    { id: crypto.randomUUID(), userId: "成员C", name: "C：Codex + 网页", uses: {} },
    { id: crypto.randomUUID(), userId: "成员D", name: "D：只用网页", uses: {} },
  ],
};

demoState.members[0].uses[demoState.pools[0].id] = true;
demoState.members[1].uses[demoState.pools[0].id] = true;
demoState.members[2].uses[demoState.pools[0].id] = true;
demoState.members[2].uses[demoState.pools[1].id] = true;
demoState.members[3].uses[demoState.pools[1].id] = true;
demoState.owner.memberId = demoState.members[2].id;

OLD_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
const saved = localStorage.getItem(STORAGE_KEY);
let state = saved ? normalizeState(JSON.parse(saved)) : structuredClone(demoState);

function normalizeState(input) {
  const fallback = structuredClone(demoState);
  if (input.appVersion !== STATE_VERSION) {
    return fallback;
  }
  const next = { ...fallback, ...input };
  next.appVersion = STATE_VERSION;
  next.rates = { ...fallback.rates, ...(input.rates || {}) };
  next.rateUpdated = input.rateUpdated?.includes("手动") ? fallback.rateUpdated : input.rateUpdated || fallback.rateUpdated;
  const storedRegion = regionPresets.some((region) => region.id === input.purchase?.regionId) ? input.purchase.regionId : fallback.purchase.regionId;
  const storedTotalCost = input.purchase?.totalCostCny;
  next.purchase = {
    regionId: storedRegion,
    planId: input.purchase?.planId || fallback.purchase.planId,
    amount: Number(input.purchase?.amount ?? fallback.purchase.amount) || 0,
    currency: currencyOptions.includes(input.purchase?.currency) ? input.purchase.currency : fallback.purchase.currency,
    totalCostCny: storedTotalCost === "" || storedTotalCost === undefined || storedTotalCost === null ? "" : Number(storedTotalCost) || 0,
    rentalType: ["monthly", "yearly"].includes(input.purchase?.rentalType) ? input.purchase.rentalType : fallback.purchase.rentalType,
    startDate: input.purchase?.startDate || fallback.purchase.startDate,
  };
  next.expenses = (input.expenses || fallback.expenses).map((item) => ({
    id: item.id || crypto.randomUUID(),
    name: item.name || "未命名费用",
    amount: Number(item.amount) || 0,
    currency: currencyOptions.includes(item.currency) ? item.currency : "CNY",
  }));
  next.pools = (input.pools || fallback.pools).map((item) => ({
    id: item.id || crypto.randomUUID(),
    name: item.name || "权益池",
    weight: Number(item.weight) || 0,
  }));
  next.members = (input.members || fallback.members).map((item, index) => ({
    id: item.id || crypto.randomUUID(),
    userId: item.userId || `U${String(index + 1).padStart(3, "0")}`,
    name: item.name || "成员",
    uses: item.uses || {},
  }));
  next.owner = {
    memberId: input.owner?.memberId || next.members[0]?.id || null,
    responsibilityPercent: Number(input.owner?.responsibilityPercent ?? fallback.owner.responsibilityPercent) || 0,
    controlPercent: Number(input.owner?.controlPercent ?? fallback.owner.controlPercent) || 0,
  };
  return next;
}

const els = {
  rates: document.querySelector("#rates"),
  expenseRows: document.querySelector("#expenseRows"),
  poolRows: document.querySelector("#poolRows"),
  memberHead: document.querySelector("#memberHead"),
  memberRows: document.querySelector("#memberRows"),
  weightPill: document.querySelector("#weightPill"),
  rateUpdated: document.querySelector("#rateUpdated"),
  summaryTotal: document.querySelector("#summaryTotal"),
  summaryPools: document.querySelector("#summaryPools"),
  summaryMembers: document.querySelector("#summaryMembers"),
  summaryValid: document.querySelector("#summaryValid"),
  expenseBreakdown: document.querySelector("#expenseBreakdown"),
  poolBreakdown: document.querySelector("#poolBreakdown"),
  memberBreakdown: document.querySelector("#memberBreakdown"),
  auditTotal: document.querySelector("#auditTotal"),
  auditMembers: document.querySelector("#auditMembers"),
  auditDiff: document.querySelector("#auditDiff"),
  checkStatus: document.querySelector("#checkStatus"),
  guidanceStatus: document.querySelector("#guidanceStatus"),
  guidanceCards: document.querySelector("#guidanceCards"),
  agreementText: document.querySelector("#agreementText"),
  regionSelect: document.querySelector("#regionSelect"),
  planSelect: document.querySelector("#planSelect"),
  purchaseAmount: document.querySelector("#purchaseAmount"),
  purchaseCurrency: document.querySelector("#purchaseCurrency"),
  purchaseTotalCost: document.querySelector("#purchaseTotalCost"),
  rentalType: document.querySelector("#rentalType"),
  rentalStartDate: document.querySelector("#rentalStartDate"),
  rentalEndDate: document.querySelector("#rentalEndDate"),
  applyPurchase: document.querySelector("#applyPurchase"),
  setupConverted: document.querySelector("#setupConverted"),
  priceReferences: document.querySelector("#priceReferences"),
  ownerSelect: document.querySelector("#ownerSelect"),
  ownerResponsibility: document.querySelector("#ownerResponsibility"),
  ownerControl: document.querySelector("#ownerControl"),
  ownerNetLabel: document.querySelector("#ownerNetLabel"),
  ownerNetAmount: document.querySelector("#ownerNetAmount"),
};

document.querySelector("#addExpense").addEventListener("click", () => {
  state.expenses.push({ id: crypto.randomUUID(), name: "新费用", amount: 0, currency: "CNY" });
  renderAndSave();
});

document.querySelector("#addPool").addEventListener("click", () => {
  const id = crypto.randomUUID();
  state.pools.push({ id, name: `权益 ${state.pools.length + 1}`, weight: 0 });
  state.members.forEach((member) => {
    member.uses[id] = false;
  });
  renderAndSave();
});

document.querySelector("#addMember").addEventListener("click", () => {
  state.members.push({
    id: crypto.randomUUID(),
    userId: `U${String(state.members.length + 1).padStart(3, "0")}`,
    name: `成员 ${state.members.length + 1}`,
    uses: {},
  });
  renderAndSave();
});

document.querySelector("#resetDemo").addEventListener("click", () => {
  state = structuredClone(demoState);
  renderAndSave();
});

document.querySelector("#refreshRates").addEventListener("click", refreshRates);
document.querySelector("#exportCsv").addEventListener("click", exportCsv);
document.querySelector("#exportNotice").addEventListener("click", exportNotice);
document.querySelector("#copyNotice").addEventListener("click", copyNotice);
document.querySelector("#applyPurchase").addEventListener("click", applyPurchaseToExpenses);

function currencyLabel(code) {
  return `${code} ${currencyNames[code] || ""}`.trim();
}

function money(value) {
  return `¥ ${value.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function signedMoney(value) {
  const number = Number(value) || 0;
  const sign = number > 0 ? "+" : number < 0 ? "-" : "";
  return `${sign}${money(Math.abs(number))}`;
}

function signedPercent(value) {
  const number = Number(value) || 0;
  const sign = number > 0 ? "+" : number < 0 ? "-" : "";
  return `${sign}${Math.abs(number)}%`;
}

function memberBenefitLabel(member, index = state.members.findIndex((item) => item.id === member.id)) {
  const letter = String.fromCharCode(65 + Math.max(index, 0));
  const rights = state.pools.filter((pool) => member.uses?.[pool.id]).map((pool) => pool.name);
  if (!rights.length) return `${letter}：未选择权益`;
  if (rights.length === 1) return `${letter}：只用 ${rights[0]}`;
  return `${letter}：${rights.join(" + ")}`;
}

function memberLabel(member, index = state.members.findIndex((item) => item.id === member.id)) {
  return `${index + 1}号 ${member.userId || ""} ${memberBenefitLabel(member, index)}`.trim();
}

function byId(id) {
  return document.getElementById(id);
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function bindInputCommit(element, update) {
  if (element.dataset.commitBound === "true") return;
  element.dataset.commitBound = "true";
  let composing = false;

  element.addEventListener("compositionstart", () => {
    composing = true;
  });
  element.addEventListener("compositionend", (event) => {
    composing = false;
    update(event);
    saveState();
  });
  element.addEventListener("input", (event) => {
    if (composing) return;
    update(event);
    saveState();
  });
  element.addEventListener("change", (event) => {
    update(event);
    renderAndSave();
  });
}

function getRegion() {
  return regionPresets.find((region) => region.id === state.purchase.regionId) || regionPresets[0];
}

function getPlan() {
  const region = getRegion();
  return region.references.find((plan) => plan.id === state.purchase.planId) || region.references[0];
}

function getPurchaseConverted() {
  return (Number(state.purchase.amount) || 0) * (Number(state.rates[state.purchase.currency]) || 0);
}

function getPurchaseTotalCost() {
  return state.purchase.totalCostCny === "" ? null : Number(state.purchase.totalCostCny) || 0;
}

function parseDateInput(value) {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function formatDateZh(date) {
  if (!date) return "未设置";
  return date.toLocaleDateString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" });
}

function addMonthsClamped(date, months) {
  const next = new Date(date);
  const originalDay = next.getDate();
  next.setDate(1);
  next.setMonth(next.getMonth() + months);
  const lastDay = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
  next.setDate(Math.min(originalDay, lastDay));
  return next;
}

function getRentalEndDate() {
  const start = parseDateInput(state.purchase.startDate);
  if (!start) return null;
  return addMonthsClamped(start, state.purchase.rentalType === "yearly" ? 12 : 1);
}

function rentalTypeLabel() {
  return state.purchase.rentalType === "yearly" ? "年租拼" : "月租拼";
}

function updateSetupConverted() {
  const totalCost = getPurchaseTotalCost();
  els.setupConverted.textContent = totalCost === null ? money(getPurchaseConverted()) : `${money(totalCost)} 总成本`;
}

function getCalc() {
  const expenses = state.expenses.map((expense) => {
    const cny = (Number(expense.amount) || 0) * (Number(state.rates[expense.currency]) || 0);
    return { ...expense, cny };
  });
  const total = expenses.reduce((sum, expense) => sum + expense.cny, 0);
  const weightTotal = state.pools.reduce((sum, pool) => sum + (Number(pool.weight) || 0), 0);

  const poolResults = state.pools.map((pool) => {
    const users = state.members.filter((member) => member.uses[pool.id]);
    const poolTotal = total * ((Number(pool.weight) || 0) / 100);
    const perUser = users.length ? poolTotal / users.length : 0;
    return { ...pool, users, poolTotal, perUser };
  });

  const memberResults = state.members.map((member, index) => {
    const lines = poolResults
      .filter((pool) => member.uses[pool.id])
      .map((pool) => ({ poolName: pool.name, amount: pool.perUser }));
    const baseDue = lines.reduce((sum, line) => sum + line.amount, 0);
    return { ...member, name: memberBenefitLabel(member, index), lines, baseDue, ownerAdjustment: 0, totalDue: baseDue };
  });

  const owner = memberResults.find((member) => member.id === state.owner.memberId) || memberResults[0];
  const nonOwners = memberResults.filter((member) => member.id !== owner?.id);
  const netOwnerCredit = total * (((Number(state.owner.responsibilityPercent) || 0) - (Number(state.owner.controlPercent) || 0)) / 100);
  if (owner && nonOwners.length) {
    owner.ownerAdjustment = -netOwnerCredit;
    owner.totalDue = owner.baseDue - netOwnerCredit;
    const nonOwnerShare = netOwnerCredit / nonOwners.length;
    nonOwners.forEach((member) => {
      member.ownerAdjustment = nonOwnerShare;
      member.totalDue = member.baseDue + nonOwnerShare;
    });
  }

  const memberTotal = memberResults.reduce((sum, member) => sum + member.totalDue, 0);
  return { expenses, total, weightTotal, poolResults, memberResults, memberTotal, owner, netOwnerCredit };
}

function renderPurchase() {
  const region = getRegion();
  const plan = getPlan();

  els.regionSelect.innerHTML = regionPresets
    .map((item) => `<option value="${item.id}" ${item.id === state.purchase.regionId ? "selected" : ""}>${item.name}</option>`)
    .join("");
  els.planSelect.innerHTML = region.references
    .map((item) => `<option value="${item.id}" ${item.id === state.purchase.planId ? "selected" : ""}>${item.name} · ${item.amount ? formatCurrency(item.amount, region.currency) : item.note}</option>`)
    .join("");
  els.purchaseAmount.value = state.purchase.amount;
  els.purchaseTotalCost.value = state.purchase.totalCostCny;
  els.rentalType.value = state.purchase.rentalType;
  els.rentalStartDate.value = state.purchase.startDate || todayInputValue();
  els.rentalEndDate.value = formatDateZh(getRentalEndDate());
  els.purchaseCurrency.innerHTML = currencyOptions
    .map((code) => `<option value="${code}" ${code === state.purchase.currency ? "selected" : ""}>${currencyLabel(code)}</option>`)
    .join("");
  updateSetupConverted();
  els.priceReferences.innerHTML = region.references
    .filter((item) => item.id !== "custom")
    .map(
      (item) => `
        <div class="reference-chip">
          <span>${escapeHtml(item.name)}<br />${escapeHtml(item.note)}</span>
          <strong>${item.amount ? formatCurrency(item.amount, region.currency) : "手动确认"}</strong>
        </div>
      `,
    )
    .join("");

  if (els.regionSelect.dataset.changeBound !== "true") {
    els.regionSelect.dataset.changeBound = "true";
    els.regionSelect.addEventListener("change", (event) => {
      const nextRegion = regionPresets.find((item) => item.id === event.target.value) || regionPresets[0];
      const nextPlan = nextRegion.references.find((item) => item.id === state.purchase.planId) || nextRegion.references[0];
      state.purchase.regionId = nextRegion.id;
      state.purchase.currency = nextRegion.currency;
      state.purchase.planId = nextPlan.id;
      state.purchase.amount = nextPlan.amount || 0;
      renderAndSave();
    });
  }
  if (els.planSelect.dataset.changeBound !== "true") {
    els.planSelect.dataset.changeBound = "true";
    els.planSelect.addEventListener("change", (event) => {
      const currentRegion = getRegion();
      const nextPlan = currentRegion.references.find((item) => item.id === event.target.value) || currentRegion.references[0];
      state.purchase.planId = nextPlan.id;
      state.purchase.amount = nextPlan.amount || state.purchase.amount || 0;
      renderAndSave();
    });
  }
  bindInputCommit(els.purchaseAmount, (event) => {
    state.purchase.amount = Number(event.target.value) || 0;
    updateSetupConverted();
  });
  bindInputCommit(els.purchaseTotalCost, (event) => {
    state.purchase.totalCostCny = event.target.value === "" ? "" : Number(event.target.value) || 0;
    updateSetupConverted();
  });
  if (els.rentalType.dataset.changeBound !== "true") {
    els.rentalType.dataset.changeBound = "true";
    els.rentalType.addEventListener("change", (event) => {
      state.purchase.rentalType = event.target.value;
      renderAndSave();
    });
  }
  if (els.rentalStartDate.dataset.changeBound !== "true") {
    els.rentalStartDate.dataset.changeBound = "true";
    els.rentalStartDate.addEventListener("change", (event) => {
      state.purchase.startDate = event.target.value || todayInputValue();
      renderAndSave();
    });
  }
  if (els.purchaseCurrency.dataset.changeBound !== "true") {
    els.purchaseCurrency.dataset.changeBound = "true";
    els.purchaseCurrency.addEventListener("change", (event) => {
      state.purchase.currency = event.target.value;
      renderAndSave();
    });
  }
}

function formatCurrency(value, currency) {
  const symbol = {
    CNY: "¥",
    USD: "$",
    TRY: "₺",
    INR: "₹",
    IDR: "Rp",
    BRL: "R$",
    MXN: "MX$",
    EGP: "E£",
    JPY: "¥",
    KRW: "₩",
    TWD: "NT$",
    CAD: "CA$",
    EUR: "€",
    GBP: "£",
  }[currency] || currency;
  return `${symbol} ${Number(value).toLocaleString("zh-CN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

function applyPurchaseToExpenses() {
  const region = getRegion();
  const plan = getPlan();
  const totalCost = getPurchaseTotalCost();
  const useTotalCost = totalCost !== null;
  const name = `${region.name} ${plan.name} ${rentalTypeLabel()}${useTotalCost ? "（号主总成本）" : ""}`;
  const expense = state.expenses[0] || { id: crypto.randomUUID() };
  expense.name = name;
  expense.amount = useTotalCost ? totalCost : Number(state.purchase.amount) || 0;
  expense.currency = useTotalCost ? "CNY" : state.purchase.currency;
  if (!state.expenses.length) {
    state.expenses.push(expense);
  } else {
    state.expenses[0] = expense;
  }
  renderAndSave();
}

function renderRates() {
  els.rates.innerHTML = currencyOptions
    .filter((code) => code !== "CNY")
    .map(
      (code) => `
        <div class="rate-card">
          <span>1 ${code} 折合人民币</span>
          <div class="rate-value">
            <strong>${Number(state.rates[code] ?? 0).toLocaleString("zh-CN", { maximumFractionDigits: 6 })}</strong>
            <em>CNY</em>
          </div>
        </div>
      `,
    )
    .join("");
  els.rateUpdated.textContent = state.rateUpdated;
}

function renderExpenses(calc) {
  els.expenseRows.innerHTML = state.expenses
    .map((expense, index) => {
      const converted = calc.expenses[index]?.cny || 0;
      return `
        <tr>
          <td><input id="expense-name-${expense.id}" type="text" value="${escapeHtml(expense.name)}" /></td>
          <td><input id="expense-amount-${expense.id}" type="number" min="0" step="0.01" value="${expense.amount}" /></td>
          <td>
            <select id="expense-currency-${expense.id}">
              ${currencyOptions.map((code) => `<option value="${code}" ${expense.currency === code ? "selected" : ""}>${currencyLabel(code)}</option>`).join("")}
            </select>
          </td>
          <td class="amount">${money(converted)}</td>
          <td class="amount">
            <button class="delete-button" id="expense-delete-${expense.id}" type="button" title="删除费用">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3" /></svg>
            </button>
          </td>
        </tr>
      `;
    })
    .join("");

  state.expenses.forEach((expense) => {
    bindInputCommit(byId(`expense-name-${expense.id}`), (event) => {
      expense.name = event.target.value;
    });
    bindInputCommit(byId(`expense-amount-${expense.id}`), (event) => {
      expense.amount = Number(event.target.value) || 0;
    });
    byId(`expense-currency-${expense.id}`).addEventListener("change", (event) => {
      expense.currency = event.target.value;
      renderAndSave();
    });
    byId(`expense-delete-${expense.id}`).addEventListener("click", () => {
      state.expenses = state.expenses.filter((item) => item.id !== expense.id);
      renderAndSave();
    });
  });
}

function renderPools(calc) {
  els.poolRows.innerHTML = state.pools
    .map(
      (pool) => `
        <div class="pool-card">
          <input id="pool-name-${pool.id}" type="text" value="${escapeHtml(pool.name)}" />
          <input id="pool-weight-${pool.id}" type="number" min="0" max="100" step="1" value="${pool.weight}" />
          <button class="delete-button" id="pool-delete-${pool.id}" type="button" title="删除权益池">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3" /></svg>
          </button>
          <input id="pool-range-${pool.id}" type="range" min="0" max="100" step="1" value="${pool.weight}" />
        </div>
      `,
    )
    .join("");

  state.pools.forEach((pool) => {
    bindInputCommit(byId(`pool-name-${pool.id}`), (event) => {
      pool.name = event.target.value;
    });
    const updateWeight = (event) => {
      pool.weight = Number(event.target.value) || 0;
    };
    bindInputCommit(byId(`pool-weight-${pool.id}`), updateWeight);
    bindInputCommit(byId(`pool-range-${pool.id}`), updateWeight);
    byId(`pool-delete-${pool.id}`).addEventListener("click", () => {
      state.pools = state.pools.filter((item) => item.id !== pool.id);
      state.members.forEach((member) => {
        delete member.uses[pool.id];
      });
      renderAndSave();
    });
  });

  els.weightPill.textContent = `${calc.weightTotal}%`;
  els.weightPill.className = `weight-pill ${Math.abs(calc.weightTotal - 100) < 0.01 ? "ok" : "warn"}`;
}

function renderOwner(calc) {
  els.ownerSelect.innerHTML = state.members
    .map((member, index) => `<option value="${member.id}" ${state.owner.memberId === member.id ? "selected" : ""}>${escapeHtml(memberLabel(member, index))}</option>`)
    .join("");
  els.ownerResponsibility.value = state.owner.responsibilityPercent;
  els.ownerControl.value = state.owner.controlPercent;

  const ownerNetPercent = (Number(state.owner.controlPercent) || 0) - (Number(state.owner.responsibilityPercent) || 0);
  els.ownerNetLabel.textContent = `号主净调节 ${signedPercent(ownerNetPercent)}`;
  els.ownerNetAmount.textContent = signedMoney(calc.owner?.ownerAdjustment || 0);

  if (els.ownerSelect.dataset.changeBound !== "true") {
    els.ownerSelect.dataset.changeBound = "true";
    els.ownerSelect.addEventListener("change", (event) => {
      state.owner.memberId = event.target.value;
      renderAndSave();
    });
  }
  bindInputCommit(els.ownerResponsibility, (event) => {
    state.owner.responsibilityPercent = Number(event.target.value) || 0;
  });
  bindInputCommit(els.ownerControl, (event) => {
    state.owner.controlPercent = Number(event.target.value) || 0;
  });
}

function renderMembers(calc) {
  els.memberHead.innerHTML = `
    <tr>
      <th>编号</th>
      <th>用户 ID</th>
      <th>权益</th>
      ${state.pools.map((pool) => `<th class="check-cell">${escapeHtml(pool.name)}</th>`).join("")}
      <th class="amount">应付金额</th>
      <th></th>
    </tr>
  `;

  els.memberRows.innerHTML = calc.memberResults
    .map((member, index) => {
      const letter = String.fromCharCode(65 + index);
      const poolCells = state.pools
        .map(
          (pool) => `
            <td class="check-cell">
              <input id="member-${member.id}-pool-${pool.id}" type="checkbox" ${member.uses[pool.id] ? "checked" : ""} aria-label="${escapeHtml(member.name)} 使用 ${escapeHtml(pool.name)}" />
            </td>
          `,
        )
        .join("");
      return `
        <tr>
          <td>
            <div class="member-name">
              <span class="avatar">${letter}</span>
            </div>
          </td>
          <td><input id="member-user-${member.id}" type="text" value="${escapeHtml(member.userId || "")}" /></td>
          <td><input class="readonly-field" id="member-name-${member.id}" type="text" value="${escapeHtml(member.name)}" readonly /></td>
          ${poolCells}
          <td class="payable">
            ${money(member.totalDue)}
            <span class="pool-share">${member.lines.map((line) => `${escapeHtml(line.poolName)} ${money(line.amount)}`).join(" / ") || "未使用权益"}${member.ownerAdjustment ? ` / 号主调节 ${signedMoney(member.ownerAdjustment)}` : ""}</span>
          </td>
          <td class="amount">
            <button class="delete-button" id="member-delete-${member.id}" type="button" title="删除成员">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3" /></svg>
            </button>
          </td>
        </tr>
      `;
    })
    .join("");

  state.members.forEach((member) => {
    bindInputCommit(byId(`member-user-${member.id}`), (event) => {
      member.userId = event.target.value;
    });
    state.pools.forEach((pool) => {
      byId(`member-${member.id}-pool-${pool.id}`).addEventListener("change", (event) => {
        member.uses[pool.id] = event.target.checked;
        renderAndSave();
      });
    });
    byId(`member-delete-${member.id}`).addEventListener("click", () => {
      state.members = state.members.filter((item) => item.id !== member.id);
      if (state.owner.memberId === member.id) {
        state.owner.memberId = state.members[0]?.id || null;
      }
      renderAndSave();
    });
  });
}

function renderBreakdown(calc) {
  els.expenseBreakdown.innerHTML =
    calc.expenses
      .map(
        (expense) => `
          <div class="formula-line">
            <span>${escapeHtml(expense.name)}：${Number(expense.amount).toFixed(2)} ${expense.currency} x ${Number(state.rates[expense.currency]).toFixed(4)}</span>
            <strong>${money(expense.cny)}</strong>
          </div>
        `,
      )
      .join("") || `<div class="formula-line"><span>暂无费用</span><strong>${money(0)}</strong></div>`;

  els.poolBreakdown.innerHTML =
    calc.poolResults
      .map(
        (pool) => `
          <div class="formula-line">
            <span>${escapeHtml(pool.name)}：${money(calc.total)} x ${pool.weight}% / ${pool.users.length || 0} 人</span>
            <strong>${pool.users.length ? money(pool.perUser) : "无人使用"}</strong>
          </div>
        `,
      )
      .join("") || `<div class="formula-line"><span>暂无权益池</span><strong>${money(0)}</strong></div>`;

  els.memberBreakdown.innerHTML =
    calc.memberResults
      .map(
        (member) => `
          <div class="formula-line">
            <span>${escapeHtml(member.name)}：${member.lines.map((line) => `${escapeHtml(line.poolName)} ${money(line.amount)}`).join(" + ") || "无"}${member.ownerAdjustment ? `；号主责任调节 ${signedMoney(member.ownerAdjustment)}` : ""}</span>
            <strong>${money(member.totalDue)}</strong>
          </div>
        `,
      )
      .join("") || `<div class="formula-line"><span>暂无成员</span><strong>${money(0)}</strong></div>`;

  const diff = calc.total - calc.memberTotal;
  els.auditTotal.textContent = money(calc.total);
  els.auditMembers.textContent = money(calc.memberTotal);
  els.auditDiff.textContent = money(diff);
  els.auditDiff.className = Math.abs(diff) < 0.01 ? "ok" : "bad";

  const missingUsers = calc.poolResults.filter((pool) => pool.weight > 0 && pool.users.length === 0);
  if (Math.abs(calc.weightTotal - 100) >= 0.01) {
    els.checkStatus.textContent = "权重未等于 100%";
    els.checkStatus.className = "warn";
  } else if (missingUsers.length) {
    els.checkStatus.textContent = "有权益池无人使用";
    els.checkStatus.className = "warn";
  } else if (Math.abs(diff) < 0.01) {
    els.checkStatus.textContent = "校验通过";
    els.checkStatus.className = "ok";
  } else {
    els.checkStatus.textContent = "结果需检查";
    els.checkStatus.className = "bad";
  }
}

function renderGuidance(calc) {
  const codexPool = calc.poolResults.find((pool) => pool.name.toLowerCase().includes("codex"));
  const webPool = calc.poolResults.find((pool) => /网页|web|page|pro/i.test(pool.name));
  const codexCount = codexPool?.users.length || 0;
  const webCount = webPool?.users.length || 0;
  const totalCount = state.members.length;
  const cards = [
    {
      label: "Codex 权益池",
      value: `${codexCount}/3`,
      state: codexCount <= 3 ? "ok" : "bad",
      text: codexCount <= 3 ? "人数在建议范围内" : "建议减少 Codex 使用者",
    },
    {
      label: "网页端权益池",
      value: `${webCount}/3`,
      state: webCount <= 3 ? "ok" : "bad",
      text: webCount <= 3 ? "人数在建议范围内" : "建议减少网页端使用者",
    },
    {
      label: "总拼车人数",
      value: `${totalCount}/4`,
      state: totalCount === 4 ? "ok" : totalCount <= 5 ? "warn" : "bad",
      text: totalCount === 4 ? "当前为理想人数" : "理想拼车用户为 4 人",
    },
    {
      label: "号主",
      value: calc.owner ? `${state.members.findIndex((member) => member.id === calc.owner.id) + 1}号` : "未设置",
      state: calc.owner ? "ok" : "bad",
      text: calc.owner ? `${calc.owner.userId || ""} ${calc.owner.name}`.trim() : "请选择号主",
    },
  ];

  els.guidanceCards.innerHTML = cards
    .map(
      (card) => `
        <div class="guidance-card ${card.state}">
          <span>${escapeHtml(card.label)}</span>
          <strong>${escapeHtml(card.value)}</strong>
          <p>${escapeHtml(card.text)}</p>
        </div>
      `,
    )
    .join("");

  const hasBad = cards.some((card) => card.state === "bad");
  const hasWarn = cards.some((card) => card.state === "warn");
  els.guidanceStatus.textContent = hasBad ? "需调整" : hasWarn ? "可优化" : "建议通过";
  els.guidanceStatus.className = hasBad ? "bad" : hasWarn ? "warn" : "ok";
}

function renderSummary(calc) {
  els.summaryTotal.textContent = money(calc.total);
  els.summaryPools.textContent = `${state.pools.length} 个`;
  els.summaryMembers.textContent = `${state.members.length} 人`;
  els.summaryValid.textContent = Math.abs(calc.weightTotal - 100) < 0.01 ? "通过" : `${calc.weightTotal}%`;
  els.summaryValid.className = Math.abs(calc.weightTotal - 100) < 0.01 ? "ok" : "warn";
}

function covenantId(calc, createdAt = new Date()) {
  const seed = [
    createdAt.toISOString().slice(0, 10),
    calc.total.toFixed(2),
    calc.memberResults.map((member) => `${member.id}:${member.totalDue.toFixed(2)}`).join("|"),
  ].join("#");
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }
  return `CARPOOL-${createdAt.toISOString().slice(0, 10).replaceAll("-", "")}-${hash.toString(16).toUpperCase().padStart(8, "0").slice(0, 8)}`;
}

function displayUserId(member) {
  return member.userId || "未填ID";
}

function publicMemberLabel(member, index) {
  return `${index + 1}号 / ${displayUserId(member)} / ${member.name}`;
}

function renderMarkdown(markdown) {
  const lines = markdown.split("\n");
  const html = [];
  let inList = false;
  const closeList = () => {
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
  };
  const inline = (value) =>
    escapeHtml(value).replaceAll(/`([^`]+)`/g, "<code>$1</code>").replaceAll(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

  lines.forEach((line) => {
    if (line.startsWith("## ")) {
      closeList();
      html.push(`<h2>${inline(line.slice(3))}</h2>`);
    } else if (line.startsWith("# ")) {
      closeList();
      html.push(`<h1>${inline(line.slice(2))}</h1>`);
    } else if (line.startsWith("- ")) {
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      html.push(`<li>${inline(line.slice(2))}</li>`);
    } else if (!line.trim()) {
      closeList();
    } else {
      closeList();
      html.push(`<p>${inline(line)}</p>`);
    }
  });
  closeList();
  return html.join("");
}

function buildNotice(calc, options = {}) {
  const createdAt = options.createdAt || new Date();
  const date = createdAt.toLocaleString("zh-CN");
  const id = covenantId(calc, createdAt);
  const ownerIndex = calc.owner ? state.members.findIndex((member) => member.id === calc.owner.id) : -1;
  const rentalEnd = getRentalEndDate();
  const expenseLines = calc.expenses.map((expense) => `- ${expense.name}: ${Number(expense.amount).toFixed(2)} ${expense.currency} x 汇率 ${Number(state.rates[expense.currency]).toFixed(4)} = ${money(expense.cny)}`);
  const poolLines = calc.poolResults.map((pool) => `- ${pool.name}: 权重 ${pool.weight}%, 使用人数 ${pool.users.length}, 单池人均 ${pool.users.length ? money(pool.perUser) : "无人使用"}`);
  const memberLines = calc.memberResults.map((member, index) => {
    const rights = member.lines.map((line) => `${line.poolName} ${money(line.amount)}`).join(" + ") || "未使用权益";
    return `- ${publicMemberLabel(member, index)}: ${rights}; 号主调节 ${signedMoney(member.ownerAdjustment || 0)}; 应付 ${money(member.totalDue)}`;
  });

  return [
    "# 拼车公约与费用公示",
    `- 公约编号: \`${id}\``,
    `- 生成时间: ${date}`,
    "- 说明: 本公示按页面当前填写内容生成，成员 ID、号主、权益和金额均按实际记录展示。",
    "",
    "## 一、拼车参考",
    "- 推荐 Codex 权益池用户不超过 3 个。",
    "- 推荐网页端权益池用户不超过 3 个。",
    "- 理想拼车用户总数为 4 个。",
    "",
    "## 二、租期规则",
    `- 租期类型: ${rentalTypeLabel()}。`,
    `- 开通日期: ${formatDateZh(parseDateInput(state.purchase.startDate))}。`,
    `- ${state.purchase.rentalType === "yearly" ? "到期日期" : "下次续费日期"}: ${formatDateZh(rentalEnd)}。`,
    "- 月租拼按自然月口径记录，通常为开通日对应的下个月日期续费；遇到短月则按当月最后一天记录。",
    "- 年租拼按开通日对应的下一年度日期记录；若平台实际续费日不同，以支付页和账单为准。",
    "",
    "## 三、基础费用",
    ...expenseLines,
    `- 折合人民币总额: ${money(calc.total)}`,
    "",
    "## 四、权益池规则",
    ...poolLines,
    "",
    "## 五、号主规则",
    `- 号主: ${calc.owner ? publicMemberLabel(calc.owner, ownerIndex) : "未设置"}`,
    `- 责任补偿: ${signedPercent(-(Number(state.owner.responsibilityPercent) || 0))}，表示降低号主应付。`,
    `- 控制权收益: ${signedPercent(Number(state.owner.controlPercent) || 0)}，表示提高号主应付。`,
    `- 号主净调节: ${signedPercent((Number(state.owner.controlPercent) || 0) - (Number(state.owner.responsibilityPercent) || 0))} / ${signedMoney(calc.owner?.ownerAdjustment || 0)}。负数表示号主少付，正数表示号主多付。`,
    "",
    "## 六、成员应付",
    ...memberLines,
    "",
    "## 七、校验",
    `- 成员合计: ${money(calc.memberTotal)}`,
    `- 差额: ${money(calc.total - calc.memberTotal)}`,
    `- 权重合计: ${calc.weightTotal}%`,
    "",
    "## 八、公示说明",
    "- 所有费用按页面记录的汇率和权益权重计算。",
    "- 成员可核对金额、权益勾选、号主责任调节和最终应付。",
    "- 若续费价格、汇率、成员或权益使用范围变化，应重新生成并公示。",
  ].join("\n");
}

function renderAgreement(calc) {
  els.agreementText.innerHTML = renderMarkdown(buildNotice(calc));
}

function render() {
  const calc = getCalc();
  renderPurchase();
  renderRates();
  renderExpenses(calc);
  renderPools(calc);
  renderOwner(calc);
  renderMembers(calc);
  renderGuidance(calc);
  renderBreakdown(calc);
  renderAgreement(calc);
  renderSummary(calc);
}

function renderAndSave() {
  saveState();
  render();
}

async function refreshRates(options = {}) {
  const button = document.querySelector("#refreshRates");
  button.disabled = true;
  button.textContent = "刷新中";
  state.rateUpdated = "正在刷新最新汇率...";
  if (!options.silent) {
    renderRates();
  }
  try {
    const symbols = currencyOptions.filter((code) => code !== "CNY").join(",");
    const response = await fetch(`https://api.frankfurter.dev/v2/rates?base=CNY&quotes=${symbols}`, { cache: "no-store" });
    if (!response.ok) throw new Error("rate request failed");
    const data = await response.json();
    state.rates.CNY = 1;
    const updated = new Set(["CNY"]);
    const rows = Array.isArray(data) ? data : [];
    rows.forEach((item) => {
      if (item.quote && item.rate) {
        state.rates[item.quote] = Number((1 / item.rate).toFixed(6));
        updated.add(item.quote);
      }
    });
    const missing = currencyOptions.filter((code) => !updated.has(code));
    if (missing.length) {
      const fallbackResponse = await fetch("https://open.er-api.com/v6/latest/CNY", { cache: "no-store" });
      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        missing.forEach((code) => {
          if (fallbackData.rates?.[code]) {
            state.rates[code] = Number((1 / fallbackData.rates[code]).toFixed(6));
            updated.add(code);
          }
        });
      }
    }
    const missingAfterFallback = currencyOptions.filter((code) => !updated.has(code) && code !== "CNY");
    const suffix = missingAfterFallback.length ? `，${missingAfterFallback.join("/")} 暂未更新` : "";
    const latestDate = rows.reduce((latest, item) => (item.date > latest ? item.date : latest), "");
    state.rateUpdated = `最新参考汇率：${latestDate || new Date().toLocaleDateString("zh-CN")}（Frankfurter 官方机构源${suffix}）`;
  } catch (error) {
    state.rateUpdated = "汇率刷新失败，请稍后重试";
  } finally {
    button.disabled = false;
    button.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8.1 8.1 0 0 0-14.1-4.9L4 8m0-4v4h4m-4 5a8.1 8.1 0 0 0 14.1 4.9L20 16m0 4v-4h-4" /></svg>刷新汇率`;
    renderAndSave();
  }
}

function exportCsv() {
  const calc = getCalc();
  const header = ["编号", "用户ID", "权益", ...state.pools.map((pool) => `${pool.name}权益`), "应付人民币"];
  const rows = calc.memberResults.map((member, index) => [
    `${index + 1}号`,
    displayUserId(member),
    member.name,
    ...state.pools.map((pool) => (member.uses[pool.id] ? "是" : "否")),
    member.totalDue.toFixed(2),
  ]);
  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([`\ufeff${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "拼车分摊结果.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function exportNotice() {
  exportCovenantPdf();
}

async function copyNotice() {
  const text = buildNotice(getCalc());
  try {
    await navigator.clipboard.writeText(text);
    document.querySelector("#copyNotice").textContent = "已复制";
    setTimeout(() => {
      document.querySelector("#copyNotice").textContent = "复制公约";
    }, 1200);
  } catch (error) {
    exportNotice();
  }
}

function buildCovenantHtml(calc) {
  const createdAt = new Date();
  const id = covenantId(calc, createdAt);
  const text = buildNotice(calc, { createdAt });
  const rendered = renderMarkdown(text);
  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <title>${id} 拼车公约</title>
    <style>
      @page { margin: 18mm; }
      body {
        margin: 0;
        color: #17212b;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
        line-height: 1.65;
      }
      .page {
        position: relative;
        min-height: 100vh;
      }
      .watermark {
        position: fixed;
        inset: 0;
        z-index: 0;
        pointer-events: none;
        opacity: 0.08;
        background-image: repeating-linear-gradient(-32deg, transparent 0 110px, rgba(5, 137, 128, 0.55) 110px 112px, transparent 112px 220px);
      }
      .watermark::after {
        content: "${id}  拼车公约  ${createdAt.toLocaleString("zh-CN")}";
        position: absolute;
        top: 42%;
        left: 50%;
        width: 900px;
        transform: translate(-50%, -50%) rotate(-28deg);
        color: #058980;
        font-size: 38px;
        font-weight: 800;
        text-align: center;
        letter-spacing: 2px;
      }
      main {
        position: relative;
        z-index: 1;
      }
      header {
        display: flex;
        justify-content: space-between;
        gap: 24px;
        border-bottom: 2px solid #058980;
        padding-bottom: 14px;
        margin-bottom: 18px;
      }
      h1 {
        margin: 0 0 8px;
        font-size: 26px;
      }
      .meta {
        color: #667386;
        font-size: 12px;
        text-align: right;
        white-space: nowrap;
      }
      h1, h2 { margin: 0; color: #17212b; }
      h1 { font-size: 24px; padding-bottom: 12px; border-bottom: 1px solid #dce3ea; }
      h2 { margin-top: 18px; font-size: 17px; }
      p { margin: 8px 0; }
      ul { margin: 8px 0 0; padding-left: 22px; }
      li { margin: 4px 0; }
      code { border-radius: 6px; background: #eef5f5; padding: 2px 6px; color: #04736d; }
      .notice {
        margin-top: 18px;
        border: 1px solid #dce3ea;
        border-radius: 8px;
        padding: 12px;
        color: #667386;
        font-size: 12px;
      }
      @media print {
        .no-print { display: none; }
      }
    </style>
  </head>
  <body>
    <div class="watermark" aria-hidden="true"></div>
    <main class="page">
      <header>
        <div>
          <h1>拼车公约与费用公示</h1>
          <p>用于成员核对费用、权益、号主责任调节与最终应付。</p>
        </div>
        <div class="meta">
          <div>编号：${id}</div>
          <div>生成：${createdAt.toLocaleString("zh-CN")}</div>
          <div>状态：带水印 / 可核对</div>
        </div>
      </header>
      <section>${rendered}</section>
      <div class="notice">提示：浏览器打印窗口中选择“存储为 PDF”即可导出 PDF。PDF 内容按页面当前填写记录生成，并带公约编号、生成时间和水印，便于成员核对版本。</div>
    </main>
    <script>window.addEventListener("load", () => setTimeout(() => window.print(), 150));</script>
  </body>
</html>`;
}

function exportCovenantPdf() {
  const html = buildCovenantHtml(getCalc());
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    downloadText("拼车公约.html", html);
    return;
  }
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

function downloadText(filename, text) {
  const type = filename.endsWith(".html") ? "text/html;charset=utf-8" : "text/plain;charset=utf-8";
  const blob = new Blob([`\ufeff${text}`], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

renderAndSave();
refreshRates({ silent: true });
