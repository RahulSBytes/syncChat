import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import { useAuthStore } from '../../store/authStore.js';
import useMeta from '../../hooks/useMeta.js';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, KeyRound, User } from 'lucide-react';
import toast from 'react-hot-toast';



function Login() {
  useMeta({ title: "login", description: "this is the login page" })
  const navigate = useNavigate();

  const [passSeen, setPassSeen] = useState(false);
  const loginForm = useForm();
  const login = useAuthStore(state => state.login)
  const [loggingIn, setLoggingIn] = useState(false)

  const handleLogin = async (param) => {

    console.log("login param",param)

    setLoggingIn(true)
    const success = await login(param);
    setLoggingIn(false)
    if (success.status) {
      toast.success(success.message);
      navigate("/", { replace: true });
    } else {
      toast.error(success.message || "Error logging in");
    }
  };


  return (
    <section className='w-screen h-screen flex justify-center items-center'>
      <form
        onSubmit={loginForm.handleSubmit(handleLogin)}
        className="login-form justify-center items-center flex flex-col w-2/3 max-w-[400px] m-auto gap-8 p-8"
      >
        <h2 className="text-2xl font-semibold">Login</h2>

        {/* Username */}
        <label className="input validator w-full flex items-center gap-2">
          <User size={16} strokeWidth={1} />
          <input
            type="text"
            placeholder="Username"
            className="focus:outline-none flex-1"
            {...loginForm.register("username", {
              required: "Username is required",
            })}
          />
        </label>
        {loginForm.formState.errors.username && (
          <p className="text-red-500 text-sm">{loginForm.formState.errors.username.message}</p>
        )}

        {/* Password */}
        <label className="input validator w-full flex items-center gap-2">
          <KeyRound size={16} strokeWidth={1} />
          <input
            type={passSeen ? "text" : "password"}
            placeholder="Password"
            className="focus:outline-none flex-1"
            {...loginForm.register("password", {
              required: "Password is required"
            })}
          />
          <span className='cursor-pointer' onClick={() => setPassSeen(prev => !prev)}>
            {passSeen ? <EyeOff size={16} strokeWidth={1} /> : <Eye size={16} strokeWidth={1} />}
          </span>
        </label>
        {loginForm.formState.errors.password && (
          <p className="text-red-500 text-sm">{loginForm.formState.errors.password.message}</p>
        )}

        <button className="btn w-full">
          {loggingIn ? <span className="loading loading-spinner text-zinc-500"></span>
            : <span>Login</span>
          }
        </button>

        <p className="text-sm">
          Don't have an account?{" "}
          <span
            className="underline cursor-pointer text-blue-600"
            onClick={() => navigate('/auth/signup')}
          >
            Sign up
          </span>
        </p>
      </form>

    </section>
  )
}

export default Login