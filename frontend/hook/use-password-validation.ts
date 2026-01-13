import { useMemo } from "react";

type PasswordRule = {
  label: string;
  passed: boolean;
};

export function usePasswordValidation(
  password: string,
  confirmPassword?: string
) {
  const rules: PasswordRule[] = useMemo(() => {
    return [
      {
        label: "At least 8 characters",
        passed: password.length >= 8,
      },
      {
        label: "One uppercase letter",
        passed: /[A-Z]/.test(password),
      },
      {
        label: "One lowercase letter",
        passed: /[a-z]/.test(password),
      },
      {
        label: "One number",
        passed: /\d/.test(password),
      },
      {
        label: "One special character",
        passed: /[^A-Za-z0-9]/.test(password),
      },
    ];
  }, [password]);

  const strength = useMemo(() => {
    const passedCount = rules.filter((r) => r.passed).length;

    if (passedCount <= 2) return "weak";
    if (passedCount <= 4) return "medium";
    return "strong";
  }, [rules]);

  const strengthScore = useMemo(() => {
    return rules.filter((r) => r.passed).length;
  }, [rules]);

  const isMatch = useMemo(() => {
    if (!confirmPassword) return true;
    return password === confirmPassword;
  }, [password, confirmPassword]);

  return {
    rules,
    strength,
    strengthScore,
    isMatch,
    isStrong: strength === "strong",
  };
}
