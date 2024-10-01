import { FastifyInstance } from "fastify";
import { z } from "zod";
import brcypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function Cadastro(app: FastifyInstance) {
  // Definindo o esquema Zod
  const userSchema = z.object({
    name: z.string().min(3).trim(),
    email: z
      .string()
      .email().trim(),
    password: z.string().min(6),
  });

  // Definindo a rota
  app.post("/portal/cadastro", async (request, reply) => {
    const { name, email, password } = request.body;

    //Validação zod
    const parseResult = userSchema.safeParse({ email, password, name });
    if (!parseResult.success) {
      return reply.status(400).send({ message: "Dados inválidos" });
    }

    const lowerEmail = email.toLowerCase();

    const userEmail = await prisma.user.findUnique({
      where: {
        email: lowerEmail,
      },
    });
    if (userEmail) {
      return reply.status(400).send({ message: "Usuario ja cadastrado" });
    }

    const hashPassword = await brcypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email: lowerEmail,
        password: hashPassword,
      },
    });
    return reply.code(201).send({ message: "Cadastro realizado com sucesso. " });
  });
}
