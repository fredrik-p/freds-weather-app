import React, { useState, useEffect } from "react";

import Weather from './Weather'

const Main = () => {
    const [weather, setWeather] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [symbol, setSymbol] = useState("");
    const [weatherData, setWeatherData] = useState("");

    let city = "Malmö";

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
        <Weather weather={weather} weatherData={weatherData} loading={loading} symbol={symbol} error={error} city={city} />
    );
};

export default Main;
