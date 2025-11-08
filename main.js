const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

async function search(city){
    if(!city) return;
    try {
        const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=7d77b96c972b4d119a3151101212704&q=${city}&days=3`);
        if(!res.ok) throw new Error("City not found");
        const data = await res.json();
        displayForecast(data);
    } catch(err){
        console.error(err);
        document.getElementById("forecast").innerHTML = `<p class="text-center text-danger">City not found!</p>`;
    }
}

function displayForecast(data){
    const forecastContainer = document.getElementById("forecast");
    forecastContainer.innerHTML = "";

    // Current day
    const now = new Date(data.current.last_updated.replace(" ","T"));
    const currentCard = `
      <div class="col-md-4">
        <div class="forecast-card">
          <div class="day">${days[now.getDay()]}, ${now.getDate()} ${monthNames[now.getMonth()]}</div>
          <div class="location">${data.location.name}</div>
          <div class="degree">${data.current.temp_c}<sup>°C</sup></div>
          <img src="https:${data.current.condition.icon}" alt="${data.current.condition.text}">
          <div class="custom">${data.current.condition.text}</div>
          <div class="extra-info">
            <span><i class="fa fa-umbrella"></i> ${data.current.humidity}%</span>
            <span><i class="fa fa-wind"></i> ${data.current.wind_kph} km/h</span>
            <span><i class="fa fa-compass"></i> ${data.current.wind_dir}</span>
          </div>
        </div>
      </div>
    `;
    forecastContainer.innerHTML += currentCard;

    // Next 2 days
    data.forecast.forecastday.forEach((day,index)=>{
        if(index===0) return;
        const d = new Date(day.date.replace(" ","T"));
        const nextCard = `
          <div class="col-md-3 col-sm-6">
            <div class="forecast-card">
              <div class="day">${days[d.getDay()]}</div>
              <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}" width="64">
              <div class="degree">${day.day.maxtemp_c}<sup>°C</sup></div>
              <div class="small-degree">${day.day.mintemp_c}<sup>°C</sup></div>
              <div class="custom">${day.day.condition.text}</div>
              <div class="extra-info">
                <span><i class="fa fa-umbrella"></i> ${day.day.daily_chance_of_rain}%</span>
                <span><i class="fa fa-wind"></i> ${day.day.maxwind_kph} km/h</span>
                <span><i class="fa fa-compass"></i> ${day.day.condition.text}</span>
              </div>
            </div>
          </div>
        `;
        forecastContainer.innerHTML += nextCard;
    });
}

document.getElementById("search").addEventListener("keyup", e => search(e.target.value));

// Default city
search("Cairo");
