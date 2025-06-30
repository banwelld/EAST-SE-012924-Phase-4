import Header from './Header';
import { useState, useEffect } from 'react';
import { Outlet, useNavigate, Navigate } from 'react-router-dom';
import NavBar from './NavBar';

function App() {
  const navigate = useNavigate();

  const [hotels, setHotels] = useState([]);

  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    // GET request - Write the code to retrieve all hotels and update the 'hotels' state with the hotel data.
    fetch('/hotels')
      .then((response) => response.json())
      .then((hotelsData) => setHotels(hotelsData));
  }, []);

  useEffect(() => {
    fetch('/check_session').then((res) => {
      switch (true) {
        case res.ok:
          res.json().then((customerData) => {
            setCustomer(customerData);
            navigate('/');
          });
          break;

        case res.status === 401:
          res.json().then((errorData) => alert(errorData.message));
          break;

        default:
          res.json().then((data) => console.log(data));
          break;
      }
    });
  }, []);

  function addHotel(newHotel) {
    // POST request - Write the code to create a new hotel and update the 'hotels' state to add the new hotel to the state.
    // newHotel - contains an object with the new hotel data for the POST request.
    fetch('/hotels', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(newHotel),
    }).then((response) => {
      if (response.ok) {
        response.json().then((newHotelData) => {
          setHotels([...hotels, newHotelData]);
          navigate('/');
        });
      } else if (response.status === 400) {
        response.json().then((errorData) => alert(`Error: ${errorData.error}`));
      } else {
        response.json().then(() => alert('Error: Something went wrong.'));
      }
    });
  }

  function updateHotel(id, hotelDataForUpdate, setHotelFromHotelProfile) {
    // PATCH request - Write the code to update a hotel by id and update the 'hotels' state with the updated hotel data.
    // id - contains a number that refers to the id for the hotel that should be updated.
    // hotelDataForUpdate - contains an object with the hotel data for the PATCH request.
    fetch(`/hotels/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(hotelDataForUpdate),
    }).then((response) => {
      if (response.ok) {
        response.json().then((updatedHotelData) => {
          setHotelFromHotelProfile(updatedHotelData);
          setHotels((hotels) =>
            hotels.map((hotel) => {
              if (hotel.id === updatedHotelData.id) {
                return updatedHotelData;
              } else {
                return hotel;
              }
            })
          );
        });
      } else if (response.status === 400 || response.status === 404) {
        response.json().then((errorData) => {
          alert(`Error: ${errorData.error}`);
        });
      } else {
        response.json().then(() => {
          alert('Error: Something went wrong.');
        });
      }
    });
  }

  function deleteHotel(id) {
    // DELETE request - Write the code to delete a hotel by id and update the 'hotels' state to remove the hotel from the state.
    // id - contains a number that refers to the id for the hotel that should be deleted.
    fetch(`/hotels/${id}`, {
      method: 'DELETE',
    }).then((response) => {
      if (response.ok) {
        setHotels((hotels) =>
          hotels.filter((hotel) => {
            return hotel.id !== id;
          })
        );
      } else if (response.status === 404) {
        response.json().then((errorData) => alert(`Error: ${errorData.error}`));
      }
    });
  }

  function loginCustomer(loginData) {
    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(loginData),
    }).then((res) => {
      switch (true) {
        case res.ok:
          res.json().then((customerData) => {
            setCustomer(customerData);
            navigate('/');
          });
          break;

        case res.status === 401:
          res.json().then((errorData) => alert(errorData.message));
          break;

        default:
          res.json().then((data) => console.log(data));
          break;
      }
    });
  }

  function logoutCustomer() {
    fetch('/logout', {
      method: 'DELETE',
    }).then((res) => {
      if (res.ok) {
        setCustomer(null);
      } else {
        alert('Error: Unable to log customer out.');
      }
    });
  }

  return (
    <div className='app'>
      {customer && (
        <NavBar customer={customer} logoutCustomer={logoutCustomer} />
      )}
      <Header />
      {customer && <h1>Welcome {customer.first_name}!</h1>}
      {!customer && <Navigate to='/login' />}
      <Outlet
        context={{
          hotels: hotels,
          addHotel: addHotel,
          deleteHotel: deleteHotel,
          updateHotel: updateHotel,
          loginCustomer: loginCustomer,
        }}
      />
    </div>
  );
}

export default App;
