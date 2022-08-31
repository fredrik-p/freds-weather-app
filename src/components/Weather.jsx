import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWind } from '@fortawesome/free-solid-svg-icons';

// days of the week
const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

//date and time for today
const dateBuilder = () => {
    let mydate = new Date();
    const current = new Date();
    const date = `${current.getDate()}/${current.getMonth() + 1}`;
    let hours = mydate.getHours();
    var minutes = (mydate.getMinutes() < 10 ? "0" : "") + mydate.getMinutes();
    let today = days[mydate.getDay()]; //getDay()=no 0-6
    return `${today} ${date} ${hours}:${minutes} `;
};

//get icon
const icon = (symbol) => {
    return (
        <img src={require(`../assets/png/${symbol}.png`)} alt={symbol} />
    );
};

const Weather = ({ weather, loading, city, symbol, error, weatherData }) => (
    <section className="content">
        <section className="rightNow">
            {loading ? (<span>Fetching the weather data...</span>) : (<span>Todays weather in</span>)}
        </section>
        <section>
            <h5 className="city">{city}</h5>
        </section>

        <section className="today">
            <section className="info">
                <p className="day">{dateBuilder()}</p>
            </section>
            <section className="icon">{symbol && icon(symbol)}</section>

            <section className="data">
                {weather.properties && (
                    <div>
                        <p className="degrees">
                            {Math.round(
                                weather.properties.timeseries[0].data.instant.details
                                    .air_temperature
                            )}{" "}
                            °C
                        </p>
                        <p className="wind">
                            <FontAwesomeIcon icon={faWind} className="wind mt-2"></FontAwesomeIcon>
                            {
                                weather.properties.timeseries[0].data.instant.details
                                    .wind_speed
                            }{" "}
                            m/s
                        </p>
                    </div>
                )}
            </section>
        </section>
        {error && <div className="error">{error}</div>}
        <section className="hour_section">
            <div className="weather_by_hour">
                {weatherData &&
                    weatherData.map((item, index) => {
                        return (
                            <div key={index} className="hour_weather">
                                <p className="hour">{item.hour}</p>
                                <p className="icon">{icon(item.icon)}</p>
                                <section className="data">
                                    <p className="degrees">{item.temp}</p>
                                    <p className="wind"><FontAwesomeIcon icon={faWind} className="wind mt-2"></FontAwesomeIcon>{item.wind}</p>
                                </section>
                            </div>
                        );
                    })}
            </div>
        </section>
    </section>
)

export default Weather;