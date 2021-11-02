import jwt from 'jsonwebtoken'

const authenticate = ( req, res, next ) =>
{
	try
	{
		const token = req.headers.authorization.split( ' ' )[ 1 ];
		const decode = jwt.verify( token, 'harry potter is my favourite' );
		req.user = decode;
		next();
	} catch ( err )
	{
		res.status( 401 ).send( {
			message: "Authentication failed!",
		} )
	}
}

export default authenticate;