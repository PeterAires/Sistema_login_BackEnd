import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import brcypt from "bcrypt";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function Login(app: FastifyInstance) {
  // Definindo o esquema Zod
  const userSchema = z.object({
    email: z.string().email(),
    password: z.string().min(4)
  });

  // Definindo a rota
  app.get('/portal/login', async (request, reply) => {
    const { email, password } = request.params;

    // Validação manual
    const parseResult = userSchema.safeParse({ email, password });
    if (!parseResult.success) {
      return reply.status(400).send(parseResult.error);
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      }
    })
    if (!user) {
      throw new Error('Usuario não encontrado') 
    }

    const isMath = await brcypt.compare(password, user.password)
    if (!isMath) {
      console.log('senha ou email invalido')
    }
    console.log('login efetuado')
    // Lógica aqui
    return { userId: user.id };
  });
}
