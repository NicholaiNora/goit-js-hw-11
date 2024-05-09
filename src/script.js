import { fetchItems, options } from "./api";
import Notiflix from "notiflix";
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';


const form = document.getElementById("search-form");
const input = document.querySelector("input[name='searchQuery']");
const gallery = document.querySelector('.gallery');

var lightbox = new SimpleLightbox('.gallery a', {
  captionsData: "alt",
  captionDelay: 250,
});
let reachEnd = false;


form.addEventListener("submit", (e) => {
  e.preventDefault();
  options.params.q = input.value.trim();
  
  if (options.params.q === "") return;
  options.params.page = 1;
  gallery.innerHTML = "";

  fetchItems().then(res => {
    try {
      if (res.data.totalHits == 0) {
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
      } else {
        Notiflix.Notify.success(`Hooray! We found ${res.data.totalHits} images`);
        renderGallery(res.data.hits);
      }
    } catch (e) {
      Notiflix.Notify.failure(e);
    }     
  });
  form.reset();
})



function loadMore() {
  options.params.page += 1;
  try {
    fetchItems().then(res => {
      renderGallery(res.data.hits);
      if (options.params.page * options.params.per_page >= res.data.totalHits) {
        Notiflix.Notify.info(
          "We are sorry but you've reached the end of the search result"
        );
      }
    })
  } catch (e) {
    console.log(e);
    Notiflix.Notify.failure(e);
  }
}

window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight) {
      loadMore();
  }
});


function renderGallery(hits) {
  let markup = hits.map(
    ({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) => {
      return `<a href="${largeImageURL}">
                <div class="photo-card">
                    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
                    <div class="info">
                        <p class="info-item">
                            <b>Likes</b>
                              ${likes}
                        </p>
                        <p class="info-item">
                            <b>Views</b>
                              ${views}
                        </p>
                        <p class="info-item">
                        <b>Comments</b>
                          ${comments}
                        </p>
                        <p class="info-item">
                        <b>Downloads</b>
                          ${downloads}
                        </p>
                    </div>
                </div>
              </a>`;
    }
  ).join("");
  gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}