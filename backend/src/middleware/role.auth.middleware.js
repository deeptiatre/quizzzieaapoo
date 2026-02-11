const checkRoleMiddleware = (req,res,next) => {
    try {
        if(req.user.role !== 'admin' && req.user.role !== 'teacher'){
            return res.status(403).json({
                message: "forbidden , you do not have access to this resource"
            })
        }
        next();
    } catch (error) {
        console.error("Error in role check auth middleware:", error);
        return res.status(500).json({
            message: "internal server error ",
            error : error.message
        })
    }


}
module.exports = checkRoleMiddleware;