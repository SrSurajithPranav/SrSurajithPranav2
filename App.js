import React, { useState } from "react";
import axios from "axios";
import { MagnifyingGlass } from "react-loader-spinner";
import Alert from "./Alert";
import Select from 'react-select';
import MapComponent from "./MapComponent";
import { AwesomeButton } from "react-awesome-button";
import 'react-awesome-button/dist/styles.css';


function App() {
  const API_KEY = '21571e236ae1e7500c50aabca16ad13c';

  const [data, setData] = useState('');
  const [location, setLocation] = useState('');
  const [unit, setUnit] = useState('metric');
  const [symbol, setSymbol] = useState('°C');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const handleUnitChange = (selectedOption) => {
    setUnit(selectedOption.value);
    setSymbol(selectedOption.value === 'metric' ? '°C' : '°F');
    setData(null);
  };

  const unitOptions = [
    { value: 'metric', label: 'Celsius (°C)' },
    { value: 'imperial', label: 'Fahrenheit (°F)' },
  ];

  // NOTE : Fatch data from OpenWeatherMap third party API.Constrected request url with (location, api key,unit).
  // NOTE : For more about Api EndPoint and Methods see documentation (https://openweathermap.org/api)
  
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=${unit}`;

  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      setIsLoading(true);
      axios.get(url).then(response => {
        setData(response?.data);
      })
        .catch((error) => {
          setError(error.response?.data?.message || 'An error occurred');
          setData(null);
        })
        .finally(() => {
          setIsLoading(false);
          setLocation('');
          setTimeout(() => {
            setError(null);
          }, 3000);
        });
    }
  };

  const getUserLocation = () => {

    if (userLocation) {
      setUserLocation(null);
      return;
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setError(null);
        },
        (err) => {
          setError(err.message);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div className="app">
      {isLoading && (
        <div className="loading-spinner">
          <MagnifyingGlass visible={true} height={80} width={80}
            ariaLabel="MagnifyingGlass-loading"
            glassColor="#bbc1c3"
            color="#394c54"
          />
        </div>
      )}
      {error && (
        <Alert
          message={error}
          type="error"
          onClose={() => setError(null)}
        />
      )}
      <div className="search">
        <input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          onKeyPress={searchLocation}
          placeholder="Search Location"
          type="text"
        />
      </div>

      <div className="date">
        <p> {new Date().toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {data ?
        <div className="container">
          <div className="top">
            <div className='location'>
              <p>{data.name}</p>
            </div>
            <div className="temp">
              <h1>{data.main.temp.toFixed()}{symbol}</h1>
              <div className="icon">
                <img src={`https://openweathermap.org/img/wn/${data.weather[0].icon}.png`} alt="Weather Icon" />
              </div>
            </div>

            <div className="description">
              <h2>{data.weather[0].main}</h2>
            </div>
          </div>
          <div className="bottom">
            <div className="feels">
              <p className="bold">{data.main.feels_like.toFixed()}{symbol}</p>
              <p>Feels Like</p>
            </div>
            <div className="humidity">
              <p className="bold">{data.main.humidity}%</p>
              <p>Humidity</p>
            </div>
            <div className="temp_max">
              <p className="bold">{data.main.temp_max.toFixed()}{symbol}</p>
              <p>Max Temp</p>
            </div>
            <div className="wind">
              <p className="bold">{data.wind.speed.toFixed()}m/s</p>
              <p>Wind Speed</p>
            </div>
          </div>
        </div>
        : null}

      <div className="unit-dropdown">
        <Select
          options={unitOptions}
          value={unitOptions.find(option => option.value === unit)}
          onChange={handleUnitChange}
          className="custom-select"
          styles={{
            control: provided => ({
              ...provided,
              backgroundColor: "rgba(0,0,0,0.1)",
              border: "1px solid rgba(255, 255, 255, 0.8)",
              borderRadius: "25px",
              padding: ".2rem .5rem",
            }),
            option: (provided, state) => ({
              ...provided,
              backgroundColor: "white",
              color: "black",
            }), singleValue: (provided) => ({
              ...provided,
              color: "#ffffff",
            })
          }}
        />
      </div>

      <div style={{ position: 'fixed', top: '1rem', right: '1rem' }}>
        <AwesomeButton style={{ marginBottom: '1rem' }} type="primary" onPress={getUserLocation}>
          {userLocation ? 'Close Map' : 'Open Map'}
        </AwesomeButton>
        {userLocation && (
          <MapComponent lat={userLocation.latitude} lng={userLocation.longitude} />
        )}
      </div>
      <footer className="footer">
        <h4>&copy; {new Date().getFullYear()} Weather app. All rights reserved.</h4>
      </footer>
    </div>
  );
}

export default App;
