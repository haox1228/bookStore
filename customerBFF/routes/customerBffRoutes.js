const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const router = express.Router();
//to be changed
//const customerBaseUrl = 'http://172.18.0.2:3000/customers';

const customerBaseUrl = 'http://customer-svc:3000/customers';


// Helper function to check if the client is a mobile device
function isMobileUserAgent(userAgent) {
    return userAgent.includes('Mobile');
}

// Helper function to validate the JWT token
function validateJwtToken(token, isTest = false) {
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
    delete res.address;
    delete res.address2;
    delete res.city;
    delete res.state;
    delete res.zipcode;
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

// Retrieve customer by ID endpoint
router.get('/:id', async (req, res) => {
    try {
      const response = await axios.get(`${customerBaseUrl}/${req.params.id}`);
      let responseData = response.data;
  
      if (req.isMobile) {
        responseData = modifyResponseForMobile(responseData);
      }
  
      res.status(response.status).json(responseData);
    } catch (error) {
      res.status(error.response.status).json({ message: error.response.data });
    }
  });
  
  // Retrieve customer by user ID endpoint
  router.get('/', async (req, res) => {
    try {
      const response = await axios.get(`${customerBaseUrl}?userId=${req.query.userId}`);
      let responseData = response.data;
  
      if (req.isMobile) {
        responseData = modifyResponseForMobile(responseData);
      }
  
      res.status(response.status).json(responseData);
    } catch (error) {
      console.error('Error:', error);
      if (error.response) {
        console.log('Error response:', error.response);
        res.status(error.response.status).json({ message: error.response.data });
      } else {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
      }
    }
  });
  
  router.post('/', async (req, res) => {
    try {
      const response = await axios.post(`${customerBaseUrl}`, req.body);
  
      console.log(response);
  
      if (!response) {
        throw new Error('No response from the Customer Service');
      }
  
      res.status(response.status).json(response.data);
    } catch (error) {
      console.error('Error:', error);
      if (error.response) {
        console.log('Error response:', error.response);
        res.status(error.response.status).json({ message: error.response.data });
      } else {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
      }
    }
  });
  
  module.exports = router;
  