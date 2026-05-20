"use client";

import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader } from "@/app/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import Image from "next/image";
import { z } from "zod";
import logo from "../../../public/logo.jpeg";

import { Input } from "@/app/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

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
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (result?.error) {
      setLoading(false);
      toast.error(
        result.status === 401
          ? "Usuário ou senha inválida"
          : "Internal server error",
        {
          autoClose: 2000,
        },
      );
      return;
    }
    router.replace("/");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-hero opacity-90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(0.72_0.12_195/0.3),transparent_50%)]" />

      <div className="relative grid md:grid-cols-2 gap-12 max-w-5xl w-full items-center">
        <div className="text-primary-foreground hidden md:block space-y-6">
          <h1 className="text-5xl font-bold leading-tight">
            Gestão de Ordens de Serviço
            <br />
            <span className="text-accent">simples e poderosa.</span>
          </h1>
          <p className="text-lg opacity-90 max-w-md">
            Cadastre clientes, abra ordens em segundos e acompanhe cada serviço
            do primeiro contato à entrega.
          </p>
        </div>

        <Card className="p-8 shadow-glow bg-card-gradient border-border/50">
          <CardHeader className="-mt-10">
            <Image
              src={logo}
              alt="Logomarca da empresa Werk"
              width={280}
              height={280}
            />
          </CardHeader>
          <CardContent className="w-full">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 -mt-10"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className=" w-full">
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
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && (
                    <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  Entrar
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
