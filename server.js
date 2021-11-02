import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import PostModel from './models/PostModel.js'
import Pusher from 'pusher'
import { Register, Login } from './controllers/AuthController.js'
import Authenticate from './middleware/authenticate.js'
import { PostComment } from './controllers/CommentController.js'
import dotenv from 'dotenv'


//app config
const app = express();
const port = 8000;
dotenv.config()

const pusher = new Pusher( {
	appId: process.env.PUSHER_APP_ID,
	key: process.env.KEY,
	secret: process.env.PUSHER_SECRET,
	cluster: process.env.PUSHER_CLUSTER,
	useTLS: true
} );


//middleware
app.use( express.json() );
app.use( cors() );


//db config
const connection_url = process.env.DB_URL;
mongoose.connect( connection_url, {
	useCreateIndex: true,
	useNewUrlParser: true,
	useUnifiedTopology: true,
} );

mongoose.connection.once( 'open', () =>
{
	console.log( 'Db is connected' );
	const changeStream = mongoose.connection.collection( "posts" ).watch();
	changeStream.on( "change", ( change ) =>
	{
		if ( change.operationType === "insert" || change.operationType === "update" )
		{
			console.log( "Insertedd" )
			console.log( "postDetails>>", change );
			pusher.trigger( "posts", "inserted", {
				postId: change.documentKey._id
			} )
		} else
		{
			console.log( "Other than inser" );
			console.log( change.operationType )
		}
	} )
} )

//api routes
app.get( "/", ( req, res ) =>
{
	res.status( 200 ).send( "Done" );
} );

app.post( "/posts/upload", Authenticate, ( req, res ) =>
{
	const post = req.body;
	PostModel.create( post, ( err, data ) =>
	{
		if ( err )
		{
			res.status( 500 ).send( {
				message: "Post upload failed",
				status: "failed",
				error: err
			} );
		} else
		{
			res.status( 201 ).send( {
				message: "Post uploaded successfully",
				status: "success",
				data
			} );
		}
	} )
} );

app.get( "/posts", Authenticate, ( req, res ) =>
{
	PostModel.find( {}, ( err, data ) =>
	{
		if ( err )
		{
			res.status( 500 ).send( err );
		} else
		{
			res.status( 200 ).send( data );
		}
	} ).sort( { "createdAt": -1 } )
} )

app.post( "/user/register", Register );
app.post( "/user/login", Login );
app.post( "/posts/:post_id/comment", Authenticate, PostComment );

//app listen
app.listen( process.env.PORT || port, () => console.log( "listening on the port " + port ) );
