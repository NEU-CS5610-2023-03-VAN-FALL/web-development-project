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

////////////////////////////////////////////////////////////////////////
//for user(get, update, delete) 
app.get("/users", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;

  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  res.json(user);
});

app.delete("/user/:userId", requireAuth, async (req, res) => {
  const userId = parseInt(req.params.userId);
  const deletedUser = await prisma.user.delete({
    where: {
      userId,
    },
  });
  res.json(deletedUser);
});

app.put("/user/:userId", requireAuth, async (req, res) => {
  const userId = parseInt(req.params.userId);
  const { name, address, email } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { userId },
      data: {
        name,
        address,
        email,
      },
    });

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


////////////////////////////////////////////////////////////////////////
//for order(get, update, delete, create)
app.get("/orders", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;

  try {
    const user = await prisma.user.findUnique({
      where: {
        auth0Id,
      },
      include: {
        orders: true,
      },
    });

    res.json(user.orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.post("/orders", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;

  const { title } = req.body;

  if (!title) {
    res.status(400).send("title is required");
  } else {
    const newItem = await prisma.order.create({
      data: {
        title,
        user: { connect: { auth0Id } },
      },
    });

    res.status(201).json(newItem);
  }
});


app.delete("/orders/:orderId", requireAuth, async (req, res) => {
  const orderId = parseInt(req.params.orderId);

  try {
    const deletedOrder = await prisma.order.delete({
      where: {
        orderId,
      },
    });

    res.json(deletedOrder);
  } catch (error) {
    console.error("Error deleting order:", error);
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


app.put("/orders/:orderId", requireAuth, async (req, res) => {
  const id = req.params.id;
  const { title } = req.body;
  const updatedItem = await prisma.order.update({
    where: {
      id,
    },
    data: {
      title,
    },
  });
  res.json(updatedItem);
});

////////////////////////////////////////////////////////////////////////
//for product(get, delete )
app.get("/products", async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/products", async (req, res) => {
  const { productName, description, price, imageUrl } = req.body;

  try {
    const newProduct = await prisma.product.create({
      data: {
        productName,
        description,
        price,
        imageUrl,
      },
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/products/:productId", async (req, res) => {
  const productId = parseInt(req.params.productId);
  const { productName, description, price, imageUrl } = req.body;

  try {
    const updatedProduct = await prisma.product.update({
      where: {
        productId,
      },
      data: {
        productName,
        description,
        price,
        imageUrl,
      },
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/products/:productId", async (req, res) => {
  const productId = parseInt(req.params.productId);

  try {
    const deletedProduct = await prisma.product.delete({
      where: {
        productId,
      },
    });

    res.json(deletedProduct);
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});




app.listen(8000, () => {
  console.log("Server running on http://localhost:8000 🎉 🚀");
});
