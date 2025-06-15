"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupFormData } from "@/lib/validations/auth";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Icons } from "@/components/icons";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
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

// Optimized particle configuration for mobile
const getStableParticles = () => {
  return Array.from({ length: 15 }, (_, i) => {
    // Reduced number of particles
    const seed = (i * 16807) % 2147483647;
    const random = (max: number, min = 0) => min + (seed % (max - min + 1));

    return {
      id: i,
      width: random(10, 3), // Smaller particles
      height: random(10, 3),
      left: random(100),
      top: random(100),
      xAmplitude: random(20, 5), // Reduced movement range
      yAmplitude: random(20, 5),
      duration: random(20, 5), // Faster animation
      delay: random(3, 0),
    };
  });
};

export function SignupForm() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [particles] = useState(getStableParticles());
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    watch,
    trigger,
    setValue,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    defaultValues: {
      acceptTerms: false,
    },
  });

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const acceptTerms = watch("acceptTerms");
  const [optimisticIsValid, setOptimisticIsValid] = useState(false);

  // Password requirements check
  const passwordChecks = {
    length: password?.length >= 8,
    uppercase: /[A-Z]/.test(password || ""),
    lowercase: /[a-z]/.test(password || ""),
    number: /[0-9]/.test(password || ""),
    specialChar: /[^A-Za-z0-9]/.test(password || ""),
  };

  const handleTermsChange = (checked: boolean) => {
    setValue("acceptTerms", checked);
    setOptimisticIsValid(checked);
    trigger("acceptTerms");
  };

  const displayIsValid = optimisticIsValid || isValid;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (password || confirmPassword) {
      trigger("confirmPassword");
    }
  }, [password, confirmPassword, trigger]);

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      const userExistsResponse = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email }),
      });

      if (!userExistsResponse.ok) {
        throw new Error("Failed to check email availability");
      }

      const { exists } = await userExistsResponse.json();
      if (exists) {
        toast({
          title: "Email already in use please login",
        });
        throw new Error("This email is already registered. Please sign in instead.");
      }

      const registerResponse = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!registerResponse.ok) {
        const errorData = await registerResponse.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.error) {
        throw new Error("Account created but login failed. Please try signing in.");
      }

      const welcomeMessage = data.name
        ? `Welcome, ${data.name}! Your account has been created.`
        : "Your account has been created successfully!";

      toast({
        title: welcomeMessage,
        description: "You're being redirected to your dashboard...",
        duration: 3000,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/home");
      router.refresh();
    } catch (error) {
      let errorMessage = "Registration failed. Please try again.";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      toast({
        title: "Registration failed",
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = (provider: "google" | "github") => {
    signIn(provider, { callbackUrl: "/home" });
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
              Create Your Account
            </h1>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
              Join us today and unlock amazing features
            </p>
          </motion.div>

          <motion.form
            variants={containerVariants}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-3 sm:space-y-4"
          >
            <motion.div variants={itemVariants}>
              <Label htmlFor="name" className="text-xs sm:text-sm text-gray-800 dark:text-gray-200">
                Full name
              </Label>
              <Input
                id="name"
                placeholder="John Doe"
                {...register("name")}
                className={cn(
                  "mt-1 h-10 sm:h-11 text-sm border-gray-400 focus:border-indigo-600 focus:ring-indigo-600",
                  isDark && "bg-gray-900 border-gray-700 text-white placeholder-gray-400"
                )}
              />
              {errors.name && (
                <p className="mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
              )}
            </motion.div>

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
              <Label htmlFor="password" className="text-xs sm:text-sm text-gray-800 dark:text-gray-200">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className={cn(
                    "mt-1 h-10 sm:h-11 text-sm border-gray-400 focus:border-indigo-600 focus:ring-indigo-600 pr-10",
                    isDark && "bg-gray-900 border-gray-700 text-white placeholder-gray-400"
                  )}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Icons.eyeOff className="h-4 w-4" /> : <Icons.eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
              )}
              {password && (
                <div className="mt-2 space-y-1 text-xs">
                  <p className={cn("text-gray-700 dark:text-gray-300")}>Password must contain:</p>
                  <ul className="space-y-1">
                    {Object.entries(passwordChecks).map(([key, isValid]) => (
                      <li key={key} className="flex items-center">
                        <span
                          className={cn(
                            "mr-2 inline-block h-3 w-3 rounded-full",
                            isValid ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                          )}
                        />
                        <span
                          className={cn(
                            isValid ? "text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-400"
                          )}
                        >
                          {key === "length" && "At least 8 characters"}
                          {key === "uppercase" && "One uppercase letter"}
                          {key === "lowercase" && "One lowercase letter"}
                          {key === "number" && "One number"}
                          {key === "specialChar" && "One special character"}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>

            <motion.div variants={itemVariants}>
              <Label htmlFor="confirmPassword" className="text-xs sm:text-sm text-gray-800 dark:text-gray-200">
                Confirm password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                  className={cn(
                    "mt-1 h-10 sm:h-11 text-sm border-gray-400 focus:border-indigo-600 focus:ring-indigo-600 pr-10",
                    isDark && "bg-gray-900 border-gray-700 text-white placeholder-gray-400"
                  )}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <Icons.eyeOff className="h-4 w-4" /> : <Icons.eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400">
                  {errors.confirmPassword.message}
                </p>
              )}
              {confirmPassword && password === confirmPassword && !errors.confirmPassword && (
                <p className="mt-1 text-xs sm:text-sm text-green-600 dark:text-green-400">Passwords match</p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="pt-1 sm:pt-2">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => handleTermsChange(checked === true)}
                  className={cn(
                    "mt-0.5 h-4 w-4 sm:h-5 sm:w-5",
                    isDark
                      ? "data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500"
                      : "data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                  )}
                />
                <div className="grid gap-1 leading-none">
                  <Label
                    htmlFor="terms"
                    className={cn("text-xs sm:text-sm font-normal leading-none", "text-gray-800 dark:text-gray-200")}
                  >
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className={cn(
                        "font-medium hover:underline",
                        "text-indigo-700 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300"
                      )}
                      target="_blank"
                    >
                      Terms
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className={cn(
                        "font-medium hover:underline",
                        "text-indigo-700 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300"
                      )}
                      target="_blank"
                    >
                      Privacy Policy
                    </Link>
                  </Label>
                  {errors.acceptTerms && (
                    <p className="text-xs sm:text-sm text-red-600 dark:text-red-400">{errors.acceptTerms.message}</p>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button
                type="submit"
                disabled={!displayIsValid || isLoading}
                className={cn(
                  "w-full h-10 sm:h-11 text-sm sm:text-base bg-gradient-to-r from-indigo-700 to-purple-700 hover:from-indigo-800 hover:to-purple-800",
                  "text-white shadow-lg transition-all duration-300 hover:shadow-indigo-500/20",
                  "focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950"
                )}
              >
                {isLoading && <Icons.spinner className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />}
                Create account
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
                disabled={isLoading}
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
                disabled={isLoading}
              >
                <Icons.github className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>GitHub</span>
              </Button>
            </motion.div>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className={cn("mt-6 text-center text-xs sm:text-sm", "text-gray-700 dark:text-gray-300")}
          >
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className={cn(
                "font-medium hover:underline",
                "text-indigo-700 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300"
              )}
            >
              Sign in
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
