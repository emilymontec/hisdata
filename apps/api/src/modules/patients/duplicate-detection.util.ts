/**
 * Detección de posibles duplicados de pacientes.
 * Es una heurística administrativa (normalización de texto + coincidencia de fecha de nacimiento),
 * NUNCA fusiona registros automáticamente: solo marca candidatos para revisión manual.
 */

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quita tildes
    .trim()
    .toLowerCase();
}

export function isLikelySamePerson(
  a: { firstName: string; lastName: string; dateOfBirth: Date },
  b: { firstName: string; lastName: string; dateOfBirth: Date },
): boolean {
  const sameBirthDate =
    a.dateOfBirth.toISOString().slice(0, 10) === b.dateOfBirth.toISOString().slice(0, 10);

  const sameName =
    normalize(a.firstName) === normalize(b.firstName) &&
    normalize(a.lastName) === normalize(b.lastName);

  return sameBirthDate && sameName;
}
