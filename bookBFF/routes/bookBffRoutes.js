const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');

const router = express.Router();
//const booksBaseUrl = 'http://172.18.0.2:3000/books';
const booksBaseUrl = 'http://book-svc:3000/books';




// Helper function to check if the client is a mobile device
function isMobileUserAgent(userAgent) {
    return userAgent.includes('Mobile');
}

function validateJwtToken(token, isTest = false) {
  return true;
  let decoded;

  if (isTest) {
      decoded = jwt.decode(token);
  } else {
      try {
          decoded = jwt.verify(token, secretKey);
      } catch (error) {
          console.error('Error verifying token:', error.message);
          return false;
      }
  }

  console.log('Decoded:', decoded);

  if (!decoded) return false;

  const payload = decoded;
  console.log('Payload:', payload);
  const validSubs = ['starlord', 'gamora', 'drax', 'rocket', 'groot'];
  const unix = payload.exp
  const exp = unix * 1000
  const now = Date.now()

  return (
      validSubs.includes(payload.sub) &&
      exp > now &&
      payload.iss === 'cmu.edu'
  );
}



// Helper function to modify the response for mobile clients
function modifyResponseForMobile(res) {
    if (res.genre === 'non-fiction') {
        res.genre = 3;
    }
    return res;
}

// Middleware function to validate JWT token and user-agent header
function validateJwtAndUserAgent(req, res, next) {
    const userAgent = req.headers['user-agent'];
    const authHeader = req.headers.authorization;

    if (!userAgent) {
        return res.status(400).send({ message: 'User-agent header is missing.' });
    }

    if (!authHeader) {
        return res.status(401).send({ message: 'Authorization header is missing.' });
    }

    const token = authHeader.split(' ')[1];
    if (!validateJwtToken(token, true)) {
        return res.status(401).send({ message: 'Invalid JWT token.' });
    }

    req.isMobile = isMobileUserAgent(userAgent);
    next();
}

router.use(validateJwtAndUserAgent);

// Add Book endpoint
router.post('/', async (req, res) => {
  try {
    const response = await axios.post(`${booksBaseUrl}`, req.body);

    res.status(response.status).send(response.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).send(error.response.data);
    } else {
      res.status(500).send({ message: 'Internal Server Error', error: error.message });
    }
  }
});

// Update Book endpoint
router.put('/:ISBN', async (req, res) => {
  try {
    const response = await axios.put(`${booksBaseUrl}/${req.params.ISBN}`, req.body);
    res.status(response.status).send(response.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).send(error.response.data);
    } else {
      res.status(500).send({ message: 'Internal Server Error', error: error.message });
    }
  }
});

// Retrieve book endpoint
router.get('/isbn/:ISBN', async (req, res) => {
  try {
    const response = await axios.get(`${booksBaseUrl}/isbn/${req.params.ISBN}`);
    let responseData = response.data;

    if (req.isMobile) {
      responseData = modifyResponseForMobile(responseData);
    }
    res.status(response.status).send(responseData);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).send(error.response.data);
    } else {
      res.status(500).send({ message: 'Internal Server Error', error: error.message });
    }
  }
});

// Retrieve book endpoint 2
router.get('/:isbn', async (req, res) => {
  try {
    const response = await axios.get(`${booksBaseUrl}/${req.params.isbn}`);
    let responseData = response.data;

    if (req.isMobile) {
      responseData = modifyResponseForMobile(responseData);
    }
    res.status(response.status).send(responseData);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).send(error.response.data);
    } else {
      res.status(500).send({ message: 'Internal Server Error', error: error.message });
    }
  }
});
// Retrieve related books endpoint
router.get('/:ISBN/related-books', async (req, res) => {
  try {
    const response = await axios.get(`${booksBaseUrl}/${req.params.ISBN}/related-books`);
    let responseData = response.data;

    if (req.isMobile) {
      responseData = responseData.map(book => modifyResponseForMobile(book));
    }
    res.status(response.status).send(responseData);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).send(error.response.data);
    } else {
      res.status(500).send({ message: 'Internal Server Error', error: error.message });
    }
  }
});


//test connection
router.get('/test', (req, res) => {
    res.status(200).send({ message: 'Test route is working' });
  });

module.exports = router;