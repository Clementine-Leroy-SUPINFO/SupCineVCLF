import { displayMovies, showMessage } from "../components/movieCardTemplate.js";

const container = document.querySelector("[data-movieCardContainer]");
const loadMoreBtn = document.querySelector("[data-loadMore]");
const message = document.querySelector("[data-message]");

const query = "love";
const filters = {y : 2024, type : "movie"}
const perPage = 5;
let page = 1;

async function load() {
    loadMoreBtn.disabled = true;
    showMessage(message,"");
    try {
        const total = await displayMovies(container, query, page, undefined, filters);
        loadMoreBtn.hidden = page * perPage >= total;
        page++;
    } catch (error) {
        showMessage(message, `Impossible de charger les films : ${error.message}`);
    } finally {
        loadMoreBtn.disabled = false
    }
}

loadMoreBtn.addEventListener("click", load);
load();