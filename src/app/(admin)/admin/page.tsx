import { PanelAdmin } from "@/components/admin/panel";

/**
 * Panel de administración.
 *
 * Todo ocurre en el cliente contra Supabase: quién puede hacer qué lo deciden
 * las políticas de seguridad de la base, no este código. Aunque alguien abra
 * esta ruta sin sesión, no puede leer pedidos ni modificar el catálogo.
 */
export default function PaginaAdmin() {
  return <PanelAdmin />;
}
