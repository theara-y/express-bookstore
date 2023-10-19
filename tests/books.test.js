const app = require('../app');
const client = require('supertest')(app)
const db = require('../db');
const Book = require('../models/book');

let book;

beforeEach(async () => {
    book = await Book.create({
        isbn: 'isbn',
        amazon_url: 'url',
        author: 'author',
        language: 'lang',
        pages: 100,
        publisher: 'publisher',
        title: 'title',
        year: 2023
    });
});

afterEach(async () => {
    await db.query('DELETE FROM books');
});

describe('Get all books route', () => {
    test('Get all books', async () => {
        const res = await client.get('/books')

        expect(res.status).toBe(200);
        expect(res.body).toEqual(
            expect.objectContaining({
                books: expect.objectContaining([
                    expect.objectContaining({
                        isbn: 'isbn'
                    })
                ])
            })
        )
    });
});

describe('Get book by isbn route', () => {
    test('Get book by isbn', async () => {
        const res = await client.get('/books/isbn')

        expect(res.status).toBe(200);
        expect(res.body).toEqual(
            expect.objectContaining({
                book: expect.objectContaining({
                    isbn: 'isbn'
                })
            })
        )
    });
});

describe('Add new book route', () => {
    test('Add new book', async () => {
        const res = await client.post('/books')
            .send({
                isbn: 'isbn2',
                amazon_url: 'url',
                author: 'author',
                language: 'lang',
                pages: 100,
                publisher: 'publisher',
                title: 'title',
                year: 2023
            })

        expect(res.status).toBe(201);
        expect(res.body).toEqual(
            expect.objectContaining({
                book: expect.objectContaining({
                    isbn: 'isbn2'
                })
            })
        )
    });

    test('Missing request fields when adding new book', async () => {
        const res = await client.post('/books')

        expect(res.status).toBe(400);
        expect(res.body).toEqual(
            expect.objectContaining({
                error: expect.objectContaining({
                    message: expect.any(String)
                })
            })
        )
    });

    test('Type error in request fields when adding new book', async () => {
        const res = await client.post('/books')
            .send({
                isbn: 100,
                amazon_url: 100,
                author: 100,
                language: 100,
                pages: '100',
                publisher: 100,
                title: 100,
                year: '2023'
            })

        expect(res.status).toBe(400);
        expect(res.body).toEqual(
            expect.objectContaining({
                error: expect.objectContaining({
                    message: expect.any(String)
                })
            })
        )
    });
});

describe('Update book by isbn route', () => {
    test('Update book by isbn', async () => {
        const res = await client.put('/books/isbn')
            .send({
                isbn: 'isbn',
                amazon_url: 'url2',
                author: 'author',
                language: 'lang',
                pages: 100,
                publisher: 'publisher',
                title: 'title',
                year: 2023
            })

        expect(res.status).toBe(200);
        expect(res.body).toEqual(
            expect.objectContaining({
                book: expect.objectContaining({
                    isbn: 'isbn',
                    amazon_url: 'url2'
                })
            })
        )
    });

    test('Missing request fields when updating book', async () => {
        const res = await client.put('/books/isbn')

        expect(res.status).toBe(400);
        expect(res.body).toEqual(
            expect.objectContaining({
                error: expect.objectContaining({
                    message: expect.any(String)
                })
            })
        )
    });

    test('Type error in request fields when updating book', async () => {
        const res = await client.put('/books/isbn')
            .send({
                amazon_url: 100,
                author: 100,
                language: 100,
                pages: '100',
                publisher: 100,
                title: 100,
                year: '2023'
            })

        expect(res.status).toBe(400);
        expect(res.body).toEqual(
            expect.objectContaining({
                error: expect.objectContaining({
                    message: expect.any(String)
                })
            })
        )
    });
});

describe('Delete book by isbn route', () => {
    test('Delete book by isbn', async () => {
        const res = await client.delete('/books/isbn')

        expect(res.status).toBe(200);
        expect(res.body).toEqual(
            expect.objectContaining({
                message: "Book deleted"
            })
        )
    });
});

afterAll(async () => {
    await db.end();
})