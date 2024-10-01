import fastify from "fastify";
import { Cadastro } from "./routes/cadastro";
import { Login } from "./routes/login";

const app = fastify();

app.options("/*", (request, reply) => {
  reply.header("Access-Control-Allow-Origin", "http://localhost:3000");
  reply.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  reply.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  reply.header("Access-Control-Allow-Credentials", "true"); // Adicione este cabeçalho
  reply.send();
});

app.addHook("preHandler", (request, reply, done) => {
  reply.header("Access-Control-Allow-Origin", "http://localhost:3000");
  reply.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  reply.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  reply.header("Access-Control-Allow-Credentials", "true"); // Adicione este cabeçalho
  done();
});

app.register(Cadastro);
app.register(Login);

app.listen({ port: 3333 }).then(() => {
  console.log("Server running");
});
