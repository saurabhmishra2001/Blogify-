import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import authService from "../appwrite/auth";
import { login as authLogin } from '../store/authSlice';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Toast } from "./ui/toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "./ui/card";

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm();
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
    };

    const login = async(data) => {
        try {
            const session = await authService.login(data);
            if (session) {
                try {
                    const userData = await authService.getCurrentUser();
                    if (userData) {
                        dispatch(authLogin(userData));
                        showToast(`Welcome back, ${userData.name}!`, 'success');
                        setTimeout(() => {
                            navigate("/");
                        }, 2000);
                    } else {
                        showToast("Failed to get user data", 'error');
                    }
                } catch (userError) {
                    console.error("User data fetch error:", userError);
                    showToast(userError.message || "Failed to get user data", 'error');
                }
            }
        } catch (error) {
            console.error("Login error:", error);
            if (error.code === 401) {
                showToast("Invalid email or password", 'error');
            } else if (error.code === 403) {
                showToast("Account is blocked or inactive", 'warning');
            } else if (error.code === 429) {
                showToast("Too many attempts. Please try again later", 'warning');
            } else {
                showToast(error.message || "Login failed. Please try again", 'error');
            }
        }
    }

    return (
        <div className="min-h-screen flex flex-col">
            {toast.show && (
                <Toast 
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ show: false })}
                />
            )}

            <main className="flex-1 flex items-center justify-center bg-gradient-to-b from-primary/10 to-background px-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold gradient-text">
                            Welcome Back
                        </CardTitle>
                        <CardDescription>
                            Enter your credentials to access your account
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit(login)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    disabled={isSubmitting}
                                    {...register("email", {
                                        required: "Email is required",
                                        validate: {
                                            matchPattern: (value) => 
                                                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                                "Email address must be a valid address",
                                        }
                                    })}
                                />
                                {errors.email && (
                                    <p className="text-sm text-destructive">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    disabled={isSubmitting}
                                    {...register("password", {
                                        required: "Password is required",
                                    })}
                                />
                                {errors.password && (
                                    <p className="text-sm text-destructive">{errors.password.message}</p>
                                )}
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Signing in..." : "Sign in"}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
                        <Link 
                            to="/forgot-password" 
                            className="text-sm text-primary hover:underline"
                        >
                            Forgot password?
                        </Link>
                        <Link 
                            to="/signup" 
                            className="text-sm text-primary hover:underline"
                        >
                            Don't have an account? Sign up
                        </Link>
                    </CardFooter>
                </Card>
            </main>
        </div>
    );
}

export default Login;