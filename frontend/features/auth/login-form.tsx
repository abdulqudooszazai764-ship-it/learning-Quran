"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { Spinner } from "@/components/ui/spinner";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/hooks/use-auth";
import { ApiError, formatApiError } from "@/lib/api";
import { login } from "@/lib/auth";
import { homeFor, safeNextPath } from "@/lib/redirect";

const schema = z.object({
  username: z.string().trim().min(1, "required"),
  password: z.string().min(1, "required"),
  rememberMe: z.boolean(),
});
type FormValues = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const next = useSearchParams().get("next");
  const { refresh } = useAuth();
  const { tr } = useLanguage();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { rememberMe: true },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await login({ username: values.username, password: values.password, rememberMe: values.rememberMe });
      const me = await refresh();
      if (!me) throw new ApiError("Signed in, but your profile could not be loaded.", 500);
      router.replace(safeNextPath(next, homeFor(me.role)));
    } catch (err) {
      if (err instanceof ApiError && err.status === 429) {
        toast.error(tr("tooManyAttempts"));
        return;
      }
      toast.error(
        err instanceof ApiError && err.status === 401
          ? "Incorrect username or password."
          : formatApiError(err, "Login failed. Try again.")
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="username">{tr("username")}</Label>
        <Input
          id="username"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          aria-invalid={!!errors.username}
          {...register("username")}
        />
        {errors.username && <p className="text-sm text-destructive">{tr("requiredField")}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">{tr("password")}</Label>
        <PasswordInput
          id="password"
          autoComplete="current-password"
          placeholder="••••••••"
          aria-invalid={!!errors.password}
          {...register("password")}
        />
        {errors.password && <p className="text-sm text-destructive">{tr("requiredField")}</p>}
      </div>

      <label className="flex select-none items-center gap-2 text-sm text-muted-foreground">
        <Checkbox
          checked={watch("rememberMe")}
          onCheckedChange={(checked) => setValue("rememberMe", checked === true)}
        />
        {tr("keepSignedIn")}
      </label>

      <Button type="submit" disabled={isSubmitting} className="mt-1 h-11 w-full">
        {isSubmitting ? (
          <>
            <Spinner size="sm" />
            {tr("signingIn")}
          </>
        ) : (
          tr("signIn")
        )}
      </Button>
    </form>
  );
}
