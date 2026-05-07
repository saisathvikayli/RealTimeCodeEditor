import {
  useState,
} from "react";

import API from "../services/api";

import {
  useNavigate,
  Link,
} from "react-router-dom";

export default function Signup() {

  const navigate =
    useNavigate();

  // loading state
  const [loading, setLoading] =
    useState(false);

  // error state
  const [error, setError] =
    useState("");

  // form state
  const [form, setForm] =
    useState({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

  // signup
  const handleSubmit =
    async (e) => {

      e.preventDefault();

      setError("");

      // password validation
      if (
        form.password !==
        form.confirmPassword
      ) {

        return setError(
          "Passwords do not match"
        );
      }

      try {

        setLoading(true);

        await API.post(
          "/auth/register",
          {
            username:
              form.username,

            email:
              form.email,

            password:
              form.password,
          }
        );

        navigate("/login");

      } catch (error) {

        setError(
          error.response?.data
            ?.message ||
          "Signup failed"
        );

      } finally {

        setLoading(false);
      }
    };

  return (

    <div className="min-h-screen bg-[#070B16] flex items-center justify-center px-5">

      {/* background grid */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* card */}
      <div className="relative w-full max-w-[600px] bg-[#0F172A]/95 border border-[#1E293B] rounded-[32px] p-10 md:p-14 shadow-2xl">

        {/* logo */}
        <div className="flex items-center gap-4 mb-10">

          <div className="w-16 h-16 rounded-2xl bg-[#052e2b] border border-[#0f766e] flex items-center justify-center text-[#12F7A0] text-3xl font-bold">
            {"</>"}
          </div>

          <h1 className="text-3xl font-bold text-white">
            CodeCollab
          </h1>
        </div>

        {/* heading */}
        <h2 className="text-5xl md:text-6xl font-black leading-tight text-white mb-4">
          Start collaborating.
        </h2>

        <p className="text-gray-400 text-lg mb-10">
          Create your account and join coding rooms instantly.
        </p>

        {/* form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* username */}
          <div>

            <label className="block text-sm font-semibold tracking-widest text-gray-400 uppercase mb-3">
              Display Name
            </label>

            <input
              type="text"
              required
              placeholder="e.g. Arjun"
              value={form.username}
              onChange={(e) =>
                setForm({
                  ...form,
                  username:
                    e.target.value,
                })
              }
              className="w-full h-[64px] px-5 rounded-2xl bg-[#111827] border border-[#1E293B] text-white outline-none focus:border-[#12F7A0] transition"
            />
          </div>

          {/* email */}
          <div>

            <label className="block text-sm font-semibold tracking-widest text-gray-400 uppercase mb-3">
              Email Address
            </label>

            <input
              type="email"
              required
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email:
                    e.target.value,
                })
              }
              className="w-full h-[64px] px-5 rounded-2xl bg-[#111827] border border-[#1E293B] text-white outline-none focus:border-[#12F7A0] transition"
            />
          </div>

          {/* password row */}
          <div className="grid md:grid-cols-2 gap-5">

            {/* password */}
            <div>

              <label className="block text-sm font-semibold tracking-widest text-gray-400 uppercase mb-3">
                Password
              </label>

              <input
                type="password"
                required
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password:
                      e.target.value,
                  })
                }
                className="w-full h-[64px] px-5 rounded-2xl bg-[#111827] border border-[#1E293B] text-white outline-none focus:border-[#12F7A0] transition"
              />
            </div>

            {/* confirm */}
            <div>

              <label className="block text-sm font-semibold tracking-widest text-gray-400 uppercase mb-3">
                Confirm Password
              </label>

              <input
                type="password"
                required
                placeholder="Repeat password"
                value={
                  form.confirmPassword
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    confirmPassword:
                      e.target.value,
                  })
                }
                className="w-full h-[64px] px-5 rounded-2xl bg-[#111827] border border-[#1E293B] text-white outline-none focus:border-[#12F7A0] transition"
              />
            </div>
          </div>

          {/* error */}
          {error && (

            <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* submit */}
          <button
            disabled={loading}
            className="w-full h-[64px] rounded-2xl bg-[#12F7A0] text-black font-bold text-lg hover:opacity-90 transition disabled:opacity-50"
          >

            {loading
              ? "Creating..."
              : "Create account →"}
          </button>
        </form>

        {/* login link */}
        <p className="mt-8 text-center text-gray-400">

          Already have an account?

          <Link
            to="/login"
            className="text-[#12F7A0] ml-2 font-semibold"
          >
            Sign in
          </Link>
        </p>

        {/* footer */}
        <div className="mt-12 pt-8 border-t border-[#1E293B] text-center text-sm tracking-[3px] text-gray-600 uppercase">
          Built for teams. Real-time. Everywhere.
        </div>
      </div>
    </div>
  );
}