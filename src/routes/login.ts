import { FastifyInstance } from "fastify";
import { z } from "zod";
import bcrypt from "bcrypt"; // Correção do nome
import cookie from "@fastify/cookie";
import { PrismaClient } from "@prisma/client";
import AuthService from "../services/auth-service";

const prisma = new PrismaClient();

export async function Login(app: FastifyInstance) {
  // Registrar o plugin de cookies
  app.register(cookie);

  // Definindo o esquema Zod
  const userSchema = z.object({
    email: z.string().email(),
    password: z.string().min(4),
  });

  // Definindo a rota
  app.post("/portal/login", async (request, reply) => {
    const { email, password } = request.body;

    // Validação manual
    const parseResult = userSchema.safeParse({ email, password });
    if (!parseResult.success) {
      return reply.status(400).send(parseResult.error);
    }

    const lowerEmail = email.toLowerCase();

    const user = await prisma.user.findUnique({
      where: {
        email: lowerEmail,
      },
    });

    if (!user) {
      return reply.status(404).send({ error: "Usuário não encontrado" }); // Uso de reply
    }

    const isMatch = await bcrypt.compare(password, user.password); // Correção do nome
    if (!isMatch) {
      return reply.status(401).send({ error: "Senha ou e-mail inválido" }); // Uso de reply
    }

    const token = await AuthService.CreateSessionToken({
      sub: user.id,
      name: user.name,
      email: user.email,
    });

    // Lógica aqui - Cookie Criado
    reply.setCookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Apenas em produção
      maxAge: 86400, // 1 dia
      path: "/", // Disponível em todo o domínio
    });

    return { userId: user.id };
  });
}
