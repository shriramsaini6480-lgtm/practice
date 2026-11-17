# MT1 Lab Exam - Online Food Ordering Web Application

## Project structure

```text
FoodOrdering/
├── package.json
├── httpServer.js
├── expressApp.js
├── public/
│   └── menu.html
└── screenshots/
```

## Setup

Open a terminal in this folder and run:

```bash
npm install
```

## Run Part A: HTTP + FS server

```bash
node httpServer.js
```

Open:
- http://localhost:3000/
- http://localhost:3000/foods
- http://localhost:3000/about
- http://localhost:3000/menu

## Run Part B: Express REST API

Open a second terminal and run:

```bash
node expressApp.js
```

The API runs at http://localhost:4000.

## Postman endpoints

| Method | URL | Purpose |
|---|---|---|
| GET | http://localhost:4000/foods | Get all foods |
| GET | http://localhost:4000/foods/1 | Get food with ID 1 |
| POST | http://localhost:4000/foods | Add a food |
| PUT | http://localhost:4000/foods/1 | Update food with ID 1 |
| DELETE | http://localhost:4000/foods/1 | Delete food with ID 1 |

For POST, choose Body -> raw -> JSON and use:

```json
{
  "id": 4,
  "foodName": "Cold Coffee",
  "category": "Beverage",
  "price": 120,
  "availability": true
}
```

For PUT, use:

```json
{
  "foodName": "Cheese Pizza",
  "category": "Fast Food",
  "price": 300,
  "availability": true
}
```

Food records are stored in JavaScript arrays; no database is used.
The `screenshots` folder is provided for your practical screenshots.
