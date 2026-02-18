import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import authService from "../appwrite/auth";
import { login } from "../store/authSlice";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from 'react-toastify';

function Signup() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm();

    const create = async(data) => {
        try {
            const userData = await authService.createAccount(data);
            if (userData) {
                const currentUser = await authService.getCurrentUser();
                if(currentUser) {
                     dispatch(login(currentUser));
                }
                toast.success("Account created successfully!");
                navigate("/");
            }
        } catch (error) {
            console.error("Signup error:", error);
            const errorMessage = error.message || "Signup failed. Please try again";
            toast.error(errorMessage);
        }
    }

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left Side - Form */}
            <div className="flex items-center justify-center p-8 bg-background order-1 lg:order-2">
                <div className="w-full max-w-md space-y-8 animate-fade-in-up">
                    <div className="text-center lg:text-left">
                        <Link to="/" className="inline-block mb-8">
                             <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white shadow-lg">
                               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
                            </div>
                        </Link>
                        <h1 className="text-3xl font-heading font-bold tracking-tight">Create an account</h1>
                        <p className="text-slate-400 mt-2">Enter your information below to get started</p>
                    </div>
                
                    <form onSubmit={handleSubmit(create)} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                className="h-11 bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20"
                                {...register("name", {
                                    required: "Full name is required",
                                })}
                            />
                             {errors.name && (
                                <p className="text-sm text-red-500 font-medium">{errors.name.message}</p>
                            )}
                        </div>
                        
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
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                className="h-11 bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 8,
                                        message: "Password must be at least 8 characters"
                                    }
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
                                    Creating account...
                                </span>
                            ) : "Create account"}
                        </Button>
                    </form>
                    
                    <div className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link 
                            to="/login" 
                            className="text-primary hover:text-primary/80 font-medium transition-colors"
                        >
                            Log in
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right Side - Visuals */}
            <div className="hidden lg:flex relative overflow-hidden bg-black items-center justify-center order-2 lg:order-1">
                <div className="absolute inset-0 mesh-bg opacity-80" style={{filter: 'hue-rotate(45deg)'}}></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
                
                <div className="relative z-10 max-w-lg text-center p-12 space-y-6 animate-fade-in">
                    <h2 className="text-4xl md:text-5xl font-heading font-bold text-white tracking-tight">
                        Join the revolution.
                    </h2>
                    <p className="text-xl text-slate-300 font-light">
                        Discover stories, thinking, and expertise from writers on any topic.
                    </p>
                    
                     {/* Decorative Elements */}
                     <div className="pt-12 relative h-48 w-full flex justify-center">
                         <div className="absolute glass rounded-2xl p-6 animate-float w-64 text-left" style={{animationDelay: '1s', top: '0', left: '10%'}}>
                            <div className="flex gap-3 mb-3">
                                <div className="h-8 w-8 rounded-full bg-blue-500/30"></div>
                                <div className="space-y-1">
                                    <div className="h-2 w-20 bg-white/20 rounded-full"></div>
                                    <div className="h-1.5 w-12 bg-white/10 rounded-full"></div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-2 w-full bg-white/10 rounded-full"></div>
                                <div className="h-2 w-3/4 bg-white/10 rounded-full"></div>
                            </div>
                         </div>
                         
                         <div className="absolute glass-card rounded-2xl p-6 animate-float w-64 text-left z-10" style={{animationDelay: '0s', top: '40px', right: '10%'}}>
                            <div className="flex gap-3 mb-3">
                                <div className="h-8 w-8 rounded-full bg-primary/30"></div>
                                <div className="space-y-1">
                                    <div className="h-2 w-20 bg-white/30 rounded-full"></div>
                                    <div className="h-1.5 w-12 bg-white/20 rounded-full"></div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-2 w-full bg-white/20 rounded-full"></div>
                                <div className="h-2 w-3/4 bg-white/20 rounded-full"></div>
                            </div>
                         </div>
                     </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;