import prisma from "@/lib/prisma";
import { loginSchema, signupSchema } from "@/lib/validations/auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { notifyAdminsAboutNewUser } from "./utils";

declare module "next-auth" {
  interface User {
    id: string;
    role: "USER" | "SUPER_ADMIN";
  }
  interface Session {
    user: {
      id: string;
      name?: string;
      email?: string;
      image?: string;
      role: "USER" | "SUPER_ADMIN";
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "USER" | "SUPER_ADMIN";
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 1 * 60 * 60, // 1 hour
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text", required: false }, // For registration
      },
      async authorize(credentials) {
        try {
          // Registration flow (when name is present)
          if (credentials?.name) {
            const { name, email, password } = await signupSchema.parseAsync({
              name: credentials.name,
              email: credentials.email,
              password: credentials.password,
              confirmPassword: credentials.password, // Using same password for confirmation
              acceptTerms: true, // Assuming accepted if using this flow
            });

            const existingUser = await prisma.user.findUnique({
              where: { email },
            });
            if (!existingUser) {
              throw new Error("User already exists");
            }

            if (!existingUser?.password) {
              throw new Error("No password set for this account. Please use social login.");
            }
            const isValid = await bcrypt.compare(password, existingUser?.password);
            if (!isValid) {
              throw new Error("Invalid password");
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            const user = await prisma.user.create({
              data: {
                name,
                email,
                password: hashedPassword,
                role: "USER",
              },
            });

            // await notifyAdminsAboutNewUser(user.id);

            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }

          // Login flow
          const { email, password } = await loginSchema.parseAsync(credentials);

          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user || !user.password) return null;

          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) return null;

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role || "USER",
            image: user.image,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          if (error instanceof Error) {
            throw error; // Pass through the specific error
          }
          throw new Error("Authentication failed");
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "credentials") return true;
      if (!profile?.email) return false;

      const existingUser = await prisma.user.findUnique({
        where: { email: profile.email },
      });

      if (!existingUser) {
        if (!account) return false;

        const newUser = await prisma.user.create({
          data: {
            email: profile.email,
            name: profile.name || profile.email.split("@")[0],
            // @ts-ignore
            image: profile.image || profile?.picture,
            role: "USER",
            accounts: {
              create: {
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state,
              },
            },
          },
        });

        await notifyAdminsAboutNewUser(newUser.id);
        return true;
      }

      if (account) {
        const existingAccount = await prisma.account.findFirst({
          where: {
            userId: existingUser.id,
            provider: account.provider,
          },
        });

        if (!existingAccount) {
          await prisma.account.create({
            data: {
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              userId: existingUser.id,
              access_token: account.access_token,
              expires_at: account.expires_at,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
              session_state: account.session_state,
            },
          });
        }
      }

      return true;
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          ...token,
          id: user.id,
          role: user.role || "USER",
          email: user.email,
          name: user.name,
          picture: user.image,
        };
      }

      const dbUser = await prisma.user.findUnique({
        where: { id: token.id as string },
      });

      if (dbUser) {
        return {
          ...token,
          id: dbUser.id,
          role: dbUser.role || "USER",
          email: dbUser.email,
          name: dbUser.name,
          picture: dbUser.image,
        };
      }

      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          role: token.role as "USER" | "SUPER_ADMIN",
          name: token.name,
          email: token.email,
          image: token.picture,
        },
      };
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
    newUser: "/auth/signup", // Optional: Add a signup page
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
