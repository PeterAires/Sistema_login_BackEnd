import fastify from "fastify";
import { Cadastro } from "./routes/cadastro";
import { Login } from "./routes/login";

const app = fastify()

app.register(Cadastro)
app.register(Login)

app.listen({ port: 3333 }).then(() => {
  console.log("Server running");
});