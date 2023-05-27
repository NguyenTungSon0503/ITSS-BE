// const express = require("express");
// const router = express.Router();
// router.use(express.json());
import { cloudinary } from "../utils/cloudinary.js";

import express from "express";
const router = express.Router();
router.use(express.json());

// const { cloudinary } = require("../utils/cloudinary");

//if wanna domain is /api/images/get then add /get behind
router.get("/", async (req, res) => {
  const { resources } = await cloudinary.search
    //folder with preset
    .expression("folder:test")
    .sort_by("public_id", "desc")
    .max_results(30)
    .execute();

  const publicIds = resources.map((file) => file.public_id);
  res.send(publicIds);
});

router.post("/", async (req, res) => {
  console.log(req.body);
  try {
    const fileStr = req.body.data;
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      //create new preset in cloudinary
      upload_preset: "test_preset",
    });
    console.log(uploadResponse);
    res.json({ msg: "uploaded successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

export default router;