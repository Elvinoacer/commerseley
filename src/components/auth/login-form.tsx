"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchema } from "@/lib/validations/auth";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Icons } from "@/components/icons";
import Link from "next/link";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export function LoginForm() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchema) => {
    try {
      const result = await signIn("credentials", {
        ...data,
        redirect: false,
      });

      if (result?.error) {
        let errorMessage = "Login failed. Please try again.";
        switch (result.error) {
          case "CredentialsSignin":
            errorMessage = "Invalid email or password";
            break;
          case "UserNotFound":
            errorMessage = "No account found with this email";
            break;
          case "IncorrectPassword":
            errorMessage = "Incorrect password. Please try again.";
            break;
          case "AccountNotActive":
            errorMessage = "Account not active. Please contact support.";
            break;
          default:
            errorMessage = result.error;
        }
        throw new Error(errorMessage);
      }

      if (!result?.ok) throw new Error("Something went wrong during login");

      const sessionResponse = await fetch("/api/auth/session");
      const session = await sessionResponse.json();
      const welcomeMessage = session.user?.name ? `Welcome back, ${session.user.name}!` : "Login successful!";

      toast.success(welcomeMessage, {
        description: "Redirecting you to your dashboard...",
        duration: 3000,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));
      switch (session.user?.role) {
        case "SUPER_ADMIN":
          router.push("/super-admin");
          break;
        default:
          router.push("/home");
      }
    } catch (error) {
      let errorMessage = "Login failed. Please try again.";
      if (error instanceof Error) errorMessage = error.message;

      toast.error("Login failed", {
        description: errorMessage,
        duration: 5000,
      });

      if (error instanceof Error && error.message.includes("password")) {
        setError("password", { type: "manual", message: error.message });
      } else if (error instanceof Error && error.message.includes("email")) {
        setError("email", { type: "manual", message: error.message });
      }
    }
  };

  const handleOAuth = (provider: "google" | "github") => {
    toast.promise(signIn(provider), {
      loading: `Signing in with ${provider}...`,
      success: `Signed in with ${provider} successfully!`,
      error: (error) => (error instanceof Error ? error.message : `Failed to sign in with ${provider}`),
    });
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div
          className={cn(
            "absolute -left-20 -top-20 h-96 w-96 rounded-full blur-3xl opacity-20 animate-float",
            isDark ? "bg-indigo-900" : "bg-indigo-200" // Darker for better contrast
          )}
        ></div>
        <div
          className={cn(
            "absolute -right-20 -bottom-20 h-96 w-96 rounded-full blur-3xl opacity-20 animate-float animation-delay-2000",
            isDark ? "bg-purple-900" : "bg-purple-200" // Darker for better contrast
          )}
        ></div>
        <div
          className={cn(
            "absolute left-1/2 top-1/4 h-64 w-64 rounded-full blur-3xl opacity-15 animate-float animation-delay-4000",
            isDark ? "bg-pink-900" : "bg-pink-200" // Darker for better contrast
          )}
        ></div>
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              rotate: [0, 360],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
            className={cn(
              "absolute rounded-full",
              isDark ? "bg-indigo-700/20 blur-[1px]" : "bg-indigo-400/30 blur-[1px]" // Better contrast
            )}
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className={cn(
            "w-full max-w-md rounded-2xl p-8 shadow-xl backdrop-blur-lg",
            isDark ? "bg-gray-950/90 border-gray-800" : "bg-white border-gray-200", // Darker background for better contrast
            "text-gray-900 dark:text-gray-50" // High contrast text
          )}
        >
          {/* Logo/Branding Area */}
          <motion.div variants={itemVariants} className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-indigo-700 to-purple-700 p-2">
              {" "}
              {/* Darker gradient */}
              <Icons.logo className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Welcome back</h1>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              {" "}
              {/* Improved contrast */}
              Enter your credentials to access your account
            </p>
          </motion.div>

          <motion.form variants={containerVariants} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <motion.div variants={itemVariants}>
              <Label htmlFor="email" className="text-gray-800 dark:text-gray-200">
                {/* Improved contrast */}
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className={cn(
                  "mt-1 border-gray-400 focus:border-indigo-600 focus:ring-indigo-600", // Darker border
                  isDark && "bg-gray-900 border-gray-700 text-white placeholder-gray-400" // Better contrast
                )}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {" "}
                  {/* Brighter red */}
                  {errors.email.message}
                </p>
              )}
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-800 dark:text-gray-200">
                  {" "}
                  {/* Improved contrast */}
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-indigo-700 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300" // Brighter links
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className={cn(
                  "mt-1 border-gray-400 focus:border-indigo-600 focus:ring-indigo-600", // Darker border
                  isDark && "bg-gray-900 border-gray-700 text-white placeholder-gray-400" // Better contrast
                )}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {" "}
                  {/* Brighter red */}
                  {errors.password.message}
                </p>
              )}
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "w-full bg-gradient-to-r from-indigo-700 to-purple-700 hover:from-indigo-800 hover:to-purple-800", // Darker gradient
                  "text-white shadow-lg transition-all duration-300 hover:shadow-indigo-500/20",
                  "focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950" // Focus states
                )}
                size="lg"
              >
                {isSubmitting ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : null}
                Sign in
              </Button>
            </motion.div>
          </motion.form>

          {/* OAuth Section - Centered and Improved */}
          <motion.div variants={itemVariants} className="relative my-6">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className={cn("w-full border-t", isDark ? "border-gray-800" : "border-gray-300")}></div>
              </div>
              <div className="relative px-2">
                <span
                  className={cn("text-sm px-2", isDark ? "text-gray-400 bg-gray-950/90" : "text-gray-600 bg-white")}
                >
                  OR CONTINUE WITH
                </span>
              </div>
            </div>
          </motion.div>

          {/* Centered OAuth Buttons */}
          <motion.div variants={containerVariants} className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.div variants={itemVariants} className="w-full sm:w-auto">
              <Button
                variant="outline"
                type="button"
                onClick={() => handleOAuth("google")}
                className={cn(
                  "w-full flex items-center justify-center gap-2",
                  isDark
                    ? "border-gray-700 bg-gray-900 hover:bg-gray-800 text-gray-200"
                    : "border-gray-300 hover:bg-gray-50 text-gray-800",
                  "focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950" // Focus states
                )}
              >
                <Icons.google className="h-5 w-5" />
                <span>Google</span>
              </Button>
            </motion.div>
            <motion.div variants={itemVariants} className="w-full sm:w-auto">
              <Button
                variant="outline"
                type="button"
                onClick={() => handleOAuth("github")}
                className={cn(
                  "w-full flex items-center justify-center gap-2",
                  isDark
                    ? "border-gray-700 bg-gray-900 hover:bg-gray-800 text-gray-200"
                    : "border-gray-300 hover:bg-gray-50 text-gray-800",
                  "focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950" // Focus states
                )}
              >
                <Icons.github className="h-5 w-5" />
                <span>GitHub</span>
              </Button>
            </motion.div>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className={cn(
              "mt-8 text-center text-sm",
              isDark ? "text-gray-300" : "text-gray-700" // Improved contrast
            )}
          >
            Don't have an account?{" "}
            <Link
              href="/auth/register"
              className="font-medium text-indigo-700 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300" // Brighter links
            >
              Sign up
            </Link>
          </motion.p>
        </motion.div>
      </div>

      {/* Add this to your global CSS */}
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        .animate-float {
          animation: float 12s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
