class Book {

  // Constructor
  constructor(title, author, pages) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isAvailable = true; // default value
  }

  // Methods
  borrow() {
    this.isAvailable = false;
  }

  returnBook() {
    this.isAvailable = true;
  }

  getInfo() {
    return `${this.title} by ${this.author} (${this.pages} pages)`;
  }

  isLongBook() {
    return this.pages > 300;
  }
}

//  Create 5 Book Objects
let book1 = new Book("Harry Potter", "J.K. Rowling", 350);
let book2 = new Book("1984", "George Orwell", 328);
let book3 = new Book("The Hobbit", "J.R.R. Tolkien", 310);
let book4 = new Book("Wings of Fire", "A.P.J. Abdul Kalam", 180);
let book5 = new Book("The Alchemist", "Paulo Coelho", 208);

// Store in array
let library = [book1, book2, book3, book4, book5];


//  i. Display info of all books
console.log("All Books:");
for( book of library)
  console.log(book.getInfo());


//  ii. Borrow 2 books
book1.borrow();
book3.borrow();

console.log("\nAfter Borrowing 2 Books:");
console.log(book1.title, "Available:", book1.isAvailable);
console.log(book3.title, "Available:", book3.isAvailable);


//  iii. Return 1 book
book1.returnBook();

console.log("\nAfter Returning 1 Book:");
console.log(book1.title, "Available:", book1.isAvailable);


// iv. Count long books (>300 pages)
let longBooksCount = library.filter(book => book.isLongBook()).length;
console.log("\nNumber of Long Books:", longBooksCount);


//  v. List all available books
let availableBooks = library.filter(book => book.isAvailable);

console.log("\nAvailable Books:");
for(book of availableBooks)
  console.log(book.title);


