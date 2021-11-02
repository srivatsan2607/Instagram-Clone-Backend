import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const commentSchema = new Schema( {
	comment: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		userName: String
	},
}, { timestamps: true } );

export default mongoose.model( "comments", commentSchema )