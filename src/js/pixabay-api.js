import axios from 'axios';

const API_KEY = '45097804-c04896a24774ae5ff52198fb8';
const URL = 'https://pixabay.com/api/';

export async function fetchImages(query, page = 1, perPage = 20) {
  try {
    const response = await axios.get(URL, {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: perPage,
      },
    });

    return {
      images: response.data.hits,
      total: response.data.totalHits
    };
  } catch (error) {
    console.error('Fetching error:', error);
    throw error;
  }
}
