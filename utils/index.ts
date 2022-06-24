import emojis from './emojis';
import { data } from '../gifs.json';

interface Gif {
  images: {
    original: {
      url: string;
    };
  };
}

const pick = <T>(selection: T[]): T => selection[Math.floor(Math.random() * selection.length)];

const getRandomGif = () => pick<Gif>(data).images.original.url;
const getRandomEmoji = () => pick<string>(emojis);

async function fetchMorningGif(searchQuery = 'good morning') {
  return fetch(`https://api.giphy.com/v1/gifs/search?api_key=${process.env.GIPHY_API_KEY}&q=${searchQuery}`)
    .then(res => res.json())
    .then(gifs => pick<Gif>(gifs.data).images.original.url);
}

function isWeekend(date = new Date()): boolean {
  return date.getDay() === 5 || date.getDay() === 6;
}

export { isWeekend, getRandomGif, getRandomEmoji, fetchMorningGif };
