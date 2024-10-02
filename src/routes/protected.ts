import fastify, { FastifyInstance } from "fastify";
import AuthService from "../services/auth-service";

const app = fastify();

export async function Protected(app: FastifyInstance) {
  app.get("/protected", async (request, reply) => {
    const sessionValid = await AuthService.isSessionValid(request);
    if (!sessionValid) {
      return reply.status(401).send({ error: "Não autorizado" });
    }
    return reply.send({ message: "Autenticação bem sucedida." });
  });
}
