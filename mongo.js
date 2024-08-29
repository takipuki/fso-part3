const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.set('strictQuery', false);
mongoose.connect(MONGODB_URI);

const scm_note = new mongoose.Schema({
	name: String,
	number: String
});
scm_note.set('toJSON', {
	transform: (_, retObj) => {
		retObj.id = retObj._id.toString();
		delete retObj._id;
		delete retObj.__v;
	}
});

const mdl_note = new mongoose.model('Person', scm_note);

// just show all
if (process.argv.length !== 4) {
	mdl_note
		.find({})
		.then(res => {
			// console.log('phonebook:');
			res.forEach(v => console.log(v.id.toString(), v.name, v.number));
			// console.log(res);
			mongoose.connection.close();
		});
} else {
	const person = new mdl_note({
		name: process.argv[2],
		number: process.argv[3],
	});

	console.log(person);
	console.log(JSON.stringify(person));
	process.exit(0);
	person.save().then(_ => {
		console.log('saved');
		mongoose.connection.close();
	});
}

