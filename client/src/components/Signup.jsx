import { Camera, Eye, EyeOff, File, KeyRound, Mail, User } from 'lucide-react';
import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import useMeta from '../hooks/useMeta.js';
import axios from 'axios'
import { server } from '../constants/config.js';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';
import { useEffect } from 'react';
import toast from 'react-hot-toast';


function Login() {

  
  useMeta({ title: "signup", description: "this is the login page" })
  const [loggingIn, setLoggingIn] = useState(false)
  const navigate = useNavigate();
  const signupForm = useForm();

  const [passSeen, setPassSeen] = useState(false);
  const avatar = signupForm.watch("avatar");
  const user = useAuthStore(state => state.user);
  const userExists = useAuthStore(state => state.userExists);

  const handleSignup = async (param) => {
    try {
      setLoggingIn(true)
      const { bio, username, fullName, password, email, avatar } = param;
      const formData = new FormData()
      // Add text fields
      formData.append('bio', bio)
      formData.append('email', email)
      formData.append('fullName', fullName)
      formData.append('password', password)
      formData.append('username', username)
      formData.append('avatar', avatar[0])

      const { data } = await axios.post(`${server}/api/v1/auth/register`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        setLoggingIn(false);
        toast.success("Successfully signed in")
      }

      userExists(data.savedUserData)
      navigate('/')
    } catch (error) {
      setLoggingIn(false)
      toast.error("error signing up")
    }
  }

  return (
    <section className='w-screen h-screen flex justify-center items-center'>
      <form
        onSubmit={signupForm.handleSubmit(handleSignup)}
        className="login-form justify-center items-center flex flex-col w-2/3 max-w-[400px] m-auto gap-6 p-8"
      >
        <h2 className="text-2xl font-semibold">Sign up</h2>

        {/* Avatar Upload */}
        <div className="relative">
          <img
            className="bg-zinc-400 w-24 h-24 rounded-full object-cover"
            src={
              avatar && avatar[0]
                ? URL.createObjectURL(avatar[0])
                : "/unknown.jpg"
            }
          />
          <label
            htmlFor="avatar"
            className="absolute right-0 bottom-0 bg-zinc-900 h-6 w-6 flex justify-center items-center rounded-full cursor-pointer"
          >
            <Camera size={16} strokeWidth={1.5} className="text-white" />
          </label>
          <input
            type="file"
            id="avatar"
            accept="image/*"
            className="hidden"
            {...signupForm.register("avatar", {
              validate: (value) => {
                if (value?.length && value[0].size > 2 * 1024 * 1024)
                  return "The file size must be less than 2MB"
              }
            })}
          />

        </div>
        {signupForm.formState.errors.avatar && <p className="text-red-500 text-sm">{signupForm.formState.errors.avatar.message}</p>}

        {/* Username */}
        <label className="input validator w-full flex items-center gap-2">
          <User size={16} strokeWidth={1} />
          <input
            type="text"
            placeholder="Full name"
            className="focus:outline-none flex-1"
            {...signupForm.register("fullName", {
              required: "fullname is required",
              maxLength: { value: 30, message: "Max 30 characters" },
            })}
          />
        </label>
        {signupForm.formState.errors.fullName && <p className="text-red-500 text-sm">{signupForm.formState.errors.fullName.message}</p>} {/* Fixed: FullName to fullName */}


        {/* Username */}
        <label className="input validator w-full flex items-center gap-2">
          <User size={16} strokeWidth={1} />
          <input
            type="text"
            placeholder="Username"
            className="focus:outline-none flex-1"
            {...signupForm.register("username", {
              required: "Username is required",
              minLength: { value: 3, message: "At least 3 characters" },
              maxLength: { value: 30, message: "Max 30 characters" },
              pattern: {
                value: /^[A-Za-z][A-Za-z0-9-]*$/,
                message: "Only letters, numbers or dash"
              }
            })}
          />
        </label>
        {signupForm.formState.errors.username && <p className="text-red-500 text-sm">{signupForm.formState.errors.username.message}</p>}

        {/* Bio */}
        <label className="input w-full flex items-center gap-2">
          <File size={16} strokeWidth={1} />
          <input
            type="text"
            placeholder="Bio"
            className="grow focus:outline-none"
            {...signupForm.register("bio")}
          />
        </label>

        {/* Email */}
        <label className="input validator w-full flex items-center gap-2">
          <Mail size={16} strokeWidth={1} />
          <input
            type="email"
            placeholder="example@email.com"
            className="focus:outline-none flex-1"
            {...signupForm.register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Enter a valid email" }
            })}
          />
        </label>
        {signupForm.formState.errors.email && <p className="text-red-500 text-sm">{signupForm.formState.errors.email.message}</p>}

        {/* Password */}
        <label className="input validator w-full flex items-center gap-2">
          <KeyRound size={16} strokeWidth={1} />
          <input
            type={passSeen ? "text" : "password"}
            placeholder="Password"
            className="focus:outline-none flex-1"
            {...signupForm.register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "At least 8 characters" },
              pattern: {
                value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
                message: "Must include number, lowercase, uppercase"
              }
            })}
          />
          <span className='cursor-pointer' onClick={() => setPassSeen(prev => !prev)}>
            {passSeen ? <EyeOff size={16} strokeWidth={1} /> : <Eye size={16} strokeWidth={1} />}
          </span>
        </label>
        {signupForm.formState.errors.password && <p className="text-red-500 text-sm">{signupForm.formState.errors.password.message}</p>}

        {/* Submit */}

        <button className="btn w-full">
          {loggingIn ? <span className="loading loading-spinner text-zinc-500"></span>
            : <span>Sign up</span>
          }
        </button>

        <p className="text-sm">
          Already have an account?{" "}
          <span
            className="underline cursor-pointer text-blue-600"
            onClick={() => navigate('/auth/login')}
          >
            Log in
          </span>
        </p>
      </form>
    </section>
  )
}

export default Login