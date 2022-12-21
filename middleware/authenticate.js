exports.checkLoggedin = (req, res, next)=>{
    try{
        console.log(req.session);
        if(!req.session.user) throw new Error();
        next();
    }
    catch(e){
        res.status(401).send({message: 'access denied, login first.'});
    }
}
