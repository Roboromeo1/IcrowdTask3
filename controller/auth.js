const Item = require('../model/Item');
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports.getRegister = (req, res, next) => {
	res.render('index', { error: 'none' });
};

module.exports.postLogin = async (req, res, next) => {
	console.log(req.body);
	try {
		let workers = await Item.findOne({ email: req.body.email }).exec();
		if (bcrypt.compareSync(req.body.password, workers.password)) {
			res.render('home', { name: workers.firstName });
		} else {
			res.render('login', { error: 'User Not Authorized, Wrong Password' });
		}
		console.log(workers);
	} catch (error) {
		res.render('login', { error: 'User Not found. Please Sign up' });
	}
};

module.exports.getLogin = (req, res, next) => {
	res.render('login', { error: 'none' });
};
