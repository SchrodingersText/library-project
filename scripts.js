// Book object constructor 
function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

// Create the toggleRead method 
Book.prototype.toggleRead = function() {
    this.read = !this.read; 
}

// Change books read status, and button appearance on click
document.querySelector('main').addEventListener('click', (e) => {
    if (e.target.classList.contains('read-button')) {
        const bookIndex = parseInt(e.target.closest('article').dataset.id);
        const book = myLibrary[bookIndex]
        book.toggleRead();
        if (book.read) {
            e.target.classList.replace('unread', 'read');
            e.target.innerText = 'read';
        } else {
            e.target.classList.replace('read', 'unread');
            e.target.innerText = 'not read';
        }
    }   
})

// const myLibrary = [
//     {title: 'The Hobbit', author: 'J. R. R. Tolkien', pages: 310, read: true},
//     {title: 'The Fellowship of the Ring', author: 'J. R. R. Tolkien', pages: 423, read: true},
//     {title: 'The Two Towers', author: 'J. R. R. Tolkien', pages: 352, read: true},
//     {title: 'The Return of the King', author: 'J. R. R. Tolkien', pages: 416, read: false},
// ];

const myLibrary = [];

// Add a Book object to the myLibrary array
function addToLibrary(book) {
    myLibrary.push(book);
}

// Populate the page with the books in myLibrary
function displayLibrary() {
    const main = document.querySelector('main');
    main.textContent = '';
    let i = 0;
    myLibrary.forEach((book) => {
        // Create the card and its constituent elements
        const bookCard = document.createElement('article');
        const bookTitle = document.createElement('h2');
        const bookAuthor = document.createElement('h3');
        const bookPages =  document.createElement('p');
        const bookRead = document.createElement('button');
        const bookRemove = document.createElement('button');
        const iconRemove = document.createElement('img');
        const iconFav = document.createElement('img');
        
        // Set the content of the card elements
        bookTitle.textContent = book.title;
        bookAuthor.textContent = book.author;
        if (book.pages) {
            bookPages.textContent = `${book.pages} pages`
        }
        if (book.read) {
            bookRead.textContent = 'read';
            bookRead.classList.add('read');
        } else {
            bookRead.textContent = 'not read';
            bookRead.classList.add('unread');

        }
        iconRemove.setAttribute('src', 'assets/noun-wrong-book-6046461.svg');
        if(book.favorite) {
            iconFav.setAttribute('src', 'assets/heart-fill.svg');
        } else {
            iconFav.setAttribute('src', 'assets/heart.svg');
        }

        // Set attributes on card elements
        bookCard.setAttribute('class', 'card-container');
        bookTitle.setAttribute('class', 'card-container__title');
        bookAuthor.setAttribute('class', 'card-container__author');
        bookPages.setAttribute('class', 'card-container__pages');
        bookRead.classList.add('read-button');
        bookRemove.setAttribute('class', 'remove-book');
        bookRemove.setAttribute('title', 'Remove book');
        iconRemove.setAttribute('width', '20px');
        iconRemove.setAttribute('id', 'remove-button');
        iconFav.setAttribute('width', '20px');
        iconFav.setAttribute('id', 'fav-button');

        // Give card a data attribute referring to its myLibrary index
        const dataId = i.toString();
        bookCard.setAttribute('data-id', dataId)

        // Append the card and its constituent elements to the main container
        bookCard.appendChild(bookTitle);
        bookCard.appendChild(bookAuthor);
        bookCard.appendChild(bookPages);
        bookCard.appendChild(bookRead);
        bookRemove.appendChild(iconRemove);
        bookCard.appendChild(bookRemove);
        bookCard.appendChild(iconFav);
    
        main.appendChild(bookCard);

        i++
    })
}

displayLibrary()

// Open/close the new-book form
const newBookButton = document.querySelector('button.new-book');
const closeFormButton = document.querySelector('button.close-form');

function toggleForm() {
    const form = document.querySelector('.new-book__form');

    if (form.classList.contains('closed')) {
        form.classList.remove('closed')
        newBookButton.classList.add('hidden');
    } else {
        form.classList.add('closed');
        newBookButton.classList.remove('hidden');
    }
}

newBookButton.addEventListener('click', toggleForm);
closeFormButton.addEventListener('click', toggleForm);

// Close form when user clicks outside of it
document.querySelector('aside.new-book__form').addEventListener('click', (e) => {
     e.stopPropagation()
});
document.addEventListener('click', (e) => {
    if (!(e.target.id === 'new-book-img')) {
        document.querySelector('aside.new-book__form').classList.add('closed');
        newBookButton.classList.remove('hidden');
    }
});

document.querySelector('aside.new-book__form').addEventListener('click', e => e.stopPropagation())

// Create a book object from user input & display it on the page
const submitBookButton = document.querySelector('button.submit');

function createBook() {
    const titleValue = document.getElementById('book-title').value ;
    const authorValue = document.getElementById('book-author').value ;
    const pagesValue = document.getElementById('book-pages').value ; 
    const readValue = document.querySelector('input[name="book-read"]:checked').value;

    const newBook = new Book(titleValue, authorValue, pagesValue, Boolean(parseInt(readValue)));
    addToLibrary(newBook)
}

submitBookButton.addEventListener('click', (e) => {
    e.preventDefault();
    const formValid = checkFormValidity();
    if (formValid) {
        createBook();
        displayLibrary();
        clearForm()
    } 
})

// Clear the form after it's submitted
function clearForm() {
    document.getElementById('form').reset();

    // Remove any error messages & invalid input styling
    const errorMsgs = document.querySelectorAll('span.err-msg');
    for (let msg of errorMsgs) {
        msg.classList.remove('err-msg')
        msg.textContent = ''
    }
}

// Remove book from page & myLibrary array
document.querySelector('main').addEventListener('click', (e) => {
    if (e.target.id === 'remove-button') {
        const bookIndex = parseInt(e.target.closest('article').dataset.id);
        removeBook(bookIndex);
    }
})

function removeBook(id) {
   myLibrary.splice(id, 1);
   displayLibrary();   
}


// Favorite/unfavorite a book
document.querySelector('main').addEventListener('click', (e) => {
    if (e.target.id === 'fav-button') {
        const bookIndex = parseInt(e.target.closest('article').dataset.id);
        const book = myLibrary[bookIndex]
        if (!e.target.classList.contains('favorite')){
            e.target.classList.add('favorite');
            e.target.setAttribute('src', 'assets/heart-fill.svg');
            book.favorite = true;
        } else {
            e.target.classList.remove('favorite');
            e.target.setAttribute('src', 'assets/heart.svg');
            delete book.favorite;
        }    
    }
})

// Check that all input fields are valid
function checkFormValidity() {
    const titleValid = document.getElementById('book-title').checkValidity();
    const authorValid = document.getElementById('book-author').checkValidity();
    const readValid = document.getElementById('book-read__true').checkValidity();
    if (titleValid && authorValid && readValid) {
        return true;
    } else {
        showErrMsg(titleValid, authorValid, readValid)
    }
}

// Display error message for invalid inputs
function showErrMsg(...theArgs) {
   for (let i = 0; i < theArgs.length; i++) {
    if (!theArgs[i]) {
        document.querySelector(`span:nth-of-type(${i + 1})`).classList.add('err-msg')
        switch (i) {
            case 0: 
                document.querySelector(`span:nth-of-type(${i + 1})`).textContent = 'This field is required';
                break;
            case 1:
                document.querySelector(`span:nth-of-type(${i + 1})`).textContent = 'This field is required';
                break;
            case 2:
                document.querySelector(`span:nth-of-type(${i + 1})`).textContent = 'This field is required, please choose an option';
                break;
        }
    } 
    else {
        document.querySelector(`span:nth-of-type(${i + 1})`).classList.remove('err-msg');
        document.querySelector(`span:nth-of-type(${i + 1})`).textContent = '';
    }
   }
}