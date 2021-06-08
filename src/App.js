import React, {useState, useEffect} from 'react';

import { WiThermometerExterior, WiWindDeg, WiStrongWind, WiCloud, WiBarometer, WiHumidity } from 'weather-icons-react';

import { weatherConditions, weatherIcons } from './utils/weatherConditions.js';

import './App.css';
import Head from 'next/head';

const API_TOKEN = '';
const APIID = "";

export default function App() {

  const [city, setCity] = useState([]);

  const [latitude, setLatitude] = useState([]);
  const [longitude, setLongitude] = useState([]);

  const [weatherData, setWeatherData] = useState({});

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading) {
      fetchResponse();
    }

    async function fetchResponse() {
      
      async function success(pos) {
        var crd = pos.coords;
        setLatitude(crd.latitude);
        setLongitude(crd.longitude);
        getCity(pos.coords.latitude,pos.coords.longitude)
      }
      
      function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      }
      navigator.geolocation.getCurrentPosition(success, error);
    }
   
    // This gets called on every request
    async function fetchCurrentWeather(lat, long, city) {

      // Fetch data from external API
      const res = await fetch(`https://api.openweathermap.org/data/2.5/find?q=${city}&lat=${lat}&lon=${long}&units=metric&APPID=${APIID}`).then(res => { return res.json()}).then(data => {

          const mappedData = {
            description: data.list[0].weather[0].description,
            temperature: data.list[0].main.temp,
            country:data.list[0].sys.country,
            city: data.list[0].name,
            condition: data.list[0].weather[0].main,
            feelsLike : data.list[0].main.feels_like,
            windKm: data.list[0].wind.speed * 3.6,
            clouds:data.list[0].clouds.all,
            pressure: data.list[0].main.pressure,
            humidity: data.list[0].main.humidity,
          }
          setWeatherData(mappedData);
          setLoading(false);
      });
    }

    // Step 2: Get city name
    async function getCity(lat, long) {
      // Paste your LocationIQ token below.
      let loc;
      let data;
      const res = await fetch(`https://us1.locationiq.com/v1/reverse.php?key=${API_TOKEN}&lat=${lat}&lon=${long}&format=json`, {
        "method": "GET"})
    
      data = await res.json();
    
      if (data) {
        if (data.address.city) {
          loc =  data.address.city;
        }
        else if (data.address.town) {
         loc = data.address.town;
        }
    
      }
      fetchCurrentWeather(lat, long, loc);
    }
  }, [city, temperature])
    
  return (
      <div className="container">
          {loading ? (
            <div className="d-md-flex h-md-100 align-items-center justify-content-center text-center" style={{backgroundColor:'#lightblue', color:'#fff'}}> 
                <h1 >Loading weather...</h1>
            </div> ) : (
        <>
        <Head>
          <title>Weather INF</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="main">
        <h1 className="text-center" style={{color:'#000'}}>Weather</h1>
          { weatherIcons[weatherConditions[weatherData.condition].icon] }
          <p className="description" style={{marginTop:"-75px", color: "#fff"}}>
            { weatherData.description }
          </p>

          <h4 className="title" style={{color:'#fff'}}>
          { weatherData.temperature }
             <span style={{color: "#0070f3"}}>°C</span>
          </h4>
          <h1 className="description" style={{color:'#fff'}}>
            {weatherData.city + '  '}
            <code className="code" style={{color: "#0070f3"}}> {weatherData.country} </code>
          </h1>
          <div className="grid">
            <div className="card">
              <h2>Feels like <WiThermometerExterior size={85} color='"gray"' /> </h2>
              <p style={{fontSize: "32px"}}>{ weatherData.feelsLike }°</p>
            </div>

            <div className="card">
              <h2> Wind 
                <WiStrongWind size={85} color='"gray"' />
                <WiWindDeg size={85} color='"gray"' />
              </h2>
              <p style={{fontSize: "32px"}}>{ weatherData.windKm.toFixed(2) } Km/h </p>
            
            </div>

            <div className="card">
              <h2>Cloudy <WiCloud size={85} color='"gray"' /></h2>
              <p style={{fontSize: "32px"}}>{ weatherData.clouds } %</p>
            
            </div>

            <div className="card">
              <h2>Pressure <WiBarometer size={85} color='"gray"' /></h2>
              <p style={{fontSize: "32px"}}>
                { weatherData.pressure } °
              </p>
            
            </div>
            <div className="card">
              <h2>Latitude &rarr;</h2>
              <p style={{fontSize: "32px"}}>
                { latitude }
              </p>
            </div> 

            <div className="card">
              <h2>Longitude &rarr;</h2>
              <p style={{fontSize: "32px"}}>
                { longitude }
              </p>
            </div>          
            <div className="card">
              <h2>Humidity <WiHumidity size={80} color='"gray"' /></h2>
              <p style={{fontSize: "32px"}}>
                { weatherData.humidity } %
              </p>
            </div>
          </div>
        </main>
        <footer className="footer">
          Made by &nbsp; <a href="https://twitter.com/blaessster">@blaessster</a>
        </footer>
      </>
    )}
    </div>
  )
}
