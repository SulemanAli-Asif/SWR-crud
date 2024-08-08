import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const product = await prisma.products.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!product) {
      return new Response("Prompt not found", { status: 404 });
    }
    return new Response(JSON.stringify(prompt), { status: 200 });
  } catch (err) {
    return new Response("Failed to fetch response", { status: 500 });
  }
};

export const PATCH = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  const { name, category, inStock, quantity } = await req.json();
  try {
    const existingProduct = await prisma.products.findUnique({
      where: { id: parseInt(params.id) },
    });
    if (!existingProduct) {
      new Response("Prompt not found", { status: 404 });
    }

    const updatedProduct = await prisma.products.update({
      where: { id: parseInt(params.id) },
      data: { name, category, inStock, quantity },
    });

    return new Response(JSON.stringify(updatedProduct), { status: 200 });
  } catch (err) {
    return new Response("Failed to fetch response", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    await prisma.products.delete({
      where: { id: parseInt(params.id) },
    });

    return new Response("Prompt deleted", { status: 200 });
  } catch (err) {
    return new Response("Failed to fetch response", { status: 500 });
  }
};
