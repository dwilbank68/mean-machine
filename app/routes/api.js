var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../../config');


var superSecret = config.secret;

module.exports = function(app, express){

    var apiRouter = express.Router();

    apiRouter
        .post('/authenticate', function(req,res){
            console.log('/authenticate is called');
            User.findOne({ username: req.body.username })
                .select('name username password')
                .exec(function(err,user){
                    if(err) throw err;
                    if(!user){
                        console.log('no user');
                        res.json({success:false, message:'Authentication failed. User not found.'});
                    } else if (user){
                        console.log('found a user');
                        var validPassword = user.comparePassword(req.body.password);
                        if (!validPassword){
                            res.json({success:false, message:'Authentication failed. Wrong password.'});
                        } else {
                            var token = jwt.sign(
                                { name:user.name, username:user.username },
                                superSecret,
                                { expiresIn:1440 * 60 }
                            );
                            res.json({ success:true, message:'Enjoy your token', token:token });
                        }
                    }
                });
        });

    apiRouter.use(function(req, res, next) {
        //console.log('req.headers is ', req.headers);
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        //console.log('token is ', token);
        if (token) {
            jwt.verify(token, superSecret, function(err, decoded) {
                if (err) {
                    return res.status(403).send({ success: false, message: 'Failed to authenticate token.' });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            return res.status(403).send({ success: false, message: 'No token provided.' });
        }
    });

    apiRouter.get('/', function(req, res) {
        res.json({ message: 'hooray! welcome to our api!' });
    });

    apiRouter.route('/users')
        // create a user (accessed at POST http://localhost:8080/users)
        .post(function(req, res) {

            var user = new User();		// create a new instance of the User model
            user.name = req.body.name;  // set the users name (comes from the request)
            user.username = req.body.username;  // set the users username (comes from the request)
            user.password = req.body.password;  // set the users password (comes from the request)

            user.save(function(err) {
                if (err) {
                    // duplicate entry
                    if (err.code == 11000)
                        return res.json({ success: false, message: 'A user with that username already exists. '});
                    else
                        return res.send(err);
                }
                res.json({ message: 'User created!' });
            });

        })
        // get all the users (accessed at GET http://localhost:8080/api/users)
        .get(function(req, res) {
            User.find(function(err, users) {
                if (err) return res.send(err);
                res.json(users);
            });
        });

// on routes that end in /users/:user_id
// ----------------------------------------------------
    apiRouter.route('/users/:user_id')
        .get(function(req, res) {
            User.findById(req.params.user_id, function(err, user) {
                if (err) return res.send(err);
                res.json(user);
            });
        })
        .put(function(req, res) {
            User.findById(req.params.user_id, function(err, user) {

                if (err) return res.send(err);
                if (req.body.name) user.name = req.body.name;
                if (req.body.username) user.username = req.body.username;
                if (req.body.password) user.password = req.body.password;

                user.save(function(err) {
                    if (err) return res.send(err);
                    res.json({ message: 'User updated!' });
                });

            });
        })
        .delete(function(req, res) {
            User.remove({
                _id: req.params.user_id
            }, function(err, user) {
                if (err) return res.send(err);
                res.json({ message: 'Successfully deleted' });
            });
        });

    apiRouter.get('/me', function(req, res) {
        res.send(req.decoded);
    });

    return apiRouter;

}