const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.set('strictQuery', false);
mongoose
	.connect(MONGODB_URI)
	.then(() => console.log('Successfully connected to databse.'));

const scm_person = new mongoose.Schema({
	name: {
		type: String,
		minLength: [3, 'too small...'],
		required: [true, 'do u have a name buddy?'],
	},
	number: {
		type: String,
		validate: {
			validator: v => v.length >= 8 && /\d{2,3}-\d+/,
			message: props => `${props.value} is not a phone number`,
		},
		required: [true, 'need thy number'],
	}
});
scm_person.set('toJSON', {
	transform: (_, retObj) => {
		retObj.id = retObj._id.toString();
		delete retObj._id;
		delete retObj.__v;
	}
});

const mdl_person = new mongoose.model('Person', scm_person);

module.exports = mdl_person;
