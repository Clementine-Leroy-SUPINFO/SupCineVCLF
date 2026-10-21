import { displayMovies, showMessage } from "../components/movieCardTemplate.js";

const form = document.querySelector("[data-searchForm]");
const input = document.querySelector("[data-searchInput]");
const container = document.querySelector("[data-movieCardContainer]");
const loadMoreBtn = document.querySelector("[data-loadMore]");
const message = document.querySelector("[data-message]");
const resultCount = document.querySelector("[data-resultCount]");

const perPage = 10;
const minChars= 3;
const delay = 400;
let query = "";
let timer;
let controller;
let page = 1;

async function load() {
    controller?.abort();
    controller = new AbortController();
    const {signal} = controller;

    loadMoreBtn.disabled = true;
    showMessage(message,"");
    try {
        const total = await displayMovies(container, query, page, signal);
        resultCount.textContent = `${total} résultat(s) pour "${query}"`;
        loadMoreBtn.hidden = page * perPage >= total;
        page++;
    } catch (error) {
        if (error.name == "AbortError") return;
        resultCount.textContent = "";
        loadMoreBtn.hidden = true;
        showMessage(message, `Impossible de charger les films : ${error.message}`);
    } finally {
        if (!signal.aborted) loadMoreBtn.disabled = false;
    }
}

function reset() {
    controller?.abort();
    container.replaceChildren();
    resultCount.textContent = "";
    loadMoreBtn.hidden = true;
    showMessage(message, "");
}

function newSearch(text) {
    query = text.trim();
    page= 1;
    reset();
    if (query.length < minChars) return;
    load();
}
input.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout( () => newSearch(input.value), delay)
})

form.addEventListener("submit", event => {
    event.preventDefault();
    clearTimeout(timer);
    newSearch(input.value);
})

loadMoreBtn.addEventListener("click", load);

const initialQuery = new URLSearchParams(location.search).get("q");
if(initialQuery) {
    input.value = initialQuery;
    newSearch(initialQuery);
}