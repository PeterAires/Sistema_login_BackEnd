import fastify from "fastify";
import { Cadastro } from "./routes/cadastro";
import { Login } from "./routes/login";
import fastifyCookie from "@fastify/cookie";

const app = fastify()

app.register(Cadastro)
app.register(Login)
app.register(fastifyCookie)

app.listen({ port: 3333 }).then(() => {
  console.log("Server running");
});