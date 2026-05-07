/// <reference types="vite/client" />
declare module "*.jsx" {
  const Component: React.ComponentType<unknown>;
  export default Component;
}
declare module "*.js";
