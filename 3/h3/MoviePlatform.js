const movies = [
  { id: 1, title: "Inception", genre: "Sci-Fi", rating: 8.8 },
  { id: 2, title: "Joker", genre: "Drama", rating: 8.4 },
  { id: 3, title: "Avengers", genre: "Action", rating: 8.0 },
  { id: 4, title: "Interstellar", genre: "Sci-Fi", rating: 8.6 }
];

let movie=movies.filter(movie=>movie.genre==='Sci-Fi')
console.log("Only Sci-Fi movies : ",movie)

let movieMap=movies.map(m=>
  `${m.title}  (${m.rating})`);
console.log("Return movie : ",movieMap)

let avgRating=movies.reduce((acc,movie)=>acc+movie.rating,0)
console.log("Average movie rating : ",avgRating/movies.length)

let movieFind=movies.find(movie=>movie.title==='Joker')
console.log("movie : ",movieFind)

let movieIndex=movies.findIndex(movie=>movie.title==='Avengers')
console.log("movie Index of Avengers : ",movieIndex)
