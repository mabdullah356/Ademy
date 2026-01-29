const express = require("express");
const { createCheckoutSession, stripeWebhook, getMyOrders, verifySession } = require("../Controllers/order.controller");
const router = express.Router();
const { isUserLogin } = require("../Middlewares/auth.middleware");

router.post("/checkout", express.json(), isUserLogin, createCheckoutSession);
router.get("/get-my-orders", isUserLogin, getMyOrders);
router.get("/verify-session", verifySession);

module.exports = router;