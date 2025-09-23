"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUser, signupWithGoogle } from "@/redux/action/user";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";

const AuthBrandingPanel = () => (
  <div className="hidden lg:flex flex-col items-center justify-center p-10 text-center bg-indigo-700 relative overflow-hidden">
    {/* Fancy blurred/gradient background effect */}
    <div className="absolute inset-0 z-0">
      <div className="w-full h-full bg-gradient-to-br from-indigo-600 via-indigo-400 to-indigo-700 opacity-80 blur-2xl animate-gradient-move"></div>
    </div>
    <div className="z-10 w-full max-w-md">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-5xl font-bold text-white drop-shadow-lg"
        style={{ fontFamily: "var(--font-geist-sans)" }}
      >
        ReeOrg
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-4 text-indigo-200 drop-shadow"
        style={{ fontFamily: "var(--font-geist-sans)" }}
      >
        Visualize, manage, and optimize your organizational structure with ease.
      </motion.p>
    </div>
  </div>
);

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState("");
  const [localLoading, setLocalLoading] = useState("");

  const { isAuth, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  if (isAuth) return redirect("/chart");

  const submitHandler = async (e) => {
    e.preventDefault();
    setLocalError("");
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }
    setLocalLoading("signup");
    const formdata = new FormData();
    formdata.append("name", name);
    formdata.append("email", email);
    formdata.append("password", password);
    formdata.append("confirmPassword", confirmPassword);
    try {
      await dispatch(registerUser(formdata));
    } finally {
      setLocalLoading("");
    }
  };

  const googleSuccess = async (credentialResponse) => {
    setLocalLoading("google");
    try {
      await dispatch(signupWithGoogle(credentialResponse.credential));
    } finally {
      setLocalLoading("");
    }
  };

  const googleFailure = () => {
    setLocalLoading("");
    setLocalError("Google sign up was unsuccessful. Try again later.");
  };

  const FADE_IN_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" } },
  };

  return (
    <main className="grid min-h-screen w-full lg:grid-cols-2">
      <div className="flex w-full items-center justify-center p-6 sm:p-8 bg-slate-50">
        <motion.div
          initial="hidden"
          animate="show"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
          className="flex w-full max-w-md flex-col justify-center gap-y-8 rounded-2xl bg-white p-8 shadow-xl sm:p-10"
        >
          <motion.div
            variants={FADE_IN_ANIMATION_VARIANTS}
            className="flex flex-col gap-y-1.5 text-center"
          >
            <h1
              className="text-3xl font-bold tracking-tight text-gray-900"
              style={{ fontFamily: "var(--font-geist-sans)" }}
            >
              Create an Account
            </h1>
            <p
              className="text-gray-500"
              style={{ fontFamily: "var(--font-geist-sans)" }}
            >
              Get started for free. No credit card required.
            </p>
          </motion.div>
          
          <motion.div variants={FADE_IN_ANIMATION_VARIANTS} className="w-full">
            <form
              className="flex flex-col gap-4"
              onSubmit={submitHandler}
              autoComplete="off"
            >
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10"
                  autoComplete="username"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password (min. 8 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  required
                  className="pl-10 pr-10"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={8}
                  required
                  className="pl-10 pr-10"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {(localError || error) && (
                <div className="text-red-600 text-sm">{localError || error}</div>
              )}
              
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-md bg-indigo-600 hover:bg-indigo-700 transition-colors duration-150 font-semibold text-white text-sm cursor-pointer disabled:bg-indigo-400 disabled:cursor-not-allowed"
                disabled={localLoading === "signup" || localLoading === "google"}
              >
                {localLoading === "signup" ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <div className="my-5 flex items-center">
              <div className="flex-grow border-t border-gray-200" />
              <span className="mx-4 flex-shrink text-xs uppercase text-gray-400">Or</span>
              <div className="flex-grow border-t border-gray-200" />
            </div>

            <button
              type="button"
              onClick={() => {
                if (!localLoading) {
                  document.getElementById("google_signup_real_btn")?.querySelector("div[role=button]")?.click();
                }
              }}
              className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-md bg-white border border-gray-300 hover:bg-gray-50 transition-colors duration-150 font-semibold text-gray-700 text-sm cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={localLoading === "signup" || localLoading === "google"}
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                 <g><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path></g>
              </svg>
              {localLoading === "google" ? "Signing up..." : "Sign Up with Google"}
            </button>
            <div id="google_signup_real_btn" className="absolute left-[-9999px] w-0 h-0 overflow-hidden">
              <GoogleLogin onSuccess={googleSuccess} onError={googleFailure} />
            </div>
            
            <motion.div variants={FADE_IN_ANIMATION_VARIANTS} className="mt-8 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-indigo-600 hover:underline">
                Log In
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      <AuthBrandingPanel />
    </main>
  );
};

export default Signup;