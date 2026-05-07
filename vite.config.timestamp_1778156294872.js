// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
var vite_config_default = defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") }
  }
});
export {
  vite_config_default as default
};
