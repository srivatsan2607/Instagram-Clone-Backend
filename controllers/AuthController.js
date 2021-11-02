import User from '../models/UserModel.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const Register = ( req, res, next ) =>
{
	bcrypt.hash( req.body.password, 10, function ( err, hashedPass )
	{
		if ( err )
		{
			res.status( 500 ).send( err );
		}
		let user = new User( {
			userName: req.body.userName,
			email: req.body.email,
			phone: req.body.phone,
			password: hashedPass,
		} );
		User.findOne( { $or: [ { email: user.email }, { phone: user.phone } ] } ).then(
			dbUser =>
			{
				if ( dbUser )
				{
					res.send( {
						message: "User already exists",
						status: "failed"
					} )
				} else
				{
					User.findOne( { userName: user.userName } ).then(
						usr =>
						{
							if ( usr )
							{
								res.send( {
									message: "Username already exists. Try changing to a new one", status: "failed"
								} );
							} else
							{
								user.save()
									.then( user =>
									{
										let token = jwt.sign( { name: user.name }, "harry potter is my favourite", {
											expiresIn: '1h'
										} );
										res.status( 201 ).send( {
											message: "user created!",
											user: {
												userId: user._id,
												userName: user.userName,
												email: user.email,
												phone: user.phone,
												createdAt: user.createdAt,
											},
											token,
											status: "success"
										} );
									} )
									.catch( err =>
									{
										res.status( 500 ).send( {
											message: "error occured while registering user!", status: "failed"
										} );
									} )
							}
						}
					)
				}
			}
		).catch( err =>
		{
			res.status( 500 ).send( {
				message: "Error occurred! Please try again",
				status: "failed"
			} )
		} )

	} )
}

export const Login = ( req, res, next ) =>
{
	var userName = req.body.userName;
	var password = req.body.password;
	User.findOne( { $or: [ { email: userName }, { phone: userName } ] } )
		.then( user =>
		{
			if ( user )
			{
				bcrypt.compare( password, user.password, function ( err, result )
				{
					if ( err )
					{
						res.status( 500 ).send( {
							message: "Error occurred while logging in!",
							status: "failed"
						} );
					} else
					{
						console.log( "result>>>", result );
						if ( result )
						{
							let token = jwt.sign( { name: user.name }, "harry potter is my favourite", { expiresIn: '1h' } );
							res.status( 200 ).send( {
								message: "Login successful",
								user: {
									userId: user._id,
									userName: user.userName,
									email: user.email,
									phone: user.phone,
									createdAt: user.createdAt,
								},
								token: token,
								status: "success",
							} )
						} else
						{
							res.status( 200 ).send( {
								message: "Incorrect Password!",
								status: "failed"
							} );
						}
					}
				} )
			} else
			{
				res.status( 404 ).send( {
					message: "User not found!",
					status: "failed"
				} );
			}
		} ).catch( err =>
		{
			res.status( 500 ).send( {
				message: "Error occurred! Please try again",
				status: "failed"
			} )
		} )
}



