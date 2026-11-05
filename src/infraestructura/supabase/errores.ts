/**
 * Traduce los errores de Supabase y de la red a un mensaje que el dueño
 * entienda y sepa qué hacer con él. Supabase responde en inglés y en jerga
 * ("JWT expired", "violates check constraint"), y el navegador peor
 * ("Failed to fetch").
 *
 * Cada mensaje dice qué pasó y qué hacer. Cuando no se reconoce el error, se
 * muestra el original al final, entre paréntesis, para poder buscarlo.
 */
export function mensajeDeError(error: unknown, accion = "guardar"): string {
  const texto =
    error instanceof Error
      ? error.message
      : typeof error === "object" && error && "message" in error
        ? String((error as { message: unknown }).message)
        : String(error ?? "");

  if (/failed to fetch|networkerror|network request failed|load failed|fetch failed/i.test(texto)) {
    return `Sin conexión: no se pudo ${accion}. Revisa el internet e intenta de nuevo; lo que escribiste sigue aquí.`;
  }
  if (/jwt expired|invalid jwt|refresh token|not authenticated|auth session missing/i.test(texto)) {
    return "Tu sesión venció. Sal y vuelve a entrar; antes copia lo que escribiste si no lo has guardado.";
  }
  if (/permission denied|row-level security|not authorized|42501/i.test(texto)) {
    return `No se pudo ${accion}: esta cuenta no tiene permisos de administrador.`;
  }
  if (/duplicate key|unique constraint|already exists/i.test(texto)) {
    return "Ya existe uno con esa dirección. Usa otro nombre o cambia la dirección.";
  }
  if (/check constraint|violates|invalid input syntax/i.test(texto)) {
    return "Algún dato no tiene el formato esperado. Revisa los campos e intenta de nuevo.";
  }
  if (/rate limit|too many requests/i.test(texto)) {
    return "Demasiados intentos seguidos. Espera un minuto e intenta de nuevo.";
  }
  if (/email not confirmed/i.test(texto)) {
    return "Este correo no está confirmado en Supabase. Confírmalo en Authentication → Users.";
  }
  if (/invalid login credentials/i.test(texto)) {
    return "Correo o contraseña incorrectos.";
  }
  return `No se pudo ${accion}. Intenta de nuevo en un momento${texto ? ` (${texto})` : ""}.`;
}
