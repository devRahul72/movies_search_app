const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const movieResults = document.getElementById("movieResults");
const modal = document.getElementById("movieModal");
const closeBtn = document.querySelector(".close");

// Event listeners
searchBtn.addEventListener("click", fetchAndDisplayMovies);
searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") fetchAndDisplayMovies();
});
closeBtn.addEventListener("click", () => modal.style.display = "none");
window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
});

// Fetch and display search results
function fetchAndDisplayMovies() {
    const query = searchInput.value.trim();
    const apiKey = "43efddc8"; // Your OMDB API key
    const url = `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${apiKey}`;

    if (!query) {
        movieResults.innerHTML = "<p>Please enter a movie name.</p>";
        return;
    }

    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.Response === "True") {
                displayMovies(data.Search);
            } else {
                movieResults.innerHTML = `<p>No results found for "${query}".</p>`;
            }
        })
        .catch(err => {
            console.error("Error fetching movies:", err);
            movieResults.innerHTML = `<p style="color:red;">Error loading movies.</p>`;
        });
}

// Display movie cards
function displayMovies(movies) {
    movieResults.innerHTML = "";

    movies.forEach(movie => {
        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card");

        const posterURL = movie.Poster !== "N/A" ? movie.Poster : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/200px-No_image_available.svg.png";

        movieCard.innerHTML = `
            <div class="poster-box">
                <img src="${posterURL}" alt="${movie.Title}">
            </div>
            <div class="movie-info">
                <h2>${movie.Title}</h2>
                <p>Release Year: ${movie.Year}</p>
                <button class="info-btn" data-id="${movie.imdbID}">More Info</button>
            </div>
        `;

        movieResults.appendChild(movieCard);
    });

    // Add event to each "More Info" button
    const infoButtons = document.querySelectorAll(".info-btn");
    infoButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const imdbID = btn.getAttribute("data-id");
            fetchMovieDetailsToModal(imdbID);
        });
    });
}

// Fetch and show modal with more details
function fetchMovieDetailsToModal(imdbID) {
    const apiKey = "43efddc8";
    const url = `https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.Response === "True") {
                const modalContent = `
                    <h2>${data.Title} (${data.Year})</h2>
                    <p><strong>Director:</strong> ${data.Director}</p>
                    <p><strong>Actors:</strong> ${data.Actors}</p>
                    <p><strong>Plot:</strong> ${data.Plot}</p>
                    <img src="${data.Poster !== "N/A" ? data.Poster : ''}" 
                         alt="${data.Title}" 
                         style="width: 100%; margin-top: 10px; border-radius: 5px;" />
                `;
                document.getElementById("modalDetails").innerHTML = modalContent;
                openModal();
            } else {
                document.getElementById("modalDetails").innerHTML = `<p style="color:red;">Details not found.</p>`;
                openModal();
            }
        })
        .catch(err => {
            console.error("Modal fetch error:", err);
            document.getElementById("modalDetails").innerHTML = `<p style="color:red;">Failed to load details.</p>`;
            openModal();
        });
}

function openModal() {
    modal.style.display = "block";
}
