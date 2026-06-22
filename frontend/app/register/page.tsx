"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

const BASE_URL = "https://ai-travel-planner-rr8d.onrender.com/api";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const register = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    try {
      await axios.post(`${BASE_URL}/auth/register`, {
        name,
        email,
        password,
      });

      alert("Registration Successful");

      router.push("/login");
    } catch (error: any) {
     console.log(error.response);
     console.log(error.response?.data);
      alert(error.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form
        onSubmit={register}
        className="w-full max-w-md bg-slate-800 rounded-xl p-8 shadow-lg"
      >
        <h1 className="text-3xl text-white font-bold text-center mb-6">
          Register
        </h1>

        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 text-white rounded-lg mb-4"
          value={name}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 text-white rounded-lg mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 text-white rounded-lg mb-6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg"
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

        <p className="text-center text-gray-300 mt-5">
          Already have an account?{" "}
          <Link href="/login" className="text-green-400">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
