const jwt = require('jsonwebtoken');

let checkToken = (req, res, next) => {

    let Authorization = req.get('Authorization');

    jwt.verify(Authorization, 'vapecl', (err, tokenDecoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'token no valido'
                }
            });
        }

        req.user = tokenDecoded.user
        next();
    });
};

let verificaAdmin_Role = (req, res, next) => {
    let usuario = req.user;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    }else{
        res.json({
            ok:false,
            err:{
                message:"Este usuario no es ADMIN"
            }
        })
    }
};

module.exports = {
    checkToken,
    verificaAdmin_Role
}