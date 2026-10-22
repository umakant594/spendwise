import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  Download,
  FileText,
  UserPlus,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Grid2X2,
  LogOut,
  Menu,
  Plus,
  Receipt,
  Search,
  Settings,
  Target,
  Trash2,
  Wallet,
  X,
} from "lucide-react";
import SettingsPage from "./SettingsPage";

const API = "/api";

const categories = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Health",
  "Education",
  "Travel",
  "Other",
];

function money(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return "-";

  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* =========================================================
   LOGIN
========================================================= */

function Login({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      if (mode === "register") {
        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters.");
        }

        if (password !== confirmPassword) {
          throw new Error("Passwords do not match.");
        }

        const response = await fetch(`${API}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to create account");
        }

        setSuccess("Account created successfully. You can now sign in.");
        setMode("login");
        setPassword("");
        setConfirmPassword("");
        return;
      }

      const response = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("spendwise_token", data.token);

      if (data.user) {
        localStorage.setItem("spendwise_user", JSON.stringify(data.user));
      }

      onLogin();
    } catch (error) {
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const registering = mode === "register";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f7fb] p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-black tracking-tight">
            Spend<span className="text-violet-600">Wise</span>
          </h1>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            Personal Finance
          </p>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-xl">
          <div className="mb-7">
            <div className="mb-4 flex rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
                className={`flex-1 rounded-lg py-2.5 text-xs font-bold ${
                  !registering ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                }`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => { setMode("register"); setError(""); setSuccess(""); }}
                className={`flex-1 rounded-lg py-2.5 text-xs font-bold ${
                  registering ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                }`}
              >
                Create account
              </button>
            </div>

            <h2 className="text-2xl font-black">
              {registering ? "Create your account" : "Welcome back"}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {registering
                ? "Create a personal SpendWise workspace."
                : "Sign in to manage your finances."}
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-5 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              <CheckCircle2 size={17} />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {registering && (
              <Field label="Full name">
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="input"
                />
              </Field>
            )}

            <Field label="Email">
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="you@example.com"
              />
            </Field>

            <Field label="Password">
              <input
                required
                minLength={6}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="Minimum 6 characters"
              />
            </Field>

            {registering && (
              <Field label="Confirm password">
                <input
                  required
                  minLength={6}
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input"
                  placeholder="Repeat password"
                />
              </Field>
            )}

            <button
              disabled={loading}
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 disabled:opacity-60"
            >
              {registering && <UserPlus size={17} />}
              {loading
                ? registering ? "Creating account..." : "Signing in..."
                : registering ? "Create account" : "Sign in"}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SIDEBAR
========================================================= */

function Sidebar({
  page,
  setPage,
  mobile,
  setMobile,
  logout,
}) {
  const items = [
    {
      name: "Overview",
      icon: Grid2X2,
    },
    {
      name: "Transactions",
      icon: Receipt,
    },
    {
      name: "Accounts",
      icon: CreditCard,
    },
    {
      name: "Budgets",
      icon: Target,
    },
  ];

  return (
    <>
      {mobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
          onClick={() => setMobile(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-[260px] border-r border-slate-200 bg-white transition-transform duration-200 ${
          mobile
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-full flex-col">

          <div className="px-9 pt-7">
            <h1 className="text-3xl font-black tracking-tight">
              Spend<span className="text-violet-600">Wise</span>
            </h1>

            <p className="mt-1 text-[10px] font-bold tracking-[0.2em] text-slate-400">
              PERSONAL FINANCE MANAGEMENT
            </p>
          </div>

          <div className="mt-12 px-7">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Workspace
            </p>

            <div className="space-y-2">
              {items.map((item) => {
                const Icon = item.icon;
                const active = page === item.name;

                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      setPage(item.name);
                      setMobile(false);
                    }}
                    className={`flex w-full items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-semibold transition ${
                      active
                        ? "bg-violet-600 text-white shadow-lg shadow-violet-200"
                        : "text-slate-500 hover:bg-violet-50 hover:text-violet-600"
                    }`}
                  >
                    <Icon size={20} />
                    {item.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-auto px-7 pb-7">

            <div className="mb-8 rounded-[22px] bg-slate-950 p-5 text-white">
              <div className="flex items-center gap-2">
                <span className="text-violet-400">
                  ↗
                </span>

                <span className="text-xs font-bold">
                  Financial health
                </span>
              </div>

              <p className="mt-4 text-2xl font-black">
                Good
              </p>

              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full w-[78%] rounded-full bg-violet-500" />
              </div>

              <p className="mt-3 text-[10px] text-slate-500">
                Keep your spending within budget.
              </p>
            </div>

            <button
              onClick={() => {
                setPage("Settings");
                setMobile(false);
              }}
              className={`mb-2 flex w-full items-center gap-4 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                page === "Settings"
                  ? "bg-violet-50 text-violet-600"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <Settings size={20} />
              Settings
            </button>

            <button
              onClick={logout}
              className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 hover:bg-rose-50 hover:text-rose-600"
            >
              <LogOut size={20} />
              Logout
            </button>

          </div>
        </div>
      </aside>
    </>
  );
}

/* =========================================================
   HEADER
========================================================= */

function Header({ setMobile, logout, setPage, data }) {
  const [open, setOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("spendwise_user") || "{}");
  const budgets = data?.budgets || [];
  const accounts = data?.accounts || [];
  const transactions = data?.recentTransactions || [];

  const notifications = [
    ...budgets
      .filter((b) => b.isOverBudget || Number(b.percentage || 0) >= 80)
      .map((b) => ({
        id: `budget-${b.id}`,
        title: b.isOverBudget ? `${b.category} budget exceeded` : `${b.category} budget is near its limit`,
        text: `${money(b.spent)} spent of ${money(b.amount)}.`,
        tone: b.isOverBudget ? "rose" : "amber",
      })),
    ...(accounts.length === 0
      ? [{ id: "no-account", title: "No account added", text: "Add your first bank or wallet account.", tone: "violet" }]
      : []),
    ...(transactions.length
      ? [{ id: "activity", title: "Recent activity", text: `${transactions.length} recent transactions are available.`, tone: "emerald" }]
      : []),
  ];

  function handleLogout() {
    setOpen(false);
    setNotificationsOpen(false);
    logout();
  }

  return (
    <header className="sticky top-0 z-30 h-[78px] border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-full items-center justify-between px-3 sm:px-8">
        <button
          onClick={() => setMobile(true)}
          className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
        >
          <Menu size={22} />
        </button>

        <div className="ml-auto flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => { setNotificationsOpen(!notificationsOpen); setOpen(false); }}
              className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100"
              aria-label="Notifications"
            >
              <Bell size={21} />
              {notifications.length > 0 && (
                <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-violet-500 ring-2 ring-white" />
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 top-14 z-50 w-[min(330px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                  <div>
                    <p className="text-sm font-black">Notifications</p>
                    <p className="text-[10px] text-slate-400">Live account activity</p>
                  </div>
                  <span className="rounded-full bg-violet-50 px-2 py-1 text-[10px] font-bold text-violet-600">
                    {notifications.length}
                  </span>
                </div>

                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-sm text-slate-400">You're all caught up.</div>
                ) : (
                  <div className="max-h-[330px] divide-y divide-slate-100 overflow-y-auto">
                    {notifications.slice(0, 8).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setNotificationsOpen(false);
                          if (item.id.startsWith("budget-")) setPage("Budgets");
                          if (item.id === "no-account") setPage("Accounts");
                          if (item.id === "activity") setPage("Transactions");
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-slate-50"
                      >
                        <p className="text-xs font-black text-slate-800">{item.title}</p>
                        <p className="mt-1 text-[11px] leading-4 text-slate-400">{item.text}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => { setOpen(!open); setNotificationsOpen(false); }}
              className="flex items-center gap-3 rounded-xl p-1.5 hover:bg-slate-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-sm font-black text-violet-600">
                {(user.name || "U").charAt(0).toUpperCase()}
              </div>

              <div className="hidden text-left sm:block">
                <p className="text-sm font-black">{user.name || "Umakant"}</p>
                <p className="text-[10px] text-slate-400">Personal account</p>
              </div>

              <ChevronDown size={16} className="hidden text-slate-400 sm:block" />
            </button>

            {open && (
              <div className="absolute right-0 top-14 z-50 w-52 max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                <button
                  onClick={() => { setOpen(false); setPage("Settings"); }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-violet-50 hover:text-violet-600"
                >
                  <Settings size={17} />
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-rose-50 hover:text-rose-600"
                >
                  <LogOut size={17} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

/* =========================================================
   OVERVIEW
========================================================= */

function Overview({ data, setPage }) {
  const summary = data?.summary || {};
  const accounts = data?.accounts || [];
  const transactions = data?.recentTransactions || [];
  const categories = data?.categoryBreakdown || [];

  const netWorth =
    summary.netWorth ??
    summary.balance ??
    accounts.reduce(
      (sum, account) =>
        sum + Number(account.balance || 0),
      0
    );

  const income =
    summary.income ??
    summary.totalIncome ??
    transactions
      .filter((t) => t.type === "Income")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const expenses =
    summary.expenses ??
    summary.totalExpenses ??
    transactions
      .filter((t) => t.type === "Expense")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const savings = income - expenses;

  const maxCategory =
    Math.max(
      ...categories.map((item) =>
        Number(item.amount || 0)
      ),
      1
    );

  const totalCategory = categories.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  return (
    <div className="space-y-7">

      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">
          Overview
        </p>

        <h1 className="mt-2 text-3xl font-black">
          Good morning 👋
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Here's what's happening with your money.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => downloadFinancialReport(data)}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-700 shadow-sm hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
        >
          <Download size={17} />
          Download financial report
        </button>
        <button
          onClick={() => setPage("Transactions")}
          className="flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-xs font-bold text-white hover:bg-slate-800"
        >
          <Receipt size={17} />
          View transactions
        </button>
      </div>

      {/* NET WORTH */}
      <div className="rounded-[28px] bg-gradient-to-br from-violet-600 to-indigo-700 p-7 text-white shadow-xl">
        <p className="text-xs font-bold uppercase tracking-wider text-white/60">
          Net worth
        </p>

        <p className="mt-3 text-4xl font-black">
          {money(netWorth)}
        </p>

        <div className="mt-5 flex flex-wrap gap-5 text-xs">
          <div>
            <span className="text-white/50">
              Income
            </span>

            <p className="mt-1 font-black">
              {money(income)}
            </p>
          </div>

          <div>
            <span className="text-white/50">
              Expenses
            </span>

            <p className="mt-1 font-black">
              {money(expenses)}
            </p>
          </div>

          <div>
            <span className="text-white/50">
              Savings
            </span>

            <p className="mt-1 font-black">
              {money(savings)}
            </p>
          </div>
        </div>
      </div>

      {/* KPI */}
      <section className="grid gap-4 md:grid-cols-3">

        <KpiCard
          label="Total income"
          value={money(income)}
          icon={ArrowDownRight}
          iconClass="bg-emerald-50 text-emerald-600"
        />

        <KpiCard
          label="Total expenses"
          value={money(expenses)}
          icon={ArrowUpRight}
          iconClass="bg-rose-50 text-rose-600"
        />

        <KpiCard
          label="Savings"
          value={money(savings)}
          icon={Wallet}
          iconClass="bg-violet-50 text-violet-600"
        />

      </section>

      {/* RECENT + BREAKDOWN */}
      <section className="grid gap-5 xl:grid-cols-2">

        <div className="rounded-[24px] border border-slate-200 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-slate-100 p-6">

            <div>
              <h2 className="font-black">
                Recent transactions
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Your latest activity
              </p>
            </div>

            <button
              onClick={() => setPage("Transactions")}
              className="text-xs font-bold text-violet-600"
            >
              View all
            </button>

          </div>

          <div className="divide-y divide-slate-100">

            {transactions.length === 0 ? (
              <div className="p-10 text-center text-sm text-slate-400">
                No transactions yet.
              </div>
            ) : (
              transactions.slice(0, 6).map((transaction) => {
                const isIncome =
                  transaction.type === "Income";

                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between gap-4 px-6 py-4"
                  >

                    <div className="flex min-w-0 items-center gap-3">

                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          isIncome
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {isIncome ? (
                          <ArrowDownRight size={18} />
                        ) : (
                          <Receipt size={18} />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold">
                          {transaction.description}
                        </p>

                        <p className="mt-0.5 truncate text-xs text-slate-400">
                          {transaction.category} ·{" "}
                          {transaction.account?.name ||
                            "Account"}
                        </p>
                      </div>

                    </div>

                    <div className="shrink-0 text-right">

                      <p
                        className={`text-sm font-black ${
                          isIncome
                            ? "text-emerald-600"
                            : "text-slate-900"
                        }`}
                      >
                        {isIncome ? "+" : "-"}
                        {money(transaction.amount)}
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-400">
                        {formatDate(transaction.date)}
                      </p>

                    </div>

                  </div>
                );
              })
            )}

          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 p-6">
            <h2 className="font-black">
              Spending breakdown
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Where your money goes
            </p>
          </div>

          <div className="space-y-5 p-6">

            {categories.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-400">
                No spending data yet.
              </div>
            ) : (
              categories.slice(0, 6).map((item) => (
                <div key={item.category}>

                  <div className="mb-2 flex justify-between">

                    <span className="text-xs font-bold text-slate-700">
                      {item.category}
                    </span>

                    <span className="text-xs font-bold text-slate-400">
                      {money(item.amount)}
                    </span>

                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-violet-500"
                      style={{
                        width: `${
                          (Number(item.amount || 0) /
                            maxCategory) *
                          100
                        }%`,
                      }}
                    />
                  </div>

                </div>
              ))
            )}

            <div className="rounded-xl bg-slate-50 p-4">

              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Total spending
              </p>

              <p className="mt-1 text-xl font-black">
                {money(totalCategory)}
              </p>

            </div>

          </div>
        </div>

      </section>

      {/* ACCOUNTS */}
      <section>

        <div className="mb-4 flex items-end justify-between">

          <div>
            <h2 className="text-lg font-black">
              Your accounts
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Current balances across your accounts
            </p>
          </div>

          <button
            onClick={() => setPage("Accounts")}
            className="text-xs font-bold text-violet-600"
          >
            Manage
          </button>

        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

          {accounts.map((account, index) => (
            <div
              key={account.id}
              className={`relative overflow-hidden rounded-[22px] p-6 ${
                index === 0
                  ? "bg-gradient-to-br from-violet-600 to-indigo-700 text-white"
                  : index === 1
                  ? "border border-slate-200 bg-white"
                  : "bg-slate-900 text-white"
              }`}
            >

              <div className="flex items-start justify-between">

                <span className="rounded-xl bg-white/10 p-2.5">
                  <CreditCard size={19} />
                </span>

                <span className="rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-bold uppercase text-white/70">
                  {account.type}
                </span>

              </div>

              <p
                className={`mt-8 text-xs ${
                  index === 1
                    ? "text-slate-400"
                    : "text-white/60"
                }`}
              >
                {account.name}
              </p>

              <p className="mt-1 text-2xl font-black">
                {money(account.balance)}
              </p>

            </div>
          ))}

        </div>

      </section>

    </div>
  );
}

/* =========================================================
   KPI CARD
========================================================= */

function KpiCard({
  label,
  value,
  icon: Icon,
  iconClass,
}) {
  return (
    <div className="rounded-[22px] border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {label}
          </p>

          <p className="mt-3 text-2xl font-black">
            {value}
          </p>
        </div>

        <div
          className={`rounded-xl p-3 ${iconClass}`}
        >
          <Icon size={20} />
        </div>

      </div>

    </div>
  );
}

/* =========================================================
   TRANSACTIONS
========================================================= */

function TransactionsPage({
  token,
  accounts,
  onChanged,
}) {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const [form, setForm] = useState({
    accountId: accounts[0]?.id || "",
    type: "Expense",
    amount: "",
    category: "Food",
    description: "",
    date: new Date().toISOString().slice(0, 10),
  });

  async function loadTransactions() {
    try {
      setLoading(true);

      const response = await fetch(
        `${API}/transactions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load transactions"
        );
      }

      setTransactions(await response.json());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    if (!form.accountId && accounts.length) {
      setForm((current) => ({
        ...current,
        accountId: accounts[0].id,
      }));
    }
  }, [accounts]);

  const filtered = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesFilter =
        filter === "All" ||
        transaction.type === filter;

      const text = `
        ${transaction.description}
        ${transaction.category}
        ${transaction.account?.name || ""}
      `.toLowerCase();

      return (
        matchesFilter &&
        text.includes(search.toLowerCase())
      );
    });
  }, [transactions, search, filter]);

  async function addTransaction(event) {
    event.preventDefault();

    try {
      const response = await fetch(
        `${API}/transactions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...form,
            accountId: Number(form.accountId),
            amount: Number(form.amount),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to add transaction"
        );
      }

      setShowAdd(false);

      setForm({
        accountId: accounts[0]?.id || "",
        type: "Expense",
        amount: "",
        category: "Food",
        description: "",
        date: new Date()
          .toISOString()
          .slice(0, 10),
      });

      await loadTransactions();
      onChanged();
    } catch (error) {
      alert(error.message);
    }
  }

  async function deleteTransaction(id) {
    if (
      !window.confirm(
        "Delete this transaction?"
      )
    ) {
      return;
    }

    try {
      setDeleting(id);

      const response = await fetch(
        `${API}/transactions/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();

        throw new Error(
          data.message ||
            "Failed to delete transaction"
        );
      }

      await loadTransactions();
      onChanged();
    } catch (error) {
      alert(error.message);
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="space-y-6">

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">
            Activity
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Transactions
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Track every income and expense in one place.
          </p>
        </div>

        <button
          onClick={() => {
            if (!accounts.length) {
              alert("Add an account first before creating a transaction.");
              return;
            }
            setShowAdd(true);
          }}
          className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-200 hover:bg-violet-700"
        >
          <Plus size={18} />
          Add transaction
        </button>

      </div>

      <div className="rounded-[24px] border border-slate-200 bg-white shadow-sm">

        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 lg:flex-row">

          <div className="relative flex-1">

            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search transactions..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-50"
            />

          </div>

          <div className="flex rounded-xl bg-slate-100 p-1">

            {[
              "All",
              "Income",
              "Expense",
            ].map((item) => (
              <button
                key={item}
                onClick={() =>
                  setFilter(item)
                }
                className={`rounded-lg px-4 py-2 text-xs font-bold ${
                  filter === item
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500"
                }`}
              >
                {item}
              </button>
            ))}

          </div>

        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-violet-600" />
            <p className="mt-4 text-sm font-semibold text-slate-400">
              Loading transactions...
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">

            <Receipt
              className="mx-auto text-slate-300"
              size={34}
            />

            <p className="mt-3 text-sm font-bold text-slate-600">
              {search || filter !== "All"
                ? "No matching transactions"
                : "No transactions yet"}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {search || filter !== "All"
                ? "Try changing your search or filter."
                : "Add your first income or expense to start tracking."}
            </p>

            {!search && filter === "All" && accounts.length > 0 && (
              <button
                onClick={() => setShowAdd(true)}
                className="mt-4 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-violet-700"
              >
                Add transaction
              </button>
            )}

          </div>
        ) : (
          <div className="divide-y divide-slate-100">

            {filtered.map((transaction) => {
              const income =
                transaction.type === "Income";

              return (
                <div
                  key={transaction.id}
                  className="flex items-center gap-4 px-5 py-4 transition hover:bg-slate-50 sm:px-6"
                >

                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      income
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-rose-50 text-rose-600"
                    }`}
                  >
                    {income ? (
                      <ArrowDownRight size={19} />
                    ) : (
                      <ArrowUpRight size={19} />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="truncate text-sm font-bold">
                      {transaction.description}
                    </p>

                    <p className="mt-1 truncate text-xs text-slate-400">
                      {transaction.category} ·{" "}
                      {transaction.account?.name ||
                        "Account"}{" "}
                      · {formatDate(transaction.date)}
                    </p>

                  </div>

                  <div className="text-right">

                    <p
                      className={`text-sm font-black ${
                        income
                          ? "text-emerald-600"
                          : "text-slate-900"
                      }`}
                    >
                      {income ? "+" : "-"}
                      {money(transaction.amount)}
                    </p>

                    <button
                      onClick={() =>
                        deleteTransaction(
                          transaction.id
                        )
                      }
                      disabled={
                        deleting ===
                        transaction.id
                      }
                      className="mt-1 text-[10px] font-bold text-slate-300 hover:text-rose-600"
                    >
                      {deleting === transaction.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>

      {showAdd && (
        <Modal
          title="Add transaction"
          onClose={() =>
            setShowAdd(false)
          }
        >

          <form
            onSubmit={addTransaction}
            className="space-y-4"
          >

            <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">

              {[
                "Expense",
                "Income",
              ].map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() =>
                    setForm((current) => ({
                      ...current,
                      type,
                    }))
                  }
                  className={`rounded-lg py-2.5 text-xs font-bold ${
                    form.type === type
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500"
                  }`}
                >
                  {type}
                </button>
              ))}

            </div>

            <Field label="Description">
              <input
                required
                value={form.description}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    description:
                      e.target.value,
                  }))
                }
                placeholder="e.g. Grocery shopping"
                className="input"
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">

              <Field label="Amount">
                <input
                  required
                  min="1"
                  type="number"
                  value={form.amount}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      amount:
                        e.target.value,
                    }))
                  }
                  placeholder="₹ 0"
                  className="input"
                />
              </Field>

              <Field label="Date">
                <input
                  required
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      date: e.target.value,
                    }))
                  }
                  className="input"
                />
              </Field>

            </div>

            <Field label="Category">

              <select
                value={form.category}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    category:
                      e.target.value,
                  }))
                }
                className="input"
              >

                {categories.map(
                  (category) => (
                    <option
                      key={category}
                    >
                      {category}
                    </option>
                  )
                )}

              </select>

            </Field>

            <Field label="Account">

              <select
                required
                value={form.accountId}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    accountId:
                      e.target.value,
                  }))
                }
                className="input"
              >

                <option value="">
                  Select account
                </option>

                {accounts.map(
                  (account) => (
                    <option
                      key={account.id}
                      value={account.id}
                    >
                      {account.name}
                    </option>
                  )
                )}

              </select>

            </Field>

            <button
              type="submit"
              className="w-full rounded-xl bg-violet-600 py-3 text-sm font-bold text-white hover:bg-violet-700"
            >
              Save transaction
            </button>

          </form>

        </Modal>
      )}

    </div>
  );
}

/* =========================================================
   ACCOUNTS
========================================================= */

function AccountsPage({ token, accounts, onChanged }) {
  const [showAdd, setShowAdd] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const [form, setForm] = useState({
    name: "",
    type: "Savings",
    balance: "",
  });

  const total = accounts.reduce(
    (sum, account) => sum + Number(account.balance || 0),
    0
  );

  /* =========================
     CREATE ACCOUNT
  ========================= */

  async function addAccount(event) {
    event.preventDefault();

    try {
      const response = await fetch(`${API}/accounts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          balance: Number(form.balance || 0),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create account"
        );
      }

      setShowAdd(false);

      setForm({
        name: "",
        type: "Savings",
        balance: "",
      });

      await onChanged();
    } catch (error) {
      alert(error.message);
    }
  }

  /* =========================
     DELETE ACCOUNT
  ========================= */

  async function deleteAccount(account) {
    const confirmed = window.confirm(
      `Delete "${account.name}"?\n\nThis will permanently remove this account and its transactions.`
    );

    if (!confirmed) return;

    try {
      setDeleting(account.id);

      const response = await fetch(
        `${API}/accounts/${account.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete account"
        );
      }

      await onChanged();
    } catch (error) {
      alert(error.message);
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">
            Money
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Accounts
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage your bank accounts, cards and wallets.
          </p>
        </div>

        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-200 hover:bg-violet-700"
        >
          <Plus size={18} />
          Add account
        </button>

      </div>

      {/* TOTAL BALANCE */}

      <div className="rounded-[24px] bg-slate-950 p-7 text-white shadow-xl">

        <p className="text-xs font-semibold text-slate-500">
          Total balance
        </p>

        <p className="mt-2 text-4xl font-black">
          {money(total)}
        </p>

        <p className="mt-2 text-xs text-slate-500">
          Across {accounts.length} account
          {accounts.length === 1 ? "" : "s"}
        </p>

      </div>

      {/* ACCOUNTS */}

      {accounts.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-slate-300 bg-white p-12 text-center">

          <Wallet
            size={42}
            className="mx-auto text-slate-300"
          />

          <h3 className="mt-4 text-lg font-black">
            No accounts yet
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Add your first bank account, wallet or card.
          </p>

          <button
            onClick={() => setShowAdd(true)}
            className="mt-5 rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white hover:bg-violet-700"
          >
            Add your first account
          </button>

        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

          {accounts.map((account, index) => (

            <div
              key={account.id}
              className={`relative rounded-[24px] p-6 ${
                index % 3 === 0
                  ? "bg-gradient-to-br from-violet-600 to-indigo-700 text-white"
                  : index % 3 === 1
                  ? "border border-slate-200 bg-white"
                  : "bg-slate-900 text-white"
              }`}
            >

              {/* TOP */}

              <div className="flex items-start justify-between">

                <span className="rounded-xl bg-white/10 p-3">
                  <CreditCard size={20} />
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-[9px] font-bold uppercase ${
                    index % 3 === 1
                      ? "bg-slate-100 text-slate-500"
                      : "bg-white/10 text-white/70"
                  }`}
                >
                  {account.type}
                </span>

              </div>

              {/* ACCOUNT INFO */}

              <p
                className={`mt-10 text-xs ${
                  index % 3 === 1
                    ? "text-slate-400"
                    : "text-white/60"
                }`}
              >
                {account.name}
              </p>

              <p className="mt-1 text-3xl font-black">
                {money(account.balance)}
              </p>

              {/* DELETE */}

              <div className="mt-6 border-t border-white/10 pt-4">

                <button
                  onClick={() => deleteAccount(account)}
                  disabled={deleting === account.id}
                  className={`flex items-center gap-2 text-xs font-bold transition ${
                    index % 3 === 1
                      ? "text-slate-400 hover:text-rose-600"
                      : "text-white/50 hover:text-rose-300"
                  }`}
                >

                  {deleting === account.id ? (
                    <>
                      <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={14} />
                      Delete account
                    </>
                  )}

                </button>

              </div>

            </div>

          ))}

          {/* ADD ACCOUNT CARD */}

          <button
            onClick={() => setShowAdd(true)}
            className="min-h-[230px] rounded-[24px] border-2 border-dashed border-slate-200 bg-white text-sm font-bold text-slate-400 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600"
          >

            <Plus
              size={26}
              className="mx-auto mb-2"
            />

            Add another account

          </button>

        </div>
      )}

      {/* ADD ACCOUNT MODAL */}

      {showAdd && (
        <Modal
          title="Add account"
          onClose={() => setShowAdd(false)}
        >

          <form
            onSubmit={addAccount}
            className="space-y-4"
          >

            <Field label="Account name">

              <input
                required
                value={form.name}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    name: e.target.value,
                  }))
                }
                placeholder="e.g. HDFC Savings"
                className="input"
              />

            </Field>

            <Field label="Account type">

              <select
                value={form.type}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    type: e.target.value,
                  }))
                }
                className="input"
              >

                <option>Savings</option>
                <option>Current</option>
                <option>Cash</option>
                <option>Credit Card</option>
                <option>Wallet</option>

              </select>

            </Field>

            <Field label="Opening balance">

              <input
                type="number"
                min="0"
                value={form.balance}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    balance: e.target.value,
                  }))
                }
                placeholder="₹ 0"
                className="input"
              />

            </Field>

            <button
              type="submit"
              className="w-full rounded-xl bg-violet-600 py-3 text-sm font-bold text-white hover:bg-violet-700"
            >
              Create account
            </button>

          </form>

        </Modal>
      )}

    </div>
  );
}

/* =========================================================
   BUDGETS - STEP 3
========================================================= */

function BudgetsPage({ token }) {
  const [budgets, setBudgets] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [showAdd, setShowAdd] =
    useState(false);

  const now = new Date();

  const [form, setForm] = useState({
    category: "Food",
    amount: "",
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  });

  const budgetCategories = [
    "Food",
    "Transport",
    "Shopping",
    "Bills",
    "Entertainment",
    "Health",
    "Education",
    "Travel",
    "Other",
  ];

  async function loadBudgets() {
    try {
      setLoading(true);

      const response = await fetch(
        `${API}/budgets`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load budgets"
        );
      }

      setBudgets(
        await response.json()
      );
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBudgets();
  }, []);

  async function addBudget(event) {
    event.preventDefault();

    try {
      const response = await fetch(
        `${API}/budgets`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            category:
              form.category,
            amount: Number(
              form.amount
            ),
            month: Number(
              form.month
            ),
            year: Number(
              form.year
            ),
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to create budget"
        );
      }

      setShowAdd(false);

      setForm({
        category: "Food",
        amount: "",
        month:
          now.getMonth() + 1,
        year:
          now.getFullYear(),
      });

      await loadBudgets();
    } catch (error) {
      alert(error.message);
    }
  }

  async function deleteBudget(id) {
    if (
      !window.confirm(
        "Delete this budget?"
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${API}/budgets/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete budget"
        );
      }

      await loadBudgets();
    } catch (error) {
      alert(error.message);
    }
  }

  const totalBudget =
    budgets.reduce(
      (sum, budget) =>
        sum +
        Number(
          budget.amount || 0
        ),
      0
    );

  const totalSpent =
    budgets.reduce(
      (sum, budget) =>
        sum +
        Number(
          budget.spent || 0
        ),
      0
    );

  const totalRemaining =
    totalBudget - totalSpent;

  const usedPercentage =
    totalBudget > 0
      ? Math.round(
          (totalSpent /
            totalBudget) *
            100
        )
      : 0;

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

        <div>

          <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">
            Planning
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Budgets
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Set spending limits and keep your finances under control.
          </p>

        </div>

        <button
          onClick={() =>
            setShowAdd(true)
          }
          className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-200 hover:bg-violet-700"
        >
          <Plus size={18} />
          Add budget
        </button>

      </div>

      {/* SUMMARY */}

      <div className="grid gap-4 md:grid-cols-4">

        <div className="rounded-[22px] border border-slate-200 bg-white p-6 shadow-sm">

          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Total budget
          </p>

          <p className="mt-2 text-2xl font-black">
            {money(totalBudget)}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Across all categories
          </p>

        </div>

        <div className="rounded-[22px] border border-slate-200 bg-white p-6 shadow-sm">

          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Total spent
          </p>

          <p className="mt-2 text-2xl font-black text-rose-600">
            {money(totalSpent)}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Actual expenses
          </p>

        </div>

        <div className="rounded-[22px] bg-slate-950 p-6 text-white shadow-xl">

          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Remaining
          </p>

          <p
            className={`mt-2 text-2xl font-black ${
              totalRemaining < 0
                ? "text-rose-400"
                : "text-emerald-400"
            }`}
          >
            {money(totalRemaining)}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Available budget
          </p>

        </div>

        <div className="rounded-[22px] border border-slate-200 bg-white p-6 shadow-sm">

          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Budget used
          </p>

          <p className="mt-2 text-2xl font-black">
            {usedPercentage}%
          </p>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">

            <div
              className={`h-full rounded-full ${
                usedPercentage > 100
                  ? "bg-rose-500"
                  : "bg-violet-500"
              }`}
              style={{
                width: `${Math.min(
                  usedPercentage,
                  100
                )}%`,
              }}
            />

          </div>

        </div>

      </div>

      {/* BUDGET LIST */}

      <div className="rounded-[24px] border border-slate-200 bg-white shadow-sm">

        <div className="flex items-center justify-between border-b border-slate-100 p-6">

          <div>

            <h2 className="font-black">
              Category budgets
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Track spending against your monthly limits.
            </p>

          </div>

        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-violet-600" />
            <p className="mt-4 text-sm font-semibold text-slate-400">
              Loading budgets...
            </p>
          </div>
        ) : budgets.length === 0 ? (
          <div className="p-12 text-center">

            <Target
              className="mx-auto text-slate-300"
              size={40}
            />

            <p className="mt-4 text-sm font-bold text-slate-600">
              No budgets yet
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Create your first category budget.
            </p>

            <button
              onClick={() =>
                setShowAdd(true)
              }
              className="mt-5 rounded-xl bg-violet-600 px-5 py-3 text-xs font-bold text-white"
            >
              Create budget
            </button>

          </div>
        ) : (
          <div className="divide-y divide-slate-100">

            {budgets.map((budget) => {

              const percentage =
                Number(
                  budget.percentage || 0
                );

              const displayPercentage =
                Math.min(
                  percentage,
                  100
                );

              const overBudget =
                budget.isOverBudget;

              return (
                <div
                  key={budget.id}
                  className="p-6"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div>

                      <div className="flex items-center gap-3">

                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                            overBudget
                              ? "bg-rose-50 text-rose-600"
                              : "bg-violet-50 text-violet-600"
                          }`}
                        >
                          <Target size={19} />
                        </div>

                        <div>

                          <h3 className="text-sm font-black">
                            {budget.category}
                          </h3>

                          <p className="text-xs text-slate-400">
                            {budget.month}/
                            {budget.year}
                          </p>

                        </div>

                      </div>

                    </div>

                    <div className="text-right">

                      <p
                        className={`text-sm font-black ${
                          overBudget
                            ? "text-rose-600"
                            : "text-slate-900"
                        }`}
                      >
                        {money(
                          budget.spent
                        )}
                      </p>

                      <p className="text-xs text-slate-400">
                        of{" "}
                        {money(
                          budget.amount
                        )}
                      </p>

                    </div>

                  </div>

                  {/* PROGRESS */}

                  <div className="mt-5">

                    <div className="h-3 overflow-hidden rounded-full bg-slate-100">

                      <div
                        className={`h-full rounded-full transition-all ${
                          overBudget
                            ? "bg-rose-500"
                            : percentage >= 80
                            ? "bg-amber-500"
                            : "bg-violet-500"
                        }`}
                        style={{
                          width: `${displayPercentage}%`,
                        }}
                      />

                    </div>

                    <div className="mt-2 flex items-center justify-between">

                      <span
                        className={`text-xs font-bold ${
                          overBudget
                            ? "text-rose-600"
                            : percentage >= 80
                            ? "text-amber-600"
                            : "text-slate-400"
                        }`}
                      >
                        {percentage}% used
                      </span>

                      <span
                        className={`text-xs font-bold ${
                          overBudget
                            ? "text-rose-600"
                            : "text-emerald-600"
                        }`}
                      >
                        {overBudget
                          ? `Over by ${money(
                              Math.abs(
                                budget.remaining
                              )
                            )}`
                          : `${money(
                              budget.remaining
                            )} remaining`}
                      </span>

                    </div>

                  </div>

                  {/* WARNING */}

                  {overBudget && (
                    <div className="mt-4 flex items-center justify-between rounded-xl bg-rose-50 px-4 py-3">

                      <div className="flex items-center gap-2 text-xs font-bold text-rose-600">
                        <span>⚠️</span>
                        Budget exceeded
                      </div>

                      <button
                        onClick={() =>
                          deleteBudget(
                            budget.id
                          )
                        }
                        className="text-xs font-bold text-rose-500 hover:text-rose-700"
                      >
                        Delete
                      </button>

                    </div>
                  )}

                  {!overBudget && (
                    <div className="mt-4 flex justify-end">

                      <button
                        onClick={() =>
                          deleteBudget(
                            budget.id
                          )
                        }
                        className="text-xs font-bold text-slate-300 hover:text-rose-600"
                      >
                        Delete budget
                      </button>

                    </div>
                  )}

                </div>
              );
            })}

          </div>
        )}

      </div>

      {/* ADD BUDGET */}

      {showAdd && (
        <Modal
          title="Create budget"
          onClose={() =>
            setShowAdd(false)
          }
        >

          <form
            onSubmit={addBudget}
            className="space-y-4"
          >

            <Field label="Category">

              <select
                required
                value={form.category}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    category:
                      e.target.value,
                  }))
                }
                className="input"
              >

                {budgetCategories.map(
                  (category) => (
                    <option
                      key={category}
                    >
                      {category}
                    </option>
                  )
                )}

              </select>

            </Field>

            <Field label="Monthly budget">

              <input
                required
                min="1"
                type="number"
                value={form.amount}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    amount:
                      e.target.value,
                  }))
                }
                placeholder="₹ 5000"
                className="input"
              />

            </Field>

            <div className="grid grid-cols-2 gap-3">

              <Field label="Month">

                <select
                  value={form.month}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      month:
                        e.target.value,
                    }))
                  }
                  className="input"
                >

                  {[
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                  ].map(
                    (month, index) => (
                      <option
                        key={month}
                        value={index + 1}
                      >
                        {month}
                      </option>
                    )
                  )}

                </select>

              </Field>

              <Field label="Year">

                <input
                  type="number"
                  min="2024"
                  max="2100"
                  value={form.year}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      year:
                        e.target.value,
                    }))
                  }
                  className="input"
                />

              </Field>

            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-violet-600 py-3 text-sm font-bold text-white hover:bg-violet-700"
            >
              Create budget
            </button>

          </form>

        </Modal>
      )}

    </div>
  );
}

/* =========================================================
   FIELD
========================================================= */

function Field({ label, children }) {
  return (
    <label className="block">

      <span className="mb-1.5 block text-xs font-bold text-slate-600">
        {label}
      </span>

      {children}

    </label>
  );
}

/* =========================================================
   MODAL
========================================================= */

function Modal({
  title,
  children,
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-5 backdrop-blur-sm">

      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[24px] bg-white p-6 shadow-2xl">

        <div className="mb-6 flex items-center justify-between">

          <h2 className="text-xl font-black">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
          >
            <X size={19} />
          </button>

        </div>

        {children}

      </div>

    </div>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

async function downloadFinancialReport(data) {
  try {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    const summary = data?.summary || {};
    const accounts = data?.accounts || [];
    const transactions = data?.recentTransactions || [];
    const categories = data?.categoryBreakdown || [];

    const income = Number(summary.income ?? summary.totalIncome ?? 0);
    const expenses = Number(summary.expenses ?? summary.totalExpenses ?? 0);
    const netWorth = Number(
      summary.netWorth ?? summary.balance ?? accounts.reduce((s, a) => s + Number(a.balance || 0), 0)
    );
    const savings = income - expenses;
    const generated = new Date().toLocaleString("en-IN");

    doc.setFillColor(91, 63, 211);
    doc.roundedRect(15, 14, 180, 30, 5, 5, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("SpendWise", 23, 32);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("PERSONAL FINANCE MANAGEMENT", 23, 39);

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Financial Report Card", 15, 58);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated: ${generated}`, 15, 65);

    const cards = [
      ["Net Worth", netWorth],
      ["Income", income],
      ["Expenses", expenses],
      ["Savings", savings],
    ];

    cards.forEach(([label, value], index) => {
      const x = 15 + (index % 2) * 92;
      const y = 76 + Math.floor(index / 2) * 30;
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(x, y, 86, 24, 3, 3, "F");
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(8);
      doc.text(label.toUpperCase(), x + 5, y + 8);
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text(`INR ${Number(value || 0).toLocaleString("en-IN")}`, x + 5, y + 18);
      doc.setFont("helvetica", "normal");
    });

    let y = 145;
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Accounts", 15, y);
    y += 8;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    accounts.forEach((account) => {
      doc.text(`${account.name} (${account.type})`, 18, y);
      doc.text(`INR ${Number(account.balance || 0).toLocaleString("en-IN")}`, 145, y);
      y += 6;
    });

    y += 6;
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Spending by Category", 15, y);
    y += 8;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    categories.slice(0, 8).forEach((item) => {
      doc.text(item.category, 18, y);
      doc.text(`INR ${Number(item.amount || 0).toLocaleString("en-IN")}`, 145, y);
      y += 6;
    });

    y += 7;
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Recent Transactions", 15, y);
    y += 8;
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    transactions.slice(0, 10).forEach((item) => {
      if (y > 275) {
        doc.addPage();
        y = 20;
      }
      const sign = item.type === "Income" ? "+" : "-";
      const description = String(item.description || "Transaction").slice(0, 42);
      doc.text(`${formatDate(item.date)}  ${description}`, 15, y);
      doc.text(`${sign} INR ${Number(item.amount || 0).toLocaleString("en-IN")}`, 145, y);
      y += 6;
    });

    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text("SpendWise — Personal Finance Management", 15, 288);
    doc.text("Confidential financial summary", 145, 288);

    doc.save(`SpendWise-Financial-Report-${new Date().toISOString().slice(0, 10)}.pdf`);
  } catch (error) {
    console.error(error);
    alert("Report download requires the jsPDF package. Run: npm install jspdf");
  }
}

function Dashboard({ logout }) {
  const [page, setPage] =
    useState("Overview");

  const [mobile, setMobile] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [data, setData] =
    useState(null);

  const [accounts, setAccounts] =
    useState([]);

  const token =
    localStorage.getItem(
      "spendwise_token"
    );

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API}/dashboard`,
        {
          cache: "no-store",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        logout();
        return;
      }

      if (!response.ok) {
        throw new Error(
          "Dashboard request failed"
        );
      }

      const dashboard =
        await response.json();

      setData(dashboard);
      setAccounts(
        dashboard.accounts || []
      );
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to SpendWise"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f7fb]">

        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-violet-600" />

          <p className="mt-4 text-xs font-semibold text-slate-400">
            Loading SpendWise...
          </p>

        </div>

      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f7fb] p-6">

        <div className="w-full max-w-md rounded-[24px] bg-white p-8 text-center shadow-xl">

          <Wallet
            className="mx-auto text-rose-500"
            size={34}
          />

          <h2 className="mt-4 text-xl font-black">
            Unable to load SpendWise
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error}. Make sure the SpendWise API is running on port 5001.
          </p>

          <button
            onClick={loadData}
            className="mt-6 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white"
          >
            Try again
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7fb]">

      <Sidebar
        page={page}
        setPage={setPage}
        mobile={mobile}
        setMobile={setMobile}
        logout={logout}
      />

      <div className="lg:pl-[260px]">

        <Header
          setMobile={setMobile}
          logout={logout}
          setPage={setPage}
          data={data}
        />

        <main className="mx-auto max-w-[1550px] px-4 py-6 pb-10 sm:px-8 sm:py-9">

          {page === "Overview" && (
            <Overview
              data={data}
              setPage={setPage}
            />
          )}

          {page === "Transactions" && (
            <TransactionsPage
              token={token}
              accounts={accounts}
              onChanged={loadData}
            />
          )}

          {page === "Accounts" && (
            <AccountsPage
              token={token}
              accounts={accounts}
              onChanged={loadData}
            />
          )}

          {page === "Budgets" && (
            <BudgetsPage
              token={token}
            />
          )}

          {page === "Settings" && (
  <SettingsPage
    logout={logout}
  />
)}

        </main>

      </div>

    </div>
  );
}

/* =========================================================
   APP
========================================================= */

export default function App() {
  const [
    authenticated,
    setAuthenticated,
  ] = useState(
    Boolean(
      localStorage.getItem(
        "spendwise_token"
      )
    )
  );

  if (!authenticated) {
    return (
      <Login
        onLogin={() => {
          setAuthenticated(true);
        }}
      />
    );
  }

  return (
    <Dashboard
      logout={() => {
        localStorage.removeItem(
          "spendwise_token"
        );

        localStorage.removeItem(
          "spendwise_user"
        );

        setAuthenticated(false);
      }}
    />
  );
}