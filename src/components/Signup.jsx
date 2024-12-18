import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import authService from "../appwrite/auth";
import { login } from "../store/authSlice";
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

function Signup() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { isSubmitting } } = useForm();
    const [error, setError] = useState("");
    const [showToast, setShowToast] = useState(false);

    const create = async(data) => {
        setError("");
        try {
            const userData = await authService.createAccount(data);
            if (userData) {
                setShowToast(true);
                // Wait for 2 seconds before redirecting
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            }
        } catch (error) {
            setError(error.message);
        }
    }

    return (
        <div className="min-h-screen flex flex-col">
            {showToast && (
                <Toast 
                    message="Welcome to the club! Redirecting to login..." 
                    type="success"
                    onClose={() => setShowToast(false)}
                />
            )}
            
            <main className="flex-1 flex items-center justify-center bg-gradient-to-b from-primary/10 to-background px-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold gradient-text">
                            Create an Account
                        </CardTitle>
                        <CardDescription>
                            Join our community of writers and readers
                        </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                        {error && (
                            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">
                                {error}
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit(create)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    disabled={isSubmitting}
                                    {...register("name", {
                                        required: true,
                                    })}
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    disabled={isSubmitting}
                                    {...register("email", {
                                        required: true,
                                        validate: {
                                            matchPattern: (value) => 
                                                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                                "Email address must be a valid address",
                                        }
                                    })}
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    disabled={isSubmitting}
                                    {...register("password", {
                                        required: true,
                                    })}
                                />
                            </div>
                            
                            <Button 
                                type="submit" 
                                className="w-full"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Creating Account..." : "Create Account"}
                            </Button>
                        </form>
                    </CardContent>
                    
                    <CardFooter className="justify-center">
                        <Link 
                            to="/login" 
                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                            Already have an account? Log in
                        </Link>
                    </CardFooter>
                </Card>
            </main>
        </div>
    );
}

export default Signup;