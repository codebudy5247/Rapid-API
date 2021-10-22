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

//UPDATE /api/contacts
router.put('/:id', async (req, res) => {


	const { name, email,avatar, phone, type } = req.body;
	const contactFields = {};
	if (name) contactFields.name = name;
	if (email) contactFields.email = email;
        if (avatar) contactFields.avatar = avatar;
	if (phone) contactFields.phone = phone;
	if (type) contactFields.type = type;

	try {
		let contact = await Contact.findById(req.params.id);

		if (!contact) return res.status(404).json({ msg: 'Contact not found' });


		contact = await Contact.findByIdAndUpdate(
			req.params.id,
			{ $set: contactFields },
			{ new: true }
		);

		res.json(contact);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

//DELETE /api/contacts
router.delete('/:id', auth, async (req, res) => {
	try {
		const contact = await Contact.findById(req.params.id);

		if (!contact) return res.status(404).json({ msg: 'Contact not found' });

		await Contact.findByIdAndRemove(req.params.id);

		res.json({ msg: 'Contact removed' });
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

module.exports = router;
