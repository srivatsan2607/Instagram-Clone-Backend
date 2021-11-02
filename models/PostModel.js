import mongoose from 'mongoose'

const PostSchema = mongoose.Schema( {
	caption: String,
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	userName: String,
	image: [],
	comments: [],
}, { timestamps: true } );

export default mongoose.model( "posts", PostSchema );