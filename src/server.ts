import fastify from "fastify";
import { Cadastro } from "./routes/cadastro";
import { Login } from "./routes/login";
import { Protected } from "./routes/protected";
// Certifique-se de ajustar o caminho
import cookie from '@fastify/cookie'
const app = fastify();

app.register(cookie)

app.options("/*", (request, reply) => {
  reply.header("Access-Control-Allow-Origin", "http://localhost:3000");
  reply.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  reply.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  reply.header("Access-Control-Allow-Credentials", "true");
  reply.send();
});

app.addHook("preHandler", (request, reply, done) => {
  reply.header("Access-Control-Allow-Origin", "http://localhost:3000");
  reply.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  reply.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  reply.header("Access-Control-Allow-Credentials", "true");
  done();
});

app.register(Cadastro);
app.register(Login);
app.register(Protected);

app.listen({ port: 3333 }).then(() => {
  console.log("Server running");
});
