import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Arquitectura por capas: las dependencias apuntan hacia adentro.
  // dominio  <-  aplicacion  <-  infraestructura / servidor / app y componentes
  {
    files: ["src/dominio/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/aplicacion/*",
                "@/infraestructura/*",
                "@/servidor/*",
                "@/config/*",
                "@/data/*",
                "@/app/*",
                "@/components/*",
                "@/cliente/*",
                "next",
                "next/*",
                "react",
                "react-*",
                "@supabase/*",
              ],
              message:
                "El dominio son reglas del negocio puras: no puede depender de otras capas, de Next, de React ni de Supabase.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/aplicacion/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/infraestructura/*",
                "@/servidor/*",
                "@/app/*",
                "@/components/*",
                "@/cliente/*",
                "@supabase/*",
              ],
              message:
                "La aplicación habla con el exterior solo por los contratos de aplicacion/puertos.ts.",
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Skills de diseño instaladas desde otros repositorios: no son código del sitio.
    ".claude/**",
  ]),
]);

export default eslintConfig;
