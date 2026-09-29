"use client";

import { useActionState, useState } from "react";
import { Button, Field } from "@/components/ui";
import { loginAction, type FormResult } from "../actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState<FormResult, FormData>(loginAction, {});
  const [password, setPassword] = useState("");

  return (
    <form action={action} className="mt-8 space-y-6">
      <Field
        id="password"
        type="password"
        label="رمز عبور"
        required
        autoComplete="current-password"
        value={password}
        onChange={setPassword}
        error={state.error}
      />
      <Button type="submit" disabled={pending || !password}>
        {pending ? "در حال ورود…" : "ورود"}
      </Button>
    </form>
  );
}
