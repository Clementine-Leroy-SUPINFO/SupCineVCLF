import { getMovie,createMovieCard, showMessage
 } from "../components/movieCardTemplate.js";

 const container = document.querySelector("[data-movieCardContainer]");
 const message = document.querySelector("[data-message]");

 const id = new URLSearchParams(location.search).get("id");
 try {
    if (!id) throw new Error("Aucun film selectionné.");
    const movie = await getMovie(id, "full");
    document.title = `${movie.Title} - SupCiné`;
    container.append(createMovieCard(movie, "full"));
} catch (error) {
    showMessage(message, `Impossible de charger le film : ${error.message}`);
}