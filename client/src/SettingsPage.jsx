import { useEffect, useState } from "react";
import {
  User,
  Mail,
  ShieldCheck,
  LogOut,
  Save,
  CheckCircle2,
  Wallet,
} from "lucide-react";

export default function SettingsPage({ logout }) {
  const storedUser = JSON.parse(
    localStorage.getItem("spendwise_user") || "{}"
  );

  const [name, setName] = useState(
    storedUser.name || "Umakant"
  );

  const [email] = useState(
    storedUser.email || "admin@spendwise.com"
  );

  const [currency, setCurrency] = useState(
    localStorage.getItem("spendwise_currency") || "INR"
  );

  const [saved, setSaved] = useState(false);

  function saveSettings(event) {
    event.preventDefault();

    const updatedUser = {
      ...storedUser,
      name,
    };

    localStorage.setItem(
      "spendwise_user",
      JSON.stringify(updatedUser)
    );

    localStorage.setItem(
      "spendwise_currency",
      currency
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">

      {/* HEADER */}

      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">
          Preferences
        </p>

        <h1 className="mt-2 text-3xl font-black">
          Settings
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Manage your SpendWise profile and preferences.
        </p>
      </div>

      {/* SUCCESS */}

      {saved && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-bold text-emerald-700">
          <CheckCircle2 size={19} />
          Settings saved successfully.
        </div>
      )}

      {/* PROFILE */}

      <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
              <User size={20} />
            </div>

            <div>
              <h2 className="font-black">
                Profile
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Your personal account information.
              </p>
            </div>

          </div>
        </div>

        <form
          onSubmit={saveSettings}
          className="space-y-6 p-6"
        >

          {/* NAME */}

          <div>

            <label className="mb-2 block text-xs font-bold text-slate-600">
              Full name
            </label>

            <div className="relative">

              <User
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-50"
                placeholder="Your name"
              />

            </div>

          </div>

          {/* EMAIL */}

          <div>

            <label className="mb-2 block text-xs font-bold text-slate-600">
              Email address
            </label>

            <div className="relative">

              <Mail
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={email}
                disabled
                className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 py-3 pl-10 pr-4 text-sm text-slate-500 outline-none"
              />

            </div>

            <p className="mt-2 text-[11px] text-slate-400">
              Your login email cannot be changed from this page.
            </p>

          </div>

          {/* CURRENCY */}

          <div>

            <label className="mb-2 block text-xs font-bold text-slate-600">
              Default currency
            </label>

            <div className="relative">

              <Wallet
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={currency}
                onChange={(event) =>
                  setCurrency(event.target.value)
                }
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-50"
              >
                <option value="INR">
                  INR — Indian Rupee (₹)
                </option>

                <option value="USD">
                  USD — US Dollar ($)
                </option>

                <option value="EUR">
                  EUR — Euro (€)
                </option>

                <option value="GBP">
                  GBP — British Pound (£)
                </option>
              </select>

            </div>

          </div>

          {/* SAVE */}

          <div className="flex justify-end border-t border-slate-100 pt-5">

            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700"
            >
              <Save size={17} />
              Save changes
            </button>

          </div>

        </form>

      </section>

      {/* SECURITY */}

      <section className="rounded-[24px] border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-100 px-6 py-5">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <ShieldCheck size={20} />
            </div>

            <div>

              <h2 className="font-black">
                Security
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Manage your account security.
              </p>

            </div>

          </div>

        </div>

        <div className="p-6">

          <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-5">

            <div>

              <p className="text-sm font-black">
                Account authentication
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Your SpendWise account is protected by authenticated API access.
              </p>

            </div>

            <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-bold text-emerald-600">

              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

              Active

            </div>

          </div>

        </div>

      </section>

      {/* ACCOUNT */}

      <section className="rounded-[24px] border border-rose-200 bg-white shadow-sm">

        <div className="border-b border-rose-100 px-6 py-5">

          <h2 className="font-black text-rose-600">
            Account
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Sign out from this SpendWise account.
          </p>

        </div>

        <div className="flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-center">

          <div>

            <p className="text-sm font-bold">
              Sign out
            </p>

            <p className="mt-1 text-xs text-slate-400">
              You will need to log in again to access your finances.
            </p>

          </div>

          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-bold text-rose-600 transition hover:bg-rose-100"
          >
            <LogOut size={17} />
            Logout
          </button>

        </div>

      </section>

    </div>
  );
}