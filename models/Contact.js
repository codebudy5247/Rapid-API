const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContactSchema = new Schema({
	
	name: {
		type: String,
		required: true
	},
	email: {
		type: String
	},
	avatar: {
		type: String,
		default:"http://simpleicon.com/dev/wp-content/uploads/user1.png"
		
	  },
	phone: {
		type: String
	},
	type: {
		type: String,
		default: 'personal'
	},
	date: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('contact', ContactSchema);
