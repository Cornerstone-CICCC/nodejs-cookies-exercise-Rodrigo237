import { Router, Request, Response } from 'express'
import { checkAuth, isLoggedOut} from '../middleware/auth.middleware'
import { User } from '../types/user'

const pageRouter = Router()

// In-memory user database
const users: User[] = [
  { id: 1, username: "admin", password: "admin12345" }
]

/**
 * Home route
 * 
 * @route GET /
 */
pageRouter.get('/', (req: Request, res: Response) => {
  res.status(200).render('index', {
    pageTitle: "Home"
  })
})

/**
 * login route
 * 
 * @route GET /login
 */
pageRouter.get('/login', isLoggedOut, (req: Request, res: Response) => {
  res.status(200).render('login')
})

/**
 * Login route
 * 
 * @route POST /login
 */
pageRouter.post('/login', (req: Request<{}, {}, Omit<User, 'id'>>, res: Response) => {
  const { username, password } = req.body
  const foundUser = users.find(
    u => u.username === username && u.password === password
  )
  if (!foundUser) {
    res.status(301).redirect('/login')
    return
  }
  res.cookie('isLoggedIn', true, {
    httpOnly: true,
    signed: true, // req.signedCookies
    maxAge: 3 * 60 * 1000 // 3 mins
  })
  res.cookie('username', username, {
    httpOnly: true,
    signed: true,
    maxAge: 3 * 60 * 1000 // 3 mins
  })
  res.status(301).redirect('/my-profile')
})

/**
 * Signup route
 * 
 * @route POST /signup
 */
pageRouter.post('/signup', (req: Request<{}, {}, Omit<User, 'id'>>, res: Response) => {
  const { username, password } = req.body
  if (!username || !password) {
    res.status(301).redirect('/login')
    return
  }
  const existingUser = users.find(u => u.username === username)
  if (existingUser) {
    res.status(301).redirect('/login')
    return
  }
  const newUser: User = {
    id: users.length + 1,
    username,
    password
  }
  users.push(newUser) // Add user to users array
  res.cookie('isLoggedIn', true, {
    httpOnly: true,
    signed: true, // req.signedCookies
    maxAge: 3 * 60 * 1000 // 3 mins
  })
  res.cookie('username', username, {
    httpOnly: true,
    signed: true,
    maxAge: 3 * 60 * 1000 // 3 mins
  })
  res.status(301).redirect('/my-profile')
})

/**
 * Logout route
 * 
 * @route GET /logout
 */
pageRouter.get('/logout', (req: Request, res: Response) => {
  res.clearCookie('isLoggedIn')
  res.clearCookie('username')
  res.status(301).redirect('/')
})

/**
 * My Account page (Logged in users only)
 * 
 * @route GET /my-account
 */
pageRouter.get('/my-profile', checkAuth, (req: Request, res: Response) => {
  const { username } = req.signedCookies
  res.status(200).render('profile', {
    username
  })
})

export default pageRouter