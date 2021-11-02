import Post from '../models/PostModel.js'
import Comment from '../models/commentModel.js'


export const PostComment = ( req, res, next ) =>
{
	const comment = new Comment( {
		comment: req.body.comment,
		author: {
			id: req.body.userId,
			userName: req.body.userName,
		},
	} )
	Post.findById( { _id: req.params.post_id } )
		.then( ( post ) =>
		{
			comment.save()
				.then( ( comm ) =>
				{
					console.log( comm );
					post.comments.push( comm )
					post.save()
					res.status( 200 ).send( {
						message: "commment uploaded",
						comment
					} )
				} )
				.catch( ( error ) =>
				{
					console.log( error );
				} )
		} )
		.catch( err =>
		{
			res.status( 404 ).send( {
				message: "Post not found",
				status: "failed"
			} )
		} )
}





