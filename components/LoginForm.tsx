"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { login } from "@/app/http";
import { useRouter } from "next/navigation";
import React from "react";
import { Loader } from "./Loader";
import useUser from "@/hooks/useUser";

const formSchema = z.object({
  name: z.string().min(2, "Please enter a minimum of two characters"),
  email: z.string().email({ message: "Invalid email format" }),
});

export const LoginForm = () => {
  const router = useRouter();
  const [loading, setLoading] = React.useState<boolean>(false);
  const { user, setUser } = useUser();
  const loginForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    setUser(values, 60 * 60 * 1000, router);
    login(values).then(() => {
      loginForm.reset();
      router.push("/search");
    });
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Form {...loginForm}>
          <form
            onSubmit={loginForm.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <FormField
              control={loginForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your first and last name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={loginForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="btn-primary w-full" type="submit">
              Login
            </Button>
          </form>
        </Form>
      )}
    </>
  );
};
