import { FastifyRequest } from "fastify";
import { jwtVerify, SignJWT } from "jose";

async function openSessionToken(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.error("Erro ao verificar o token:", error);
    throw new Error("Token inválido");
  }
}

async function CreateSessionToken(payload = {}) {
  const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
  const session = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1d")
    .sign(secret);
  return session;
}

async function isSessionValid(request: FastifyRequest) {
  const sessionCookie = request.cookies.session;

  if (sessionCookie) {
    const { value } = sessionCookie;
    const { exp } = await openSessionToken(value);
    if (!exp) {
      return;
    }
    const currentDate = Math.floor(Date.now() / 1000);

    return exp > currentDate;
  }

  return false;
}

const AuthService = {
  CreateSessionToken,
  isSessionValid,
  openSessionToken,
};
export default AuthService;
