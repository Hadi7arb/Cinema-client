const slidesContainer = document.getElementById('slides');
const movieGridContainer = document.getElementById('card-container');

let totalSlides = 0;
let currentIndex = 0;

function renderMovies(movies) {
    slidesContainer.innerHTML = '';
    movieGridContainer.innerHTML = '';

    for (let i = 0; i < movies.length; i++) {
        const movie = movies[i];

        if (i < 3) {
            const slide = document.createElement('div');
            slide.className = 'slide';
            slide.style.backgroundImage = "url('" + movie.imageURL + "')";
            slide.title = movie.title;

            const overlay = document.createElement('div');
            overlay.className = 'movie-info-overlay';
            overlay.innerHTML = `
                <h3>${movie.title}</h3>
                <p>Release Date: ${movie.release_date}</p>
                <p>Duration: ${movie.duration} min</p>
                <p>Age Restriction: ${movie.age_restriction}</p>
            `;
            slide.appendChild(overlay);

            slidesContainer.appendChild(slide);
        }

        const card = document.createElement('div');
        card.className = 'movie-card';

        card.innerHTML = `
            <img src="${movie.imageURL}" alt="${movie.title} Poster" class="movie-poster">
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <p class="movie-meta">Release: ${movie.release_date}</p>
                <p class="movie-meta">Duration: ${movie.duration} min</p>
                <p class="movie-meta">Rating: ${movie.age_restriction}</p>
                <a href="movie-details.html?id=${movie.movie_id}" class="details-link">View Details</a>
                <button class="book-ticket-button" data-movie-id="${movie.movie_id}"></button>
            </div>
        `;
        movieGridContainer.appendChild(card);
    }

    totalSlides = slidesContainer.children.length;
    showSlide(currentIndex);
}

function fetchMovies() {
    axios.get('http://localhost/Cinema-server/controllers/get_movies.php')
        .then(function(response) {
            const data = response.data;
            if (data.status === 200 && data.movies) {
                renderMovies(data.movies);
            } else {
                console.error('API response error:', data.message ? data.message : 'No movies found in response.');
            }
        });
}

function showSlide(index) {
    if (totalSlides === 0) {
        return;
    }

    if (index >= totalSlides) {
        currentIndex = 0;
    } else if (index < 0) {
        currentIndex = totalSlides - 1;
    } else {
        currentIndex = index;
    }

    slidesContainer.style.transform = 'translateX(' + (-currentIndex * 100) + '%)';
}

function nextSlide() {
    showSlide(currentIndex + 1);
}

function prevSlide() {
    showSlide(currentIndex - 1);
}

document.addEventListener('DOMContentLoaded', fetchMovies);
