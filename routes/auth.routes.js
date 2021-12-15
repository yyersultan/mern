const { Router, request } = require("express");
const User = require('../models/Users');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const { check,validationResult } = require('express-validator');
const router = Router();

// /api/auth
router.post('/register',
    [
        check('email','Incorrect email').isEmail(),
        check('password','Min length of password 6').isLength({ min: 6 })
    ],
    async (req,res) => {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: 'Incorrect data in registration'
            })
        }
        const {email,password} = req.body(); // we recieve email and pass from react.kjs
        const candidate = await User.findOne({ email });
        if(candidate){
            return res.status(400).json({ message: 'Such User already exists' });
        }
        const hashedPassowrd = await bcrypt.hash(password,12);
        const user = new User({ email,password: hashedPassowrd });
        await user.save();
        res.status(201).json({ message: 'User created successfuly' });
        
    }catch(e){
        res.status(500).json({message : "Something was wrong "});
    }
})
// /api/auth/
router.post('/login',
            [
                check('email','Icorrect email').normalizeEmail().isEmail(),
                check('password','Min length of password 6').exists()
            ],
            async(req,res) => {
            
            try{
                const errors = validationResult(req);
                if(!errors.isEmpty()){
                    return res.status(400).json({
                        errors: errors.array(),
                        message: 'Incorrect data in login'
                    })
                }
                const {email,password} = req.body();
                const user = await User.findOne({email});
                if(!user){ 
                    return res.status(400).json({ message: 'User doesnt found' })
                }
                const isMatch = await bcrypt.compare(password,user.password);

                if(!isMatch){
                    return res.status(400).json({ message: 'Incorrect password, try again' });
                }
                const token = jwt.sign(
                    { userId: user.id },
                    config.get('jwtSecret'),
                    { expiresIn: '1h' }
                )
                res.json({ token,userId: user.id });
            
            }catch(e){
                res.status(500).json({ message: 'Somthing is wrong try again' })
            }


})

module.exports = router;
