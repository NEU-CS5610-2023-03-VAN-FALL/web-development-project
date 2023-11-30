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


app.put("/users/:auth0Id", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const { name, address, email } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { auth0Id },
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

//有问题
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
    try {
      const newUser = await prisma.user.create({
        data: {
          auth0Id,
          name,
          email,
          
        },
      });
    
      res.json(newUser);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
});


////////////////////////////////////////////////////////////////////////
//for order(get, update, delete, create)
app.get("/orders", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;

  try {
    const user = await prisma.user.findMany({
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

// 有问题
app.post("/orders", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;

  const { products, totalAmount} = req.body;

  if (!products && !totalAmount) {
    res.status(400).send("title is required");
  } else {
    const newOrder = await prisma.order.create({
      data: {
        products,
        totalAmount,
        user: { connect: { auth0Id } },
      },
    });

    res.status(201).json(newOrder);
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

app.get("/most-popular-drink", async (req, res) => {
  try {
    const popularProducts = await prisma.product.findMany({
      include: {
        orders: true,
      },
    });
    popularProducts.sort((a, b) => b.orders.length - a.orders.length);
    const mostPopularDrink = {
      productName: popularProducts[0].productName,
      price: popularProducts[0].price,
      imageUrl: popularProducts[0].imageUrl,
    };
    res.json(mostPopularDrink);
  } catch (error) {
    console.error("Error fetching most popular drink:", error);
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
