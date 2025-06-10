
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const loginFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }), // Basic check, adjust as needed
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    setIsLoading(true);
    const user = await login(data.email, data.password);
    setIsLoading(false);
    if (user) {
      toast({
        title: 'Login Successful!',
        description: `Welcome back, ${user.name}!`,
      });
      router.push('/my-account'); // Or last visited page, or dashboard based on role
    } else {
      toast({
        title: 'Login Failed',
        description: 'Invalid email or password. Please try again.',
        variant: 'destructive',
      });
      form.setError("root", { message: "Invalid email or password." });
      form.resetField("password");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)]"> {/* Adjust min-h based on header/footer */}
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <LogIn className="mx-auto h-10 w-10 text-primary mb-3" />
          <CardTitle className="text-3xl font-headline">Login to Your Account</CardTitle>
          <CardDescription>Enter your credentials to access your account.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">Email Address</FormLabel>
                    <FormControl>
                      <Input id="email" type="email" placeholder="you@example.com" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <FormControl>
                      <Input id="password" type="password" placeholder="••••••••" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.formState.errors.root && (
                <p className="text-sm font-medium text-destructive">{form.formState.errors.root.message}</p>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full text-lg py-3" disabled={isLoading}>
                {isLoading ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Logging In...</>
                ) : (
                  <><LogIn className="mr-2 h-5 w-5" /> Login</>
                )}
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Don&apos;t have an account?{' '}
                <Button variant="link" asChild className="p-0 h-auto">
                  <Link href="/register">Sign up here</Link>
                </Button>
              </p>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
