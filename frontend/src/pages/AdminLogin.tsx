import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import Header from "../components/Header";
import Footer from "../components/Footer";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

import { Shield, Fingerprint, Loader2 } from "lucide-react";
import "@/styles/LoginCustom.css";

// --------------------
// HARD-CODED ADMIN CREDENTIALS
// (Academic project purpose)
// --------------------
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "password123";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { loginAdmin } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      loginAdmin();
      navigate("/admin/dashboard");
    } else {
      setError("Invalid username or password");
      setPassword("");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background">
      <Header />

      <main className="flex-grow grid lg:grid-cols-2 min-h-[calc(100vh-80px)]">
        {/* Left Side: Photo Frame / Brand */}
        <div className="relative hidden lg:flex flex-col justify-center p-16 bg-slate-900 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-slate-900 opacity-90" />
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img src="/smart-parking-hero.png" alt="Admin Dashboard Preview" className="w-full h-full object-cover opacity-20 mix-blend-overlay" />
          </div>

          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium">
              <Shield className="w-4 h-4 mr-2" /> Admin Portal
            </div>
            <h1 className="text-5xl font-extrabold text-white leading-tight tracking-tight">
              Manage Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                Smart Space
              </span>
            </h1>
            <p className="text-lg text-slate-400 max-w-md">
              Access real-time analytics, manage live slots, and oversee parking operations from a centralized dashboard.
            </p>
          </div>

          {/* Decorative shapes */}
          <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 -right-24 w-60 h-60 bg-cyan-600/10 rounded-full blur-3xl" />
        </div>

        {/* Right Side: Login Form with Custom CSS */}
        <div className="flex items-center justify-center p-6 sm:p-12 bg-white dark:bg-slate-950 relative">

          <div className="login-container">
            <div className="login-heading">Sign In</div>

            <form onSubmit={handleLogin} className="login-form">
              <input
                required
                className="login-input"
                type="text"
                name="username"
                id="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />

              <input
                required
                className="login-input"
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />

              <span className="forgot-password"><a href="#">Forgot Password?</a></span>

              {error && (
                <div className="mt-4 text-center text-red-500 text-sm font-bold bg-white p-2 rounded-lg shadow-sm">
                  {error}
                </div>
              )}

              <button
                className="login-button"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Verifying...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>

              <div className="agreement">
                <a href="#">Restricted Access. SmartLot Technology © 2026</a>
              </div>
            </form>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminLogin;
