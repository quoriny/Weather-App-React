import {useState} from 'react';

const API_KEY = import.meta.env.VITE_API_KEY;

function Weather(){

    const [enteredCity, setEnteredCity] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [cityName, setCityName] = useState("");
    const [emoji, setEmoji] = useState("❄️");
    const [temp, setTemp] = useState(0);
    const [weatherStatus, setWeatherStatus] = useState("");
    const [humidity, setHumidity] = useState("");
    const [windSpeed, setWindSpeed] = useState("");
    const [feelsLike, setFeelsLike] = useState();

    function FetchWeather(){
        if(enteredCity.trim() === "") return;

        const card = document.getElementById("weather-card");
        
        const getAPIDetails = async (cityName) => {
            setLoading(true);

            try{
                const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`);

                if(!response.ok)
                    throw({message:"Unable to find weather!"});

                const data = await response.json();

                if(data.cod === "404")
                    throw({message:data.message});

                card.classList.remove("hidden");

                const city_Name = data.name;
                setCityName(city_Name);

                const id = data.weather[0].id;

                if(id >= 200 && id < 300)
                    setEmoji("⛈️");
                else if(id >= 300 && id < 400)
                    setEmoji("🌦️");
                else if(id >= 500 && id < 600)
                    setEmoji("🌧️");
                else if(id >= 600 && id < 700)
                    setEmoji("❄️");
                else if(id >= 700 && id < 800)
                    setEmoji("💨");
                else if(id === 800)
                    setEmoji("☀️");
                else if(id > 800 && id < 900)
                    setEmoji("☁️");

                const tempTemp = (data.main.temp - 273.15).toFixed(1);
                setTemp(tempTemp);

                const wS1 = data.weather[0].main;
                setWeatherStatus(wS1);

                const humidity = data.main.humidity;
                setHumidity(humidity);

                const wind_Speed = (data.wind.speed * 3.6).toFixed(0);
                setWindSpeed(wind_Speed);

                const feels_Like = Math.floor((data.main.feels_like) - 273.15);
                setFeelsLike(feels_Like);
            }catch(err){
                card.classList.add("hidden");
                setError(err.message);

                setTimeout(() => {setError("");}, 2000)
            }finally{
                setLoading(false);
            }
        }

        
        getAPIDetails(enteredCity);
    }

    function handleInputChange(ev){
        setEnteredCity(ev.target.value);
    }

    return(
        <div className='flex flex-col justify-center items-center'>
            <h1 className='text-4xl sm:text-6xl text-black font-semibold mt-5 text-center'>🌤️ Weather Dashboard</h1>
        
            <div className='flex flex-row justify-center items-center mt-10 gap-2'>
                <input onChange={handleInputChange} type="text" className='bg-gray-200 p-2.5 rounded-lg text-center text-lg border-2 border-black font-semibold focus:ring-blue-500 focus:border-blue-200 focus:ring-2 outline-none w-48 sm:w-96' placeholder='Enter a city...' />
                <button onClick={FetchWeather} disabled={loading} className='bg-green-400 hover:bg-green-500 cursor-pointer w-16 p-3 rounded-lg text-sm sm:w-24 sm:text-lg border-2 border-black disabled:bg-gray-200 disabled:cursor-not-allowed'>Search</button>
            </div>

            <p className='text-red-500 text-4xl text-center mt-5'>{error}</p>

            <div id='weather-card' className='hidden mt-10 w-10/12 sm:w-3/4 max-w-3xl bg-linear-to-t from-amber-300 to-blue-500 rounded-lg border-2 border-black'>
                <p className='text-center text-4xl mt-5 font-semibold text-white text-shadow-black text-shadow-md'>{cityName}</p>   
                <p className='text-center text-6xl mt-10 font-bold'>{emoji}</p>
                <p className='text-center text-4xl mt-5 font-semibold'>{temp}°C</p>
                <p className='text-center text-4xl mt-5 font-semibold'>{weatherStatus}</p>

                <div className='flex justify-center items-center gap-8 text-4xl font-mono mt-10'>
                    <p>💧{humidity}%</p>
                    <p>💨{windSpeed} km/h</p>
                </div>

                <p className='text-center text-4xl mt-10 mb-5 font-mono'>Feels like: {feelsLike}°C</p>
            </div>
        </div>
    );
}

export default Weather