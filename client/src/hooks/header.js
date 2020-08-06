import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Context from '../utils/context';

const Header = () => {
  const context = useContext(Context)
    return(
        <div className='container mt-5 row'>
          <div className='col-md-8'>
            <Link to='/' style={{padding: '5px'}}>Home</Link>
          </div>

          {/* <Link to='/profile' style={{padding: '5px'}}>
            Profile
          </Link>
          <Link to='/hooksform' style={{padding: '5px'}}>
            Hooks Form
          </Link>
          <Link to='/hookscontainer' style={{padding: '5px'}}>
            Hooks Container
          </Link>
          <Link to='/privateroute' style={{padding: '5px'}}>
            Private Route
          </Link> */}
          <div className='col-md-4'>
            {!context.authState
              ? <button className='btn btn-primary' onClick={() => context.authObj.login()}>Login</button>
              : <button className='btn btn-primary' onClick={() => context.authObj.logout()}>Logout</button>
            }
          </div>
        </div>
  )};





export default Header;
