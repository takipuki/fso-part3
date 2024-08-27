const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.set('strictQuery', false);
mongoose
	.connect(MONGODB_URI)
	.then(() => console.log("Successfully connected to databse."))

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

module.exports = mdl_note;
