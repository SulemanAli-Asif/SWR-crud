import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const POST = async (req: Request) => {
  try {
    const { name, category, inStock, quantity } = await req.json();

    // Log the incoming data for debugging
    console.log("Received data:", { name, category, inStock, quantity });

    // Ensure quantity is an integer
    const newProduct = await prisma.products.create({
      data: {
        name,
        category,
        inStock,
        quantity: parseInt(quantity, 10),
      },
    });

    return new Response(JSON.stringify(newProduct), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Error creating product:", err.message); // Log the error
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
