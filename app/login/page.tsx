"use client";
import { useContext } from "react";
import { SessionContext } from "../components/session";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { ZodError, z } from "zod";
import SubmitButton from "../components/submitButton";
import { useRouter } from "next/navigation";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[0-9])(?=.*[!@#%^&*()_+={}\[\]:;<>,.?/"'\\|~-])(?=.*[a-z])(?=.*[A-Z]).*$/
    ),
});

type FormValues = z.infer<typeof schema>;

export default function Login() {
  const router = useRouter();
  const { authenticate } = useContext(SessionContext);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    resolver: async (data) => {
      try {
        const validated = await schema.parseAsync(data);
        return { values: validated, errors: {} };
      } catch (error) {
        return {
          values: {},
          errors: (error as ZodError).formErrors.fieldErrors,
        };
      }
    },
  });

  const onSubmit: SubmitHandler<FormValues> = ({ email, password }) => {
    authenticate(email, password)
      .then((data) => {
        console.log("Logged in!", data);
        router.push("/");
      })
      .catch((error) => {
        console.error("Failed to login!", error);
      });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <label
          htmlFor="email"
          className="select-none text-sm text-foreground md:text-base"
        >
          Email
        </label>
        <input
          {...register("email")}
          id="email"
          type="email"
          placeholder="your@email.com"
          autoComplete="email"
          className="rounded-md bg-input px-4 py-2 indent-8 text-sm font-semibold no-underline caret-black outline-none transition-all hover:bg-input-hover dark:text-white dark:caret-white"
          aria-invalid={errors.email ? "true" : "false"}
          required
        />

        {errors.email && (
          <p className="text-xs text-red-500" role="alert">
            {String(errors.email.message)}
          </p>
        )}

        <label
          htmlFor="password"
          className="select-none text-sm text-foreground md:text-base"
        >
          Password
        </label>
        <input
          {...register("password")}
          id="password"
          type="password"
          placeholder="••••••"
          aria-invalid={errors.password ? "true" : "false"}
          className="rounded-md bg-input px-4 py-2 indent-8 text-sm font-semibold no-underline caret-black outline-none transition-all hover:bg-input-hover dark:text-white dark:caret-white"
        />

        {errors.password && (
          <p className="text-xs text-red-500" role="alert">
            {String(errors.password.message)}
          </p>
        )}

        <SubmitButton isSubmitting={isSubmitting}>Login</SubmitButton>
      </form>
      <Link href={"/signup"}>Sign up</Link>
    </main>
  );
}
