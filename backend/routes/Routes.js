import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  console.log("Recieved home path");
});

export default router;
