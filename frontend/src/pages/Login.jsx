import {
  useState,
} from "react";

import API from "../services/api";

import {
  useNavigate,
  Link,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

export default function Login() {

  const navigate =
    useNavigate();

  const { login } =
    useAuth();

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [form, setForm] =
    useState({
      email: "",
      password: "",
    });

  // submit login
  const handleSubmit =
    async (e) => {

      e.preventDefault();

      setError("");

      try {

        setLoading(true);

        const { data } =
          await API.post(
            "/auth/login",
            form
          );

        // save auth
        login(data);

        // redirect home
        navigate("/");

      } catch (error) {

        setError(
          error.response?.data
            ?.message ||
          "Login failed"
        );

      } finally {

        setLoading(false);
      }
    };

  return (

    <div className="min-h-screen bg-[#070B16] flex items-center justify-center px-5">

      {/* background dots */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* card */}
      <div className="relative w-full max-w-[560px] bg-[#0F172A]/95 border border-[#1E293B] rounded-[32px] p-10 md:p-14 shadow-2xl">

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
          Welcome back.
        </h2>

        <p className="text-gray-400 text-lg mb-10">
          Sign in to your rooms and continue collaborating in real time.
        </p>

        {/* form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

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

          {/* password */}
          <div>

            <label className="block text-sm font-semibold tracking-widest text-gray-400 uppercase mb-3">
              Password
            </label>

            <input
              type="password"
              required
              placeholder="Your password"
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
              ? "Signing In..."
              : "Sign In →"}
          </button>
        </form>

        {/* signup link */}
        <p className="mt-8 text-center text-gray-400">

          No account yet?

          <Link
            to="/signup"
            className="text-[#12F7A0] ml-2 font-semibold"
          >
            Create one free
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