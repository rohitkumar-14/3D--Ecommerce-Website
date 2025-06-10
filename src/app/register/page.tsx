
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
import { UserPlus, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const registerFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ["confirmPassword"], // Path to field to display error
});

type RegisterFormValues = z.infer<typeof registerFormSchema>;

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
    setIsLoading(true);
    const user = await register(data.name, data.email, data.password);
    setIsLoading(false);
    if (user) {
      toast({
        title: 'Registration Successful!',
        description: `Welcome, ${user.name}! Your account has been created.`,
      });
      router.push('/my-account'); // Or redirect to login or dashboard
    } else {
      // This mock implementation of addUser returns null if email exists
      toast({
        title: 'Registration Failed',
        description: 'An account with this email already exists or another error occurred.',
        variant: 'destructive',
      });
      form.setError("email", { message: "An account with this email already exists." });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)]"> {/* Adjust min-h */}
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <UserPlus className="mx-auto h-10 w-10 text-primary mb-3" />
          <CardTitle className="text-3xl font-headline">Create an Account</CardTitle>
          <CardDescription>Join Storefront Vista today!</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="name">Full Name</FormLabel>
                    <FormControl>
                      <Input id="name" placeholder="John Doe" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                    <FormControl>
                      <Input id="confirmPassword" type="password" placeholder="••••••••" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full text-lg py-3" disabled={isLoading}>
                {isLoading ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Registering...</>
                ) : (
                  <><UserPlus className="mr-2 h-5 w-5" /> Create Account</>
                )}
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Already have an account?{' '}
                <Button variant="link" asChild className="p-0 h-auto">
                  <Link href="/login">Log in here</Link>
                </Button>
              </p>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
