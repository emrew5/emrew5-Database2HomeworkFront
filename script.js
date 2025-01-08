const apiUrl = "http://localhost:8082/api/books";
const bookList = document.getElementById("book-list");
const bookModal = document.getElementById("book-modal");
const updateModal = document.getElementById("update-modal");
const addBookBtn = document.getElementById("addBookBtn");
const closeModalBtn = document.getElementById("closeModal");
const closeUpdateModalBtn = document.getElementById("closeUpdateModal");
const bookForm = document.getElementById("book-form");
const updateForm = document.getElementById("update-form");

addBookBtn.addEventListener("click", () => openModal(bookModal));
closeModalBtn.addEventListener("click", () => closeModal(bookModal));
closeUpdateModalBtn.addEventListener("click", () => closeModal(updateModal));

function openModal(modal) {
    modal.classList.remove("hidden");
}

function closeModal(modal) {
    modal.classList.add("hidden");
}

async function fetchBooks() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Kitapları getirirken bir hata oluştu.");
        const books = await response.json();
        renderBooks(books);
    } catch (error) {
        console.error("Kitapları çekerken hata:", error);
    }
}

function renderBooks(books) {
    bookList.innerHTML = ""; 
    books.forEach((book) => {
        const bookCard = document.createElement("div");
        bookCard.classList.add("book-card");
        bookCard.innerHTML = `
            <img src="${book.imageUrl}" alt="${book.title}">
            <h3>${book.title}</h3>
            <p>${book.author}</p>
            <p>${book.publisher}</p>
            <p>${book.year}</p>
            <button onclick="deleteBook(${book.id})">Sil</button>
            <button onclick="openUpdateModal(${book.id})">Güncelle</button>
        `;
        bookList.appendChild(bookCard);
    });
}

bookForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const newBook = {
        title: document.getElementById("title").value,
        author: document.getElementById("author").value,
        publisher: document.getElementById("publisher").value,
        year: document.getElementById("year").value,
        imageUrl: document.getElementById("imageUrl").value,
    };

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newBook),
        });
        if (!response.ok) throw new Error("Kitap eklenirken bir hata oluştu.");
        bookForm.reset();
        closeModal(bookModal);
        fetchBooks();
    } catch (error) {
        console.error("Kitap eklenirken hata:", error);
    }
});

async function deleteBook(id) {
    if (!confirm("Bu kitabı silmek istediğinize emin misiniz?")) return;

    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("Kitap silinirken bir hata oluştu.");
        fetchBooks();
    } catch (error) {
        console.error("Silme işlemi sırasında hata:", error);
    }
}

async function openUpdateModal(id) {
    try {
        const response = await fetch(`${apiUrl}/${id}`);
        if (!response.ok) throw new Error("Kitap bulunamadı.");
        const book = await response.json();

        document.getElementById("update-id").value = book.id;
        document.getElementById("update-title").value = book.title;
        document.getElementById("update-author").value = book.author;
        document.getElementById("update-publisher").value = book.publisher;
        document.getElementById("update-year").value = book.year;
        document.getElementById("update-imageUrl").value = book.imageUrl;

        openModal(updateModal);
    } catch (error) {
        console.error("Güncelleme modalı açılırken hata:", error);
    }
}

updateForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const id = document.getElementById("update-id").value;
    const updatedBook = {
        title: document.getElementById("update-title").value,
        author: document.getElementById("update-author").value,
        publisher: document.getElementById("update-publisher").value,
        year: document.getElementById("update-year").value,
        imageUrl: document.getElementById("update-imageUrl").value,
    };

    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedBook),
        });
        if (!response.ok) throw new Error("Güncelleme başarısız oldu.");

        closeModal(updateModal);
        fetchBooks();
    } catch (error) {
        console.error("Güncelleme sırasında hata:", error);
    }
});

document.addEventListener("DOMContentLoaded", fetchBooks);


