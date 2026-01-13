import { useMemo } from "react";

export type PasswordStrength = "weak" | "medium" | "strong" | "very-strong";

export function usePasswordStrength(password: string) {
  return useMemo(() => {
    if (!password) {
      return {
        score: 0,
        label: "weak" as PasswordStrength,
        percent: 0,
      };
    }

    let score = 0;

    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    let label: PasswordStrength = "weak";

    if (score >= 5) label = "very-strong";
    else if (score >= 4) label = "strong";
    else if (score >= 3) label = "medium";

    return {
      score,
      label,
      percent: (score / 5) * 100,
    };
  }, [password]);
}
