import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import authService from "../appwrite/auth";
import { login as authLogin } from '../store/authSlice';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from 'react-toastify';

function Login() {
    const navigate = useNavigate();
    const useDispatchHook = useDispatch();
    const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm();

    const login = async(data) => {
        try {
            const session = await authService.login(data);
            if (session) {
                const userData = await authService.getCurrentUser();
                if (userData) {
                    useDispatchHook(authLogin(userData));
                    toast.success(`Welcome back, ${userData.name}!`);
                    navigate("/");
                }
            }
        } catch (error) {
            console.error("Login error:", error);
            const errorMessage = error.message || "Login failed. Please try again";
            toast.error(errorMessage);
        }
    }

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left Side - Form */}
            <div className="flex items-center justify-center p-8 bg-background">
                <div className="w-full max-w-md space-y-8 animate-fade-in-up">
                    <div className="text-center lg:text-left">
                        <Link to="/" className="inline-block mb-8">
                             <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white shadow-lg">
                               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
                            </div>
                        </Link>
                        <h1 className="text-3xl font-heading font-bold tracking-tight">Welcome back</h1>
                        <p className="text-slate-400 mt-2">Enter your email and password to access your account.</p>
                    </div>

                    <form onSubmit={handleSubmit(login)} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                className="h-11 bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                                        message: "Email address must be a valid address",
                                    }
                                })}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500 font-medium">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link 
                                    to="/forgot-password" 
                                    className="text-xs text-primary hover:text-primary/80 font-medium"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                className="h-11 bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20"
                                {...register("password", {
                                    required: "Password is required",
                                })}
                            />
                            {errors.password && (
                                <p className="text-sm text-red-500 font-medium">{errors.password.message}</p>
                            )}
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full h-11 text-base font-semibold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </span>
                            ) : "Sign in"}
                        </Button>
                    </form>

                    <div className="text-center text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link 
                            to="/signup" 
                            className="text-primary hover:text-primary/80 font-medium transition-colors"
                        >
                            Sign up for free
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right Side - Visuals */}
            <div className="hidden lg:flex relative overflow-hidden bg-black items-center justify-center">
                <div className="absolute inset-0 mesh-bg opacity-80"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
                
                <div className="relative z-10 max-w-lg text-center p-12 space-y-6 animate-fade-in">
                    <h2 className="text-4xl md:text-5xl font-heading font-bold text-white tracking-tight">
                        Share your story with the world.
                    </h2>
                    <p className="text-xl text-slate-300 font-light">
                        Join a community of writers, thinkers, and creators building the future of digital content.
                    </p>
                    
                    {/* Decorative Elements */}
                    <div className="pt-12 grid grid-cols-2 gap-4">
                         <div className="glass-card p-4 rounded-2xl animate-float" style={{animationDelay: '0s'}}>
                            <div className="h-2 w-12 bg-primary/50 rounded-full mb-3"></div>
                            <div className="h-2 w-20 bg-white/20 rounded-full mb-2"></div>
                            <div className="h-2 w-16 bg-white/10 rounded-full"></div>
                         </div>
                         <div className="glass-card p-4 rounded-2xl animate-float" style={{animationDelay: '2s'}}>
                            <div className="h-8 w-8 rounded-full bg-purple-500/30 mb-3"></div>
                            <div className="h-2 w-full bg-white/20 rounded-full"></div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;