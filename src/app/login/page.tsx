"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import Image from "next/image";
import logo from "../../../public/logo.jpeg";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import { Button } from "@/app/components/ui/button";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/app/components/ui/input";
import { useForm } from "react-hook-form";
import { api } from "@/services/api/api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

interface Inputs {
  email: string;
  password: string;
}
const formSchema = z.object({
  email: z.string().min(1, "Email obrigatório").email("E-mail não válido"),
  password: z.string().min(6, "Precisa ter no mínimo 6 caracteres"),
});

export default function Login() {
  const { handleSubmit, register } = useForm<Inputs>();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (result?.error) {
      console.error(result.error);

      toast.error(
        result.status === 401
          ? "Usuário ou senha inválida"
          : "Internal server error",
        {
          autoClose: 2000,
        }
      );
      return;
    }
    router.replace("/");
  };

  return (
    <div className="flex justify-center items-center h-dvh">
      <Card className="max-w-xl w-full flex  m-8 flex-col justify-center items-center">
        <CardHeader>
          <Image
            src={logo}
            alt="Logomarca da empresa Werk"
            width={280}
            height={280}
          />
        </CardHeader>
        <CardContent className="w-full -mt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="mb-4 w-full">
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full"
                        placeholder="Digite seu email"
                        {...register("email")}
                        {...field}
                      />
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite seu password"
                        type="password"
                        {...register("password")}
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button className="mt-6" type="submit">
                  Entrar
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
