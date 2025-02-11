"use client";

import { LoginForm } from "@/components/auth/login-form";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex">
      {/* Left: Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 lg:px-8">
        <Card className="w-full max-w-md p-8 space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Welcome to EmpEx</h1>
            <p className="text-muted-foreground">Sign in to your account</p>
          </div>
          <LoginForm />
        </Card>
      </div>

      {/* Right: Brand Image */}
      <div className="hidden lg:flex flex-1 bg-muted items-center justify-center">
        <div className="relative w-[720px] h-[1024px]">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
          {/* You can add an actual image here */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold">EmpEx</span>
          </div>
        </div>
      </div>
    </div>
  );
}
