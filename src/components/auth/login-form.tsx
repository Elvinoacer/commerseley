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
import { useEffect, useState } from "react";

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

// Simplified particle configuration for mobile
const getStableParticles = () => {
  return Array.from({ length: 15 }, (_, i) => {
    const seed = (i * 16807) % 2147483647;
    const random = (max: number, min = 0) => min + (seed % (max - min + 1));

    return {
      id: i,
      width: random(10, 3),
      height: random(10, 3),
      left: random(100),
      top: random(100),
      xAmplitude: random(20, 5),
      yAmplitude: random(20, 5),
      duration: random(20, 5),
      delay: random(3, 0),
    };
  });
};

export function LoginForm() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();
  const [particles] = useState(getStableParticles());
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Icons.spinner className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Simplified Background for Mobile */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className={cn(
            "absolute -left-10 -top-10 h-48 w-48 sm:h-64 sm:w-64 rounded-full blur-xl opacity-20",
            isDark ? "bg-indigo-900" : "bg-indigo-200"
          )}
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className={cn(
            "absolute -right-10 -bottom-10 h-48 w-48 sm:h-64 sm:w-64 rounded-full blur-xl opacity-20",
            isDark ? "bg-purple-900" : "bg-purple-200"
          )}
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      {/* Optimized Particles for Mobile */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ opacity: 0 }}
            animate={{
              x: [0, particle.xAmplitude, 0],
              y: [0, particle.yAmplitude, 0],
              rotate: [0, 360],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
              delay: particle.delay,
            }}
            className={cn("absolute rounded-full", isDark ? "bg-indigo-700/20" : "bg-indigo-400/30")}
            style={{
              width: `${particle.width}px`,
              height: `${particle.height}px`,
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
          />
        ))}
      </div>

      {/* Form Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-2 sm:p-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className={cn(
            "w-full max-w-sm sm:max-w-md rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg backdrop-blur-sm",
            isDark ? "bg-gray-950/90 border-gray-800" : "bg-white border-gray-200",
            "text-gray-900 dark:text-gray-50"
          )}
        >
          {/* Logo/Branding Area */}
          <motion.div variants={itemVariants} className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gradient-to-r from-indigo-700 to-purple-700 p-2">
              <Icons.logo className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Welcome back
            </h1>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
              Enter your credentials to access your account
            </p>
          </motion.div>

          <motion.form
            variants={containerVariants}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 sm:space-y-6"
          >
            <motion.div variants={itemVariants}>
              <Label htmlFor="email" className="text-xs sm:text-sm text-gray-800 dark:text-gray-200">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className={cn(
                  "mt-1 h-10 sm:h-11 text-sm border-gray-400 focus:border-indigo-600 focus:ring-indigo-600",
                  isDark && "bg-gray-900 border-gray-700 text-white placeholder-gray-400"
                )}
              />
              {errors.email && (
                <p className="mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
              )}
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs sm:text-sm text-gray-800 dark:text-gray-200">
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-xs sm:text-sm font-medium text-indigo-700 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className={cn(
                    "h-10 sm:h-11 text-sm border-gray-400 focus:border-indigo-600 focus:ring-indigo-600 pr-10",
                    isDark && "bg-gray-900 border-gray-700 text-white placeholder-gray-400"
                  )}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <Icons.eyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <Icons.eye className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
              )}
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "w-full h-10 sm:h-11 text-sm sm:text-base bg-gradient-to-r from-indigo-700 to-purple-700 hover:from-indigo-800 hover:to-purple-800",
                  "text-white shadow-lg transition-all duration-300 hover:shadow-indigo-500/20",
                  "focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950"
                )}
              >
                {isSubmitting ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : null}
                Sign in
              </Button>
            </motion.div>
          </motion.form>

          {/* OAuth Section */}
          <motion.div variants={itemVariants} className="relative my-4 sm:my-6">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className={cn("w-full border-t", isDark ? "border-gray-800" : "border-gray-300")}></div>
              </div>
              <div className="relative px-2">
                <span
                  className={cn(
                    "text-xs sm:text-sm px-2",
                    isDark ? "text-gray-400 bg-gray-950/90" : "text-gray-600 bg-white"
                  )}
                >
                  OR CONTINUE WITH
                </span>
              </div>
            </div>
          </motion.div>

          {/* Stacked OAuth Buttons on Mobile */}
          <motion.div variants={containerVariants} className="flex flex-col gap-2 sm:gap-3">
            <motion.div variants={itemVariants}>
              <Button
                variant="outline"
                type="button"
                onClick={() => handleOAuth("google")}
                className={cn(
                  "w-full h-10 sm:h-11 flex items-center justify-center gap-2 text-xs sm:text-sm",
                  isDark
                    ? "border-gray-700 bg-gray-900 hover:bg-gray-800 text-gray-200"
                    : "border-gray-300 hover:bg-gray-50 text-gray-800",
                  "focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950"
                )}
              >
                <Icons.google className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Google</span>
              </Button>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Button
                variant="outline"
                type="button"
                onClick={() => handleOAuth("github")}
                className={cn(
                  "w-full h-10 sm:h-11 flex items-center justify-center gap-2 text-xs sm:text-sm",
                  isDark
                    ? "border-gray-700 bg-gray-900 hover:bg-gray-800 text-gray-200"
                    : "border-gray-300 hover:bg-gray-50 text-gray-800",
                  "focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950"
                )}
              >
                <Icons.github className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>GitHub</span>
              </Button>
            </motion.div>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className={cn("mt-6 text-center text-xs sm:text-sm", isDark ? "text-gray-300" : "text-gray-700")}
          >
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="font-medium text-indigo-700 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Sign up
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
