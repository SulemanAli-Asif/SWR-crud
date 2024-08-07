import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async (req: Request) => {
  try {
    const products = await prisma.products.findMany();

    // No need for additional transformation if inStock is already a boolean
    return new Response(JSON.stringify(products), { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return new Response("Error fetching products", { status: 500 });
  }
};
