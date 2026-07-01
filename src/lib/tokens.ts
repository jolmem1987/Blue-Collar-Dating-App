import { randomBytes } from "crypto";
import { prisma } from "./prisma";

export async function createToken(userId: string, type: "EMAIL_VERIFY" | "PASSWORD_RESET") {
  const token = randomBytes(32).toString("hex");
  const hours = type === "EMAIL_VERIFY" ? 24 : 1;
  const expires = new Date(Date.now() + hours * 60 * 60 * 1000);
  await prisma.token.deleteMany({ where: { userId, type } });
  await prisma.token.create({ data: { userId, token, type, expires } });
  return token;
}

export async function consumeToken(token: string, type: "EMAIL_VERIFY" | "PASSWORD_RESET") {
  const row = await prisma.token.findUnique({ where: { token } });
  if (!row || row.type !== type || row.expires < new Date()) return null;
  await prisma.token.delete({ where: { id: row.id } });
  return row.userId;
}
