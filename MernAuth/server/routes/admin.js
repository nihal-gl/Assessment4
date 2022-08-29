const router = require("express").Router();
const { Admins, validate } = require("../models/admins");
const bcrypt = require("bcrypt");

router.post("/admins", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const admin = await Admins.findOne({ email: req.body.email });
		if (admin)
			return res
				.status(409)
				.send({ message: "Admin with given email already Exist!" });

		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt);

		await new User({ ...req.body, password: hashPassword }).save();
		res.status(201).send({ message: "Admin created successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});

module.exports = router;