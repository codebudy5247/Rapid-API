const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

// GET api/contacts
router.get("/", async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};
  const count = await Contact.countDocuments({ ...keyword });
  try {
    const contacts = await Contact.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res
      .status(200)
      .json({ contacts, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// POST api/contacts
router.post("/", async (req, res) => {
  const { name, email, avatar, phone, type } = req.body;

  try {
    const newContact = new Contact({
      name,
      email,
      avatar,
      phone,
      type,
    });

    const contact = await newContact.save();

    res.json(contact);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
