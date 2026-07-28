import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { authService } from "@/services/auth.service";
import { useAuth } from "@/contexts/AuthContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>();

  async function onSubmit(data: RegisterForm) {
    try {
      const response = await authService.register(data);

      login(response.token, response.user);

      toast.success("Account created successfully!");

      navigate("/");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ??
          "Registration failed."
      );
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* Left Side */}

      <div className="hidden lg:flex w-1/2 bg-linear-to-br from-indigo-600 via-blue-600 to-cyan-500 text-white items-center justify-center">

        <div className="max-w-md">

          <h1 className="text-5xl font-bold mb-6">
            ForgeOps
          </h1>

          <p className="text-xl opacity-90 leading-relaxed">
            Create your workspace, manage repositories,
            track deployments and collaborate with your team.
          </p>

        </div>

      </div>

      {/* Right Side */}

      <div className="flex-1 flex items-center justify-center bg-background p-8">

        <Card className="w-full max-w-md shadow-xl">

          <CardContent className="pt-8">

            <div className="text-center mb-8">

              <h2 className="text-3xl font-bold">
                Create Account
              </h2>

              <p className="text-muted-foreground mt-2">
                Join ForgeOps today
              </p>

            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
            >

              <div>

                <Label>Name</Label>

                <Input
                  placeholder="John Doe"
                  {...register("name", {
                    required: "Name is required",
                  })}
                />

                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.name.message}
                  </p>
                )}

              </div>

              <div>

                <Label>Email</Label>

                <Input
                  type="email"
                  placeholder="john@example.com"
                  {...register("email", {
                    required: "Email is required",
                  })}
                />

                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.email.message}
                  </p>
                )}

              </div>

              <div>

                <Label>Password</Label>

                <div className="relative">

                  <Input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="********"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message:
                          "Password must be at least 6 characters",
                      },
                    })}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-3 top-2.5"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.password.message}
                  </p>
                )}

              </div>

              <Button
                className="w-full"
                disabled={isSubmitting}
              >
                <UserPlus className="mr-2 h-4 w-4" />

                {isSubmitting
                  ? "Creating Account..."
                  : "Create Account"}

              </Button>

            </form>

            <div className="text-center mt-6">

              <span className="text-sm text-muted-foreground">
                Already have an account?{" "}
              </span>

              <Link
                to="/login"
                className="text-primary font-medium hover:underline"
              >
                Sign In
              </Link>

            </div>

          </CardContent>

        </Card>

      </div>

    </div>
  );
}