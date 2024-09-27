import { FastifyInstance } from "fastify";
import { z } from "zod";
import brcypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function Cadastro(app: FastifyInstance) {
  // Definindo o esquema Zod
  const userSchema = z.object({
    name: z.string().min(3),
    email: z.string().email().transform(value => value.toLowerCase()),
    password: z.string().min(4)
  });

  // Definindo a rota
  app.post("/portal/cadastro", async (request, reply) => {
    const { name, email, password } = request.body;

    // Validação manual
    const parseResult = userSchema.safeParse({ email, password, name });
    if (!parseResult.success) {
      return reply.status(400).send(parseResult.error);
    }
    const lowerEmail = email.toLowerCase()
    const hashPassword = await brcypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email: lowerEmail,
        password: hashPassword,
      },
    });
    reply.code(201).send({ message: "Cadastro realizado com sucesso. " });
  });
}
