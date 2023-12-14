import React from "react";
import { Container, Card, Button, Row, Col, Alert } from "react-bootstrap";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ME } from "../queries";
import { REMOVE_BOOK } from "../mutations";
import { removeBookId } from "../utils/localStorage";

const SavedBooks = () => {
  const { loading, data, error: queryError } = useQuery(GET_ME);
  const [removeBook, { error: mutationError }] = useMutation(REMOVE_BOOK);
  const userData = data?.me || {};

  const bookCount = userData.savedBooks ? userData.savedBooks.length : 0;

  const handleDeleteBook = async (bookId) => {
    try {
      await removeBook({
        variables: { bookId },
        update: (cache) => {
          const cacheData = cache.readQuery({ query: GET_ME });
          if (cacheData) {
            const { me } = cacheData;
            cache.writeQuery({
              query: GET_ME,
              data: {
                me: {
                  ...me,
                  savedBooks: me.savedBooks.filter(
                    (book) => book.bookId !== bookId
                  ),
                },
              },
            });
          }
        },
      });
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  if (queryError || mutationError) {
    return (
      <Alert variant="danger">
        An error occurred: {queryError?.message || mutationError?.message}
      </Alert>
    );
  }

  return (
    <>
      <Container  fluid className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Container>
      <Container>
        <h2 className="pt-5">
          {bookCount
            ? `Viewing ${bookCount} saved ${
                bookCount === 1 ? "book" : "books"
              }:`
            : "You have no saved books!"}
        </h2>
        <Row>
          {userData.savedBooks &&
            userData.savedBooks.map((book) => (
              <Col md="4" key={book.bookId}>
                <Card border="dark">
                  {book.image && (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant="top"
                    />
                  )}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className="small">Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className="btn-block btn-danger"
                      onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
