const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

// Function to check if a number is prime
const isPrime = (num) => {
    if (num < 2) return false;
    for (let i = 2; i * i <= num; i++) {
        if (num % i === 0) return false;
    }
    return true;
};

// Function to check if a number is a perfect number
const isPerfect = (num) => {
    let sum = 1;
    for (let i = 2; i * i <= num; i++) {
        if (num % i === 0) {
            sum += i;
            if (i !== num / i) sum += num / i;
        }
    }
    return sum === num && num !== 1;
};

// Function to check if a number is an Armstrong number
const isArmstrong = (num) => {
    const digits = num.toString().split("").map(Number);
    const sum = digits.reduce((acc, digit) => acc + Math.pow(digit, digits.length), 0);
    return sum === num;
};

// Function to fetch fun facts from Numbers API
const fetchFunFact = async (num) => {
    try {
        const response = await axios.get(`http://numbersapi.com/${num}/math`);
        return response.data;
    } catch (error) {
        return "Fun fact not available.";
    }
};

app.get("/api/classify-number", async (req, res) => {
    const { number } = req.query;

    // If the number parameter is missing, return a 400 error
    if (!number) {
        return res.status(400).json({
            "number": "alphabet",
            "error": true
        });
    }

    const num = parseInt(number, 10);

    // If the parameter is not a valid number, return an error
    if (isNaN(num)) {
        return res.status(400).json({
            "number": number,
            "error": true
        });
    }

    // Proceed with normal logic if the input is valid
    const properties = [];
    if (num % 2 !== 0) properties.push("odd");
    if (num % 2 === 0) properties.push("even");
    if (isPrime(num)) properties.push("prime");
    if (isPerfect(num)) properties.push("perfect");
    if (isArmstrong(num)) properties.push("armstrong");

    const digitSum = getDigitSum(num);
    const funFact = await fetchFunFact(num);

    res.json({
        number: num,
        is_prime: isPrime(num),
        is_perfect: isPerfect(num),
        properties,
        digit_sum: digitSum,
        fun_fact: funFact,
    });
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
