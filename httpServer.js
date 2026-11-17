import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let foods = [
    { id: 1, foodName: 'Pizza', category: 'Fast Food', price: 250, availability: true },
    { id: 2, foodName: 'Burger', category: 'Fast Food', price: 120, availability: true },
    { id: 3, foodName: 'Sandwich', category: 'Snacks', price: 100, availability: false }
];

const server = http.createServer((req, res) => {
    // GET /
    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end('<h1>Welcome to Online Food Ordering</h1><p>Order your favourite food!</p>');
    }

    // GET /foods
    if (req.method === 'GET' && req.url === '/foods') {
        const availableFoods = foods.filter(food => food.availability === true);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify(availableFoods, null, 2));
    }

    // GET /about
    if (req.method === 'GET' && req.url === '/about') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end('<h2>About Us</h2><p>We provide online food ordering services.</p>');
    }

    // GET /menu
    if (req.method === 'GET' && req.url === '/menu') {
        const menuPath = path.join(__dirname, 'public', 'menu.html');
        return fs.readFile(menuPath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                return res.end('Error reading menu file');
            }
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            return res.end(data);
        });
    }

    // POST /add-food
    if (req.method === 'POST' && req.url === '/add-food') {
        let body = '';

        req.on('data', chunk => {
            body += chunk;
            if (body.length > 1e6) {
                res.writeHead(413, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Request body too large' }));
                req.destroy();
            }
        });

        req.on('end', () => {
            if (res.writableEnded) return;

            try {
                const newFood = JSON.parse(body);

                const valid =
                    newFood &&
                    newFood.id !== undefined &&
                    typeof newFood.foodName === 'string' && newFood.foodName.trim() !== '' &&
                    typeof newFood.category === 'string' && newFood.category.trim() !== '' &&
                    typeof newFood.price === 'number' && newFood.price > 0 &&
                    typeof newFood.availability === 'boolean';

                if (!valid) {
                    res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                    return res.end(JSON.stringify({ message: 'Missing or invalid required fields' }));
                }

                if (foods.some(food => food.id === newFood.id)) {
                    res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                    return res.end(JSON.stringify({ message: 'Food ID already exists' }));
                }

                foods.push(newFood);
                res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' });
                return res.end(JSON.stringify({
                    message: 'Food added successfully',
                    food: newFood
                }));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                return res.end(JSON.stringify({ message: 'Invalid JSON format' }));
            }
        });
        return;
    }

    // Invalid route
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Page Not Found');
});

server.listen(3000, () => {
    console.log('HTTP Server running at http://localhost:3000');
});
