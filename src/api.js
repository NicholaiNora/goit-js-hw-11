import axios from 'axios';

const URL = 'https://pixabay.com/api/';

const options = {
  params: {
    key: '43784096-87519b5a7d318238fedcc7f7a',
    q: '',
    image_type: "photo",
    orientation: "horizontal",
    safesearch: true,
    page: 1,
    per_page: 40,
  },
};

async function fetchItems() {
  const res = await axios.get(URL, options);
  console.log(res);
  return res;
}

export { fetchItems, options };
