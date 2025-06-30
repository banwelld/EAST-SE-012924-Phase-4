import { NavLink } from 'react-router-dom';

function NavBar({ customer, logoutCustomer }) {
  return (
    <nav className='navbar'>
      {customer && (
        <>
          <NavLink to='/'>Home</NavLink>
          <NavLink to='/add_hotel'>Add Hotel</NavLink>
          <NavLink onClick={logoutCustomer} to='/login'>
            Logout
          </NavLink>
        </>
      )}
    </nav>
  );
}

export default NavBar;
