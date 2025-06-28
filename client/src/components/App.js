import Header from './Header';
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

function App() {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    fetch('/hotels')
      .then((r) => r.json())
      .then((r) => setHotels(r));
  }, []);

  function addHotel(newHotel) {
    fetch('/hotels', {
      method: 'POST',
      headers: {
        'Content-Type': 'Application/JSON',
      },
      body: JSON.stringify(newHotel),
    })
      .then((r) => r.json())
      .then((r) => setHotels([...hotels, r]));
  }

  function updateHotel(id, hotelDataForUpdate) {
    fetch(`/hotels/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'Application/JSON',
      },
      body: JSON.stringify(hotelDataForUpdate),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          alert(
            'An unexpected error occurred. Unable to process your request.'
          );
        }
      })
      .then((hotelUpdate) => {
        const newHotelList = hotels.map((h) =>
          h.id === id ? { ...h, ...hotelUpdate } : h
        );
        setHotels(newHotelList);
      });
  }

  function deleteHotel(id) {
    fetch(`/hotels/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'Application/JSON' },
    }).then((res) => {
      if (res.ok) {
        const newHotelList = hotels.filter((h) => h.id != id);
        setHotels(newHotelList);
      } else if (res.status === 400) {
        res.json().then((errorData) => alert(`ERROR: ${errorData.error}`));
      } else {
        alert('An unexpected error occurred. Unable to process your request.');
      }
    });
  }

  return (
    <div className='app'>
      <NavBar />
      <Header />
      <Outlet
        context={{
          hotels: hotels,
          addHotel: addHotel,
          deleteHotel: deleteHotel,
          updateHotel: updateHotel,
        }}
      />
    </div>
  );
}

export default App;
