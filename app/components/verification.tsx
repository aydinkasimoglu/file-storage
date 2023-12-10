"use client";

import { CognitoUser } from "amazon-cognito-identity-js";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { z, ZodError } from "zod";
import SubmitButton from "./submitButton";

const schema = z.object({
  code: z.string().min(6, "Code must be 6 digits"),
});

type FormValues = z.infer<typeof schema>;

type VerificationProps = {
  user: CognitoUser;
};

export default function Verification({ user }: VerificationProps) {
  const router = useRouter();

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

  const onSubmit: SubmitHandler<FormValues> = ({ code }) => {
    if (user) {
      user.confirmRegistration(code, true, (error, data) => {
        if (error) {
          console.error("Failed to verify!", error);
        } else {
          console.log("Verified!", data);

          alert("Redirecting to login page");

          router.push("/login");
        }
      });
    } else {
      console.error("No user!");
    }
  };

  return (
    <section className="flex flex-col justify-center">
      <h1>Verification</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <label htmlFor="code" className="select-none text-sm text-foreground md:text-base">Code</label>
        <input
          {...register("code")}
          type="text"
          id="code"
          placeholder="••••••"
          className="rounded-md bg-input px-4 py-2 indent-8 text-sm font-semibold no-underline caret-black outline-none transition-all hover:bg-input-hover dark:text-white dark:caret-white"
          aria-invalid={errors.code ? "true" : "false"}
          required
        />

        {errors.code && (
          <p className="text-xs text-red-500" role="alert">
            {String(errors.code.message)}
          </p>
        )}

        <SubmitButton isSubmitting={isSubmitting}>Verify</SubmitButton>
      </form>
    </section>
  );
}
