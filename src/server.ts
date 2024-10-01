import fastify from "fastify";
import { Cadastro } from "./routes/cadastro";
import { Login } from "./routes/login";
import fastifyCookie from "@fastify/cookie";

const app = fastify()

app.options("/*", (request, reply) => {
  reply.header("Access-Control-Allow-Origin", "http://localhost:3000");
  reply.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  reply.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  reply.send();
});

app.addHook("preHandler", (request, reply, done) => {
  reply.header("Access-Control-Allow-Origin", "http://localhost:3000");
  reply.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  reply.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  done();
});

app.register(Cadastro)
app.register(Login)
app.register(fastifyCookie)

app.listen({ port: 3333 }).then(() => {
  console.log("Server running");
});