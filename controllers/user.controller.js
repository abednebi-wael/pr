const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.registerUser = async (req, res) => {

    const user = { ...req.body }
    const email = user.email
    const searchRes = await User.findOne({ email })
    if (searchRes) return res.status(403).json({ msg: "Email already exist" })

    try {
        const newUser = await new User({ ...req.body })

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(newUser.password, salt)

        newUser.password = hash

        await newUser.save()
        res.status(201).json({ msg: "user register successfuly" })
    } catch (error) {
        console.log(error)
        res.status(401).json({ msg: "user register failed" })
    }
}

exports.userLogin = async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) return res.status(405).json({ msg: "User not already exist" })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(404).json({ msg: "Bad Credentiel" })

    const payload = {
        id: user._id,
        fullName: user.fullName,
        email: user.email
    }

    try {
        const token = await jwt.sign(payload, process.env.secretOrKey)
        res.status(200).json({ msg: "Login with success", token: `Bearer ${token}` })
    } catch (error) {
        console.log(error)
        res.status(401).json({ msg: "Login failed" })
    }

}