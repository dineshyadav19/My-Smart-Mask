const express = require('express')
const path = require('path')
const ejsMate = require('ejs-mate')
const mongoose = require('mongoose')
const User = require('./model/user')
const Data = require('./model/data')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const JWT_SECRET = 'jbdhbashbdhabsdhasbdhas%U#*Y#YT#&QT**Q#T##T#*Q#dbahssdbasbdasdb##^tq36t7T#7q3Y#8q3*#Ybadsbsbdbasdbasdhbas'

mongoose.connect('mongodb://localhost:27017/smartMask',{
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
})


const app =  express()
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'static'))

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/', express.static(path.join(__dirname,'static')))
app.use(express.static(__dirname + '/public'))

app.get('/home', (req, res) => {
    res.render('landing.ejs')
})

app.get('/precautions', (req, res) => {
    res.render('data')
})

app.get('/register', (req, res) => {
    res.render('index')
})


app.post('/api/register', async (req, res) => {
    const {username, password: plainTextPassword} = req.body;

    if(!username || typeof username !== 'string'){
        return res.json({ status: 'error', error: 'Invalid Username' })
    }

    if(!plainTextPassword || typeof plainTextPassword !== 'string'){
        return res.json({ status: 'error', error: 'Invalid Password' })
    }

    if(plainTextPassword < 5){
        return res.json({ status: 'error', error: 'Password too small. Should be at least 6 characters' })
    }

    const password = await bcrypt.hash(plainTextPassword, 10)
    //console.log(await bcrypt.hash(password, 10))

    try {
        const response = await User.create({
            username, 
            password
        })
        console.log('User Created Successfully', response)
    } catch (error) {
        if(error.code === 11000) {
            //duplicate key or username
            return res.json( { status: 'error', error: 'Username already in use' } )
        }
        throw error
    }
    res.json({status: 'ok'})
})



app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/api/login', async(req, res) => {

    const { username, password } = req.body;
    const user = await User.findOne( { username } ).lean()

    if(!user) {
        return res.json( { status: 'error', error: 'Invalid username/password' } )
    }

    if(await bcrypt.compare(password, user.password)){
        // the username, password combination is successful

        const token = jwt.sign( 
            { 
                id: user._id, 
                username: user.username 
            },
            JWT_SECRET 
        )

        return res.json( { status: 'ok', data: token } )

    }

    res.json( { status: 'error', error: 'Invalid username/password' } )
})

app.get('/change-password', (req, res) => {
    res.render('change-password')
})


app.post('/api/change-password', async (req, res) => {
	const { token, newpassword: plainTextPassword } = req.body

	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (plainTextPassword.length < 5) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}

	try {
		const user = jwt.verify(token, JWT_SECRET)

		const _id = user.id

		const password = await bcrypt.hash(plainTextPassword, 10)

		await User.updateOne(
			{ _id },
			{
				$set: { password }
			}
		)
		res.json({ status: 'ok' })
	} catch (error) {
		console.log(error)
		res.json({ status: 'error', error: ';))' })
	}
})

app.get('/smartMask', (req, res) =>{
    res.render('mask')
})


app.listen(3000, () => {
    console.log('Server Connected')
})