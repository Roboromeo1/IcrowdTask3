const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const mongoose = require('mongoose');
const url = 'mongodb://localhost/iCrowdTaskDB';
mongoose
	.connect(url, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.catch((p) => {
		console.log(p);
	});
app.use(express.static(path.join(__dirname, 'public')));

const router = require('./routes/Item');
const authRoutes = require('./routes/auth');

app.set('view engine', 'ejs');

app.use('/workers', router);
app.use('/auth', authRoutes);

app.use((req, res, next) => {
	res.redirect('/auth/login');
});

app.listen(3000, () => {
	console.log('listening to port 3000');
});
