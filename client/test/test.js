app.post("/test", async (req, res) => {
    const { name, email } = req.body;
  
    try {
      const test = await prisma.user.create({
        data: {
            name,
            email
        },
      });
  
      res.status(201).json(test);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.listen(8000, () => {
    console.log("Server running on http://localhost:8000 🎉 🚀");
  });