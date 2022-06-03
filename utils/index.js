const emojis = require('./emojis');
const gifs = require('../gifs.json');
const pick = selection => selection[Math.floor(Math.random() * selection.length)];

const getRandomGif = () => pick(gifs.data).images.original.url;
const getRandomEmoji = () => pick(emojis);

async function fetchMorningGif(searchQuery = 'good morning') {
  return fetch(`https://api.giphy.com/v1/gifs/search?api_key=${process.env.GIPHY_API_KEY}&q=${searchQuery}`)
    .then(res => res.json())
    .then(gifs => pick(gifs.data).images.original.url);
}

function isWeekend(date = new Date()) {
  return date.getDay() === 5 || date.getDay() === 6;
}

module.exports = {
  isWeekend,
  getRandomGif,
  getRandomEmoji,
  fetchMorningGif
};
