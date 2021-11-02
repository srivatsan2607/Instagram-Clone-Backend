import mongoose from 'mongoose'

const userSchema = mongoose.Schema( {
	userName: String,
	email: String,
	phone: String,
	password: String,
}, { timestamps: true } );


export default mongoose.model( "users", userSchema );
