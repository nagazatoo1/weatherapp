// Variáveis e seleção de elementos
const apiKey = "f38cc0a96b73387bbf446546c9ceb165";
const unsplashApiKey = "1vy2rieGgpypiWSo4k8s48BOMND--7vUiInLrbqE9RU"; // Substitua pela sua chave de API do Unsplash
const unsplashApiURL = "https://api.unsplash.com/photos/random";

const cityInput = document.querySelector("#city-input");
const searchBtn = document.querySelector("#search");

const cityElement = document.querySelector("#city");
const tempElement = document.querySelector("#temperature span");
const descElement = document.querySelector("#description");
const weatherIconElement = document.querySelector("#weather-icon");
const countryElement = document.querySelector("#country");
const humidityElement = document.querySelector("#humidity span");
const windElement = document.querySelector("#wind span");
const weatherContainer = document.querySelector("#weather-data");
const backgroundContainer = document.querySelector("#background-container");
const errorElement = document.querySelector("#error");

const loadingElement = document.querySelector("#weather-loading");

// Funções
const showLoading = () => {
  loadingElement.style.display = "block";
};

const hideLoading = () => {
  loadingElement.style.display = "none";
};

const getWeatherData = async (city) => {
  const apiWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=pt_br`;

  const res = await fetch(apiWeatherURL);
  const data = await res.json();

  return data;
};

const getBackgroundImage = async (city) => {
  const unsplashURL = `${unsplashApiURL}?query=${city}&client_id=${unsplashApiKey}`;

  const res = await fetch(unsplashURL);
  const data = await res.json();

  return data.urls.regular;
};

const updateBackgroundImage = async (city) => {
  try {
    const backgroundImage = await getBackgroundImage(city);
    backgroundContainer.style.backgroundImage = `url("${backgroundImage}")`;
  } catch (error) {
    console.error("Erro ao obter imagem de fundo:", error);
  }
};


const showWeatherData = async (city) => {
  try {
    showLoading();

    const data = await getWeatherData(city);

    if (data.cod === "404") {
      throw new Error("Cidade não encontrada");
    }

    cityElement.innerText = data.name;
    tempElement.innerText = parseInt(data.main.temp);
    descElement.innerText = data.weather[0].description;
    weatherIconElement.setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`
    );

    const countryFlag = document.createElement("img");
    countryFlag.setAttribute(
      "src",
      `https://flagcdn.com/32x24/${data.sys.country.toLowerCase()}.png`
    );
    countryElement.innerHTML = "";
    countryElement.appendChild(countryFlag);
    humidityElement.innerText = `${data.main.humidity}%`;
    windElement.innerText = `${data.wind.speed}km/h`;

    weatherContainer.classList.remove("hide");

    await updateBackgroundImage(city);

    hideNotFoundError(); // Oculta o erro se estava sendo exibido anteriormente
  } catch (error) {
    console.error("Erro ao obter dados do clima:", error);
    showNotFoundError();
  } finally {
    hideLoading();
  }
};

// Eventos
searchBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const city = cityInput.value;

  showWeatherData(city);
});

cityInput.addEventListener("keyup", (e) => {
  if (e.code === "Enter") {
    const city = e.target.value;

    showWeatherData(city);
  }
});
