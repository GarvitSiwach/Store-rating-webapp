require("dotenv").config();
const express = require("express");
const cors = require("cors");

require("./config/db");

const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const storeRoutes = require("./routes/store.routes");

const { authenticate } = require("./middlewares/auth.middleware");
const { authorizeRoles } = require("./middlewares/role.middleware");
const { globalErrorHandler } = require("./middlewares/error.middleware");
const storeOwnerRoutes = require("./routes/storeOwner.routes");



const app = express();


app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/owner", storeOwnerRoutes);

app.get("/", (req, res) => {
  res.json({ message: "RateWise API Running" });
});

app.get("/api/test-protected", authenticate, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user
  });
});

app.get(
  "/api/admin-test",
  authenticate,
  authorizeRoles("ADMIN"),
  (req, res) => {
    res.json({
      message: "Admin route accessed",
      user: req.user
    });
  }
);



const PORT = process.env.PORT || 5000;

app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});