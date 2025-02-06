"use strict";

var express = require("express");

var cors = require("cors");

var axios = require("axios");

var app = express();
app.use(cors());
var PORT = process.env.PORT || 3000; // Function to check if a number is prime

var isPrime = function isPrime(num) {
  if (num < 2) return false;

  for (var i = 2; i * i <= num; i++) {
    if (num % i === 0) return false;
  }

  return true;
}; // Function to check if a number is a perfect number


var isPerfect = function isPerfect(num) {
  var sum = 1;

  for (var i = 2; i * i <= num; i++) {
    if (num % i === 0) {
      sum += i;
      if (i !== num / i) sum += num / i;
    }
  }

  return sum === num && num !== 1;
}; // Function to check if a number is an Armstrong number


var isArmstrong = function isArmstrong(num) {
  var digits = num.toString().split("").map(Number);
  var sum = digits.reduce(function (acc, digit) {
    return acc + Math.pow(digit, digits.length);
  }, 0);
  return sum === num;
}; // Function to fetch fun facts from Numbers API


var fetchFunFact = function fetchFunFact(num) {
  var response;
  return regeneratorRuntime.async(function fetchFunFact$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(axios.get("http://numbersapi.com/".concat(num, "/math")));

        case 3:
          response = _context.sent;
          return _context.abrupt("return", response.data);

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", "Fun fact not available.");

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

app.get("/api/classify-number", function _callee(req, res) {
  var number, num, properties, digitSum, funFact;
  return regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          number = req.query.number; // If the number parameter is missing, return a 400 error

          if (number) {
            _context2.next = 3;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            "number": "alphabet",
            "error": true
          }));

        case 3:
          num = parseInt(number, 10); // If the parameter is not a valid number, return an error

          if (!isNaN(num)) {
            _context2.next = 6;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            "number": number,
            "error": true
          }));

        case 6:
          // Proceed with normal logic if the input is valid
          properties = [];
          if (num % 2 !== 0) properties.push("odd");
          if (num % 2 === 0) properties.push("even");
          if (isPrime(num)) properties.push("prime");
          if (isPerfect(num)) properties.push("perfect");
          if (isArmstrong(num)) properties.push("armstrong");
          digitSum = getDigitSum(num);
          _context2.next = 15;
          return regeneratorRuntime.awrap(fetchFunFact(num));

        case 15:
          funFact = _context2.sent;
          res.json({
            number: num,
            is_prime: isPrime(num),
            is_perfect: isPerfect(num),
            properties: properties,
            digit_sum: digitSum,
            fun_fact: funFact
          });

        case 17:
        case "end":
          return _context2.stop();
      }
    }
  });
});
app.listen(PORT, function () {
  return console.log("Server running on port ".concat(PORT));
});