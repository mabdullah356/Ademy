const express = require("express");
const { createCheckoutSession, stripeWebhook, getMyOrders, verifySession } = require("../Controllers/order.controller");
const router = express.Router();
const { isUserLogin } = require("../Middlewares/auth.middleware");

router.post("/checkout", express.json(), isUserLogin, createCheckoutSession);
router.get("/me", isUserLogin, getMyOrders);
router.post("/verify-session", isUserLogin, verifySession);

module.exports = router;
