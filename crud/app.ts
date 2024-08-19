import { Application } from "./deps.ts";
import router from "./routes.ts";
const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());
const port = Number(Deno.env.get("PORT")) || 8000;
console.log(`Server is running on port ${port}`);
await app.listen({ port });