import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWind } from '@fortawesome/free-solid-svg-icons';

const Main = () => {
    const [weather, setWeather] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [symbol, setSymbol] = useState("");
    const [weatherData, setWeatherData] = useState("");
    const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];

    let city = "Malmö";
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

    useEffect(() => {
        let long = '13.0109';
        let lat = '55.5791';
        const api = `https://api.met.no/weatherapi/locationforecast/2.0/complete?lat=${lat}&lon=${long}`;

        //fetch weather forecast
        const getWeather = async () => {
            try {
                setLoading(true);
                const result = await fetch(api);
                if (!result.ok) {
                    throw Error("Could not fetch data");
                }
                const data = await result.json();
                setWeather(data);
            } catch (err) {
                setError(err.message);
                console.log("Error:", err);
            } finally {
                setLoading(false);
            }
        };
        getWeather();

    }, []);

    useEffect(() => {
        if (weather.properties) {
            // console.log("weather.properties: ", weather.properties);

            //symbol for icon
            const symbol =
                weather.properties.timeseries[0].data.next_1_hours.summary.symbol_code;
            setSymbol(symbol);

            //find weather for following hours
            const myWeatherData = weather.properties.timeseries.slice(1, 13).map((item) => {
                const date = new Date(item.time)
                return {
                    hour: date.toTimeString().substring(0, 2),
                    icon: item.data.next_1_hours.summary.symbol_code,
                    temp:
                        Math.round(item.data.instant.details.air_temperature) +

                        " °C",

                    wind: item.data.instant.details.wind_speed + " m/s",
                };
            });
            //console.log("myWeatherData: ", myWeatherData);
            setWeatherData(myWeatherData);
        }
    }, [weather]);

    return (
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
    );
};

export default Main;
