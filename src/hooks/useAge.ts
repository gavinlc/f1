import { useMemo } from 'react';

/**
 * Hook to calculate age from a date of birth
 * @param dateOfBirth - Date of birth in ISO format (YYYY-MM-DD)
 * @returns The calculated age
 */
export function useAge(dateOfBirth: string): number {
  return useMemo(() => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Adjust age if birthday hasn't occurred this year
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }, [dateOfBirth]);
}
