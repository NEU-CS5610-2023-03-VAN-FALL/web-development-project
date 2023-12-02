import * as dotenv from 'dotenv'
dotenv.config()
import express from "express";
import pkg from "@prisma/client";
import morgan from "morgan";
import cors from "cors";
import { auth } from  'express-oauth2-jwt-bearer'

// this is a middleware that will validate the access token sent by the client
const requireAuth = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER,
  tokenSigningAlg: 'RS256'
});

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// this is a public endpoint because it doesn't have the requireAuth middleware
app.get("/ping", (req, res) => {
  res.send("pong");
});


app.get("/users", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;

  try {
    const user = await prisma.user.findUnique({
      where: {
        auth0Id,
      },
    });

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.put("/users/:auth0Id", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const { name, address, email } = req.body;
  const updatedUser = await prisma.user.update({
    where: { auth0Id },
    data: {
      name,
      address,
      email,
    },
  });

  try {
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.post("/verify-user", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const email = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/email`];
  const name = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/name`];

  console.log(req.auth.payload);

  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  if (user) {
    res.json(user);
  } else {
    const newUser = await prisma.user.create({
      data: {
        email,
        auth0Id,
        name,
      },
    });

    res.json(newUser);
  }
});


app.get("/orders", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;

  try {
    const user = await prisma.user.findUnique({
      where: {
        auth0Id,
      },
      select: {
        orders: {
          select: {
            orderId:true,
            orderDate: true,
            totalAmount: true,
            
          },
        },
      },
    });

    res.json(user.orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

///////////////////////////////////////////////////
app.post("/orders", requireAuth, async (req, res) => {
  try {
    const auth0Id = req.auth.payload.sub;
    const { totalAmount, products } = req.body;

    // Find the user based on the auth0Id
    const user = await prisma.user.findUnique({
      where: { auth0Id },
    });

    // Create a new order for the found user
    const newOrder = await prisma.order.create({
      data: {
        orderDate: new Date(),
        totalAmount,
        user: {
          connect: { userId: user.userId },
        },
      },
    });

    // Associate existing products with the order
    const existingProducts = await Promise.all(
      products.map(async (product) => {
        const existingProduct = await prisma.product.findUnique({
          where: { productId: product.productId },
        });
        return existingProduct;
      })
    );

    await prisma.order.update({
      where: { orderId: newOrder.orderId },
      data: {
        products: {
          connect: existingProducts.map((existingProduct) => ({
            productId: existingProduct.productId,
          })),
        },
      },
    });

    res.json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get("/orders/:orderId", requireAuth, async (req, res) => {
  const orderId = parseInt(req.params.orderId);

  try {
    const orderDetails = await prisma.order.findUnique({
      where: {
        orderId,
      },
      include: {
        products: true,
      },
    });

    res.json(orderDetails);
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get("/products", async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get("/most-popular-drink", async (req, res) => {
  try {
    const popularProducts = await prisma.product.findMany({
      include: {
        orders: true,
      },
    });

    // Sort products by the number of orders in descending order
    popularProducts.sort((a, b) => b.orders.length - a.orders.length);

    if (popularProducts.length > 0) {
      const mostPopularDrink = {
        productName: popularProducts[0].productName,
        price: popularProducts[0].price,
        imageUrl: popularProducts[0].imageUrl,
      };

      res.json(mostPopularDrink);
    } else {
      res.json({ message: "No products found" });
    }
  } catch (error) {
    console.error("Error fetching most popular drink:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});




app.listen(8000, () => {
  console.log("Server running on http://localhost:8000 🎉 🚀");
});
