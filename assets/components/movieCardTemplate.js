const API_KEY = "16b00eb1";

async function request(params) {
    const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&${params}`);
    if (!res.ok) throw new Error (`Erreur HTTP ${res.status}`);

    const data = await res.json();
    if (data.Response === 'False') throw new Error(data.Error);

    return data;
}

export function searchMovies(query, page = 1, signal, filters = {}) {
    const params = new URLSearchParams({s: query, page, ...filters});
    return request (params.toString(), signal);
}

export function getMovie(id, plot = 'short') {
    return request(`i=${encodeURIComponent(id)}&plot=${plot}`);
}

const template = document.createElement("template");
template.innerHTML = `
<li class="movieCard">
    <div class="posterCard"><img data-poster alt=""></div>
    <div class="cardContent">
        <h3 class="headerCard"><a data-title></a></h3>
        <div class="bodyCard">
            <p data-plot></p>
            <ul data-only="full">
                <li>Genres : <span data-genre></span></li>
                <li>Acteurs : <span data-actors></span></li>
                <li>Note : <span data-rating></span></li>
                <li>Sortie : <span data-released></span></li>
            </ul>
        </div>
    </div>
</li>
`;

export function createMovieCard(movie, variant = "short") {
    const card = template.content.cloneNode(true).children[0];

    card.querySelectorAll("[data-only]").forEach(el => {
        if (el.dataset.only !==variant) el.remove();
    });
    card.classList.add(`movieCard--${variant}`);

    const noPoster = "assets/img/noPoster.jpg";
    const poster = card.querySelector("[data-poster]");
    poster.addEventListener("error", () => {
        poster.src = noPoster;
    }, {once: true});
    poster.src = movie.Poster !== "N/A" ? movie.Poster : noPoster;
    poster.alt = `Affiche de ${movie.Title}`;

    const title = card.querySelector("[data-title]");
    title.textContent = movie.Title;
    title.href = `movie.html?id=${movie.imdbID}`;

    card.querySelector("[data-plot]").textContent = movie.Plot;

    if (variant === "full") {
        card.querySelector("[data-genre]").textContent = movie.Genre;
        card.querySelector("[data-actors]").textContent = movie.Actors;
        card.querySelector("[data-rating]").textContent = movie.imdbRating !== "N/A" ? `${movie.imdbRating}/10` : "Non noté"; 
        card.querySelector("[data-released]").textContent = movie.Released !== "N/A" ? new Date(movie.Released).toLocaleDateString("fr-FR") : "Inconnue";
    }
    return card;
}

export async function displayMovies(container,query, page = 1, signal, filters = {}) {
    const { Search, totalResults } = await searchMovies(query, page, signal, filters);
    const movies = await Promise.all(Search.map(m => getMovie(m.imdbID, "short", signal)));
    movies.forEach(movie => container.append(createMovieCard(movie, "short")));
    return Number(totalResults);
    
}

export function showMessage(element, text) {
    element.textContent = text;
    element.hidden = !text;
}