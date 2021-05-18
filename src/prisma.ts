import { PrismaClient } from "@prisma/client";

interface CustomNodeJsGlobal extends NodeJS.Global {
  prisma: PrismaClient;
}

// Node's global env can be used to store prisma client during development
// to stop making new instantiations while hot reloading.
declare const global: CustomNodeJsGlobal;

const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query", "info", "warn"],
  });

if (process.env.NODE_ENV === "development") global.prisma = prisma;

export { prisma, PrismaClient };
