const movieCardTemplate = document.querySelector("[data-MovieTemplate]")
const movieCardContainer = document.querySelector("[data-movieCardContainer]")


fetch('http://www.omdbapi.com/?apikey=16b00eb1&')
    .then(res => res.json())
    .then(data => {
        data.forEach(movie => {
            const movieCard = movieCardTemplate.content.cloneNode(true).children[0]
            const headerCard = movieCard.querySelector("[data-headerCard]")
            const bodyCard = movieCard.querySelector("[data-bodyCard]")
            headerCard.textContent = movieCard.Title
            bodyCard.textContent = movieCard.Plot
            movieCardContainer.append(movieCard)
        })

    })