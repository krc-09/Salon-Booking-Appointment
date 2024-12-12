const Users = require('../Models/users');
const sequelize = require('../utils/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')


exports.postSignupDetails = async (req, res, next) => {
    const { name, email, password,phone } = req.body;

  
    if (!name) {
        return res.status(400).json({ error: 'Name is mandatory' });
    }
    if (!email) {
        return res.status(400).json({ error: 'Email is mandatory' });
    }
    if (!phone) {
        return res.status(400).json({ error: 'Phone is mandatory' });
    }
    if (!password) {
        return res.status(400).json({ error: 'Password is mandatory' });
    }

    try {
     
        const existingUser = await Users.findOne({ where: { email: email } });
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
       
        await  Users.create({ name, email, password: hashedPassword,phone });


     
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
};

function generateAccessToken(id,name){
    return jwt.sign({userId:id,name:name},'TOKEN_SECRET')
}
exports.postLoginDetails = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is mandatory for login' });
    }
    if (!password) {
        return res.status(400).json({ error: 'Password is mandatory for login' });
    }

    try {
      
        const user = await Users.findOne({ where: { email: email } });
        if (!user) {
         
            return res.status(404).json({ error: 'User not found' });
        }

       
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
       
            return res.status(401).json({ error: 'Invalid email or password' });
        }

    
        res.status(200).json({ message: 'User login successful',token:generateAccessToken(user.id,user.name)});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
};
