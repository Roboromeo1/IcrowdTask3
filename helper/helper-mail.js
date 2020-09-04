const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');

//ES6

module.exports.sendMail = (toMail) => {
	const msg = {
		to: toMail,
		from: 'adhi14058@gmail.com', // Use the email address or domain you verified above
		subject: 'Welcome to iCrowdTask',
		text: 'This mail is to confirm that you have registered to iCrowdTask.\n Welcome and have a nice day.'
	};
	sgMail.send(msg).then(
		() => {
			console.log('done');
		},
		(error) => {
			//console.error(error);
			if (error.response) {
				//console.error(error.response.body);
			}
		}
	);
};
