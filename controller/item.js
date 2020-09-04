const Item = require('../model/Item');
const mailHelper = require('../helper/helper-mail');
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports.postUser = async (req, res, next) => {
	let presentWorker;
	try {
		presentWorker = await Item.find({ email: req.body.obj.email }).exec();
	} catch (error) {
		return res.render('index', { error: 'none' });
	}
	if (presentWorker.length == 0) {
		if (req.body.obj.password != req.body.rePassword) {
			return res.render('index', { error: 'enter valid re password' });
		} else {
			req.body.obj.password = bcrypt.hashSync(req.body.obj.password, saltRounds);
		}
		try {
			let newItem = await Item.insertMany([ req.body.obj ]);
			mailHelper.sendMail(req.body.obj.email);
			res.render('home', { name: req.body.obj.firstName });
		} catch (error) {
			let err = error.errors[Object.keys(error.errors)[0]].path;
			res.render('index', { error: 'enter valid ' + err });
		}
	} else {
		return res.render('index', { error: 'Email Already exists. Please Login' });
	}
};

module.exports.deleteUsers = async (req, res, next) => {
	let obj = {};
	if (req.params.id !== undefined) {
		obj = { _id: req.params.id };
	}
	try {
		let a = await Item.deleteMany(obj);
		res.status(200).json({ message: 'deleted successfully' });
	} catch (error) {
		res.status(500).json({ message: 'error deleting' });
	}
};

module.exports.getUsers = async (req, res, next) => {
	let obj = {};
	if (req.params.id !== undefined) {
		obj = { _id: req.params.id };
	}
	try {
		let workers = await Item.find(obj).exec();
		res.status(200).json({ workers: workers });
	} catch (error) {
		res.status(500).json({ message: 'error getting details' });
	}
};

module.exports.updateUser = async (req, res, next) => {
	if (req.params.id !== undefined) {
		let obj = { _id: req.params.id };
		let flag = 0;
		let updatedWorker;
		try {
			let worker = await Item.findOne(obj).exec();
			console.log(req.query.update);
			console.log(req.body);
			if (req.query.update == 'password' && req.body.password) {
				worker.passord = bcrypt.hashSync(req.body.password, saltRounds);
				console.log(worker.password);
				updatedWorker = await worker.save();
				flag += 1;
			} else if (req.query.update == 'addressAndPhone' && req.body.address && req.body.phoneNumber) {
				worker.address = req.body.address;
				worker.phoneNumber = req.body.phoneNumber;
				updatedWorker = await worker.save();
				flag += 1;
			} else if (req.query.update == 'other') {
				// delete req.body.address;
				// delete req.body.phoneNumber;
				// delete req.body.password;
				// delete req.body.email;
				// worker = { ...worker, ...req.body };
				updatedWorker = await worker.save();
				flag += 1;
			}
			if (flag > 0) {
				res.status(200).json({ workers: updatedWorker });
			}
		} catch (error) {
			console.log(error);
			res.status(500).json({ message: 'error updating details' });
		}
	} else {
		res.status(500).json({ message: 'error updating details' });
	}
};
