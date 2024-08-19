import { fetchImages } from './js/pixabay-api.js';
import { renderImages, showError, showLoading, hideLoading, showEndMessage } from './js/render-functions.js';

const form = document.getElementById('search-form');
const input = document.getElementById('search-input');
const gallery = document.getElementById('image-gallery');
const loadMoreButton = document.getElementById('load-more');

let currentPage = 1;
let currentQuery = '';
let totalHits = 0;
const perPage = 15;

form.addEventListener('submit', handleSearch);
loadMoreButton.addEventListener('click', handleLoadMore);

function handleSearch(event) {
  event.preventDefault();

  const query = input.value.trim();
  if (query === '') {
    showError('Please enter a search term.');
    return;
  }

  currentQuery = query;
  currentPage = 1;
  gallery.innerHTML = '';
  showLoading(loadMoreButton);

  fetchImages(currentQuery, currentPage, perPage).then(({ images, total }) => {
    hideLoading(loadMoreButton);
    totalHits = total;

    if (images.length === 0) {
      gallery.innerHTML = "";
      showError('Sorry, there are no images matching your search query. Please try again!');
      loadMoreButton.style.display = 'none';
    } else {
      renderImages(images);
      if (images.length < perPage || images.length === totalHits) {
        loadMoreButton.style.display = 'none';
        showEndMessage();
      } else {
        loadMoreButton.style.display = 'block';
      }
    }
  }).catch(error => {
    hideLoading(loadMoreButton);
    showError('An error occurred while fetching images. Please try again later.');
  });
}

function handleLoadMore() {
  currentPage += 1;
  showLoading(loadMoreButton);

  fetchImages(currentQuery, currentPage, perPage).then(({ images }) => {
    renderImages(images);
      hideLoading(loadMoreButton);
      
        const firstGalleryItem = gallery.querySelector('.gallery-item');
    if (firstGalleryItem) {
      const { height } = firstGalleryItem.getBoundingClientRect();
      window.scrollBy({
        top: height * 2.5,
        behavior: 'smooth'
      });
    }

    const loadedImagesCount = currentPage * perPage;

    if (loadedImagesCount >= totalHits) {
      loadMoreButton.style.display = 'none';
      showEndMessage();
    } else if (images.length < perPage) {
      loadMoreButton.style.display = 'none';
      showEndMessage();
    }
  }).catch(error => {
    hideLoading(loadMoreButton);
    showError('An error occurred while fetching images. Please try again later.');
  });
}
