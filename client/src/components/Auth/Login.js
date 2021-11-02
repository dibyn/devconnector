import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
// import axios from 'axios'
const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const { email, password } = formData
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })
  const onSubmit = async (e) => {
    e.preventDefault()
    console.log('Success')
    // try {
    //   const data = {
    //     name,
    //     email,
    //     password,
    //   }
    //   const res = await axios.post('/api/users', data)
    //   console.log({ response: res.data })
    // } catch (error) {
    //   console.log(error.response.data)
    // }
  }
  return (
    <Fragment>
      <h1 className='large text-primary'>Sign In</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Sign into Your Account
      </p>
      <form onSubmit={onSubmit} className='form' action='create-profile.html'>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            minLength='6'
            value={password}
            onChange={(e) => onChange(e)}
          />
        </div>
        <input type='submit' className='btn btn-primary' value='Login' />
      </form>
      <p className='my-1'>
        Don't have an account? <Link to='/register'>Sign Up</Link>
      </p>
    </Fragment>
  )
}
export default Login