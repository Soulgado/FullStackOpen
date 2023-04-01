import { useEffect, useState } from "react";
import axios from "axios";

const Weather = ({ weather }) => {
    if (!weather) return null;

    return (
        <>
            <div>Temperature: {weather.main.temp} Celcius</div>
            <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={`Icon showing ${weather.weather[0].description}`}
            />
            <div>Wind: {weather.wind.speed} m/s</div>
        </>
    );
}

const Countries = ({ countries, handleShowClick }) => {
    const [weather, setWeather] = useState(null);
    const api_key = process.env.REACT_APP_API_KEY;

    useEffect(() => {
        if (countries && countries.length === 1) {
            axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${countries[0].capitalInfo.latlng[0]}&lon=${countries[0].capitalInfo.latlng[1]}&appid=${api_key}&units=metric`)
                .then(response => {
                    setWeather(response.data);
                })
                .catch(error => console.log(`Error while loading weather data: ${error}`));
        }
    }, [countries]);

    if (!countries) return null;

    if (countries.length > 10) return <div>Too many matches, specify another filter</div>;

    if (countries.length < 10 && countries.length > 1) {
        return (
            <ul>
                {countries.map(country => {
                    return (
                        <div key={country.name.common}>
                            {country.name.common}
                            <button type="button" onClick={handleShowClick(country.name.common)}>Show</button>
                        </div>
                    );
                })}
            </ul>
        );
    }

    if (countries.length === 1) {
        return (
            <div>
                <h2>{countries[0].name.common}</h2>
                <div>Capital: {countries[0].capital}</div>
                <div>Area: {countries[0].area} sq. km.</div>
                <div>
                    <strong>Languages:</strong>
                    <ul>
                        {Object.values(countries[0].languages)
                            .map(language => <li key={language}>{language}</li>)}
                    </ul>
                </div>
                <img src={countries[0].flags.png} alt={countries[0].flags.alt} />
                <h3>Weather in {countries[0].capital}</h3>
                <Weather weather={weather} />
            </div>
        );
    }
}

export default Countries;