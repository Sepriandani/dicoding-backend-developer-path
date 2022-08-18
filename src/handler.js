/* eslint-disable eqeqeq */
const { nanoid } = require('nanoid');
const books = require('./books');

const addBooksHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const finished = pageCount === readPage;

  const newbook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  if (name === '' || name === null || name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  books.push(newbook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  if (books !== undefined) {
    const { reading } = request.query;
    const { finished } = request.query;
    const { name } = request.query;
    const getAllBooks = [];

    if (reading) {
      books.forEach((book) => {
        if (book.reading == reading) {
          const bookObject = {
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          };
          getAllBooks.push(bookObject);
        }
      });
      const response = h.response({
        status: 'success',
        data: {
          books: getAllBooks,
        },
      });
      response.code(200);
      return response;
    }
    if (finished) {
      books.forEach((book) => {
        if (book.finished == finished) {
          const bookObject = {
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          };
          getAllBooks.push(bookObject);
        }
      });
    } else if (name) {
      books.forEach((book) => {
        if (book.name.toUpperCase() == name.toUpperCase()) {
          const bookObject = {
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          };
          getAllBooks.push(bookObject);
        }
      });
      const response = h.response({
        status: 'success',
        data: {
          books: getAllBooks,
        },
      });
      response.code(200);
      return response;
    } else {
      books.forEach((book) => {
        const bookObject = {
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        };
        getAllBooks.push(bookObject);
      });
    }

    const response = h.response({
      status: 'success',
      data: {
        books: getAllBooks,
      },
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'success',
    data: [books],
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const book = books.filter((n) => n.id === id)[0];

  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const updatedBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();

  if (name == '' || name == null || name == undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBooksHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updatedBookByIdHandler,
  deleteBookByIdHandler,
};
