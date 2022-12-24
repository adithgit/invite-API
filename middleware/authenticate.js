exports.checkLoggedin = (req, res, next)=>{
    try{
        // Checks if the session has user details
        if(!req.session.user) throw new Error();
        next();
    }
    catch(e){
        res.status(401).send({message: 'access denied, login first.'});
    }
}
