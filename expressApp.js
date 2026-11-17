import express from 'express';

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Sample food records
let foods = [
    { id: 1, foodName: 'Pizza', category: 'Fast Food', price: 250, availability: true },
    { id: 2, foodName: 'Burger', category: 'Fast Food', price: 120, availability: true },
    { id: 3, foodName: 'Sandwich', category: 'Snacks', price: 100, availability: false }
];

// Validate food details
function validFood(food) {
    return food &&
        food.id !== undefined &&
        typeof food.foodName === 'string' && food.foodName.trim() !== '' &&
        typeof food.category === 'string' && food.category.trim() !== '' &&
        typeof food.price === 'number' && food.price > 0 &&
        typeof food.availability === 'boolean';
}

// GET /foods - retrieve all food items
app.get('/foods', (req, res) => {
    res.status(200).json(foods);
});

// GET /foods/:id - retrieve one food item
app.get('/foods/:id', (req, res) => {
    const id = Number(req.params.id);
    const food = foods.find(item => item.id === id);

    if (!food) {
        return res.status(404).json({ message: 'Food not found' });
    }

    res.status(200).json(food);
});

// POST /foods - add a new food item
app.post('/foods', (req, res) => {
    const newFood = req.body;

    if (!validFood(newFood)) {
        return res.status(400).json({ message: 'Invalid food details' });
    }

    if (foods.some(item => item.id === newFood.id)) {
        return res.status(400).json({ message: 'Food ID already exists' });
    }

    foods.push(newFood);
    res.status(201).json({
        message: 'Food item added successfully',
        food: newFood
    });
});

// PUT /foods/:id - update a food item
app.put('/foods/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = foods.findIndex(item => item.id === id);

    if (index === -1) {
        return res.status(404).json({ message: 'Food not found' });
    }

    const updatedFood = {
        ...foods[index],
        ...req.body,
        id: foods[index].id
    };

    // Validate all final fields after applying the update
    const valid =
        typeof updatedFood.foodName === 'string' && updatedFood.foodName.trim() !== '' &&
        typeof updatedFood.category === 'string' && updatedFood.category.trim() !== '' &&
        typeof updatedFood.price === 'number' && updatedFood.price > 0 &&
        typeof updatedFood.availability === 'boolean';

    if (!valid) {
        return res.status(400).json({ message: 'Invalid food details' });
    }

    foods[index] = updatedFood;
    res.status(200).json({
        message: 'Food updated successfully',
        food: updatedFood
    });
});

// DELETE /foods/:id - delete a food item
app.delete('/foods/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = foods.findIndex(item => item.id === id);

    if (index === -1) {
        return res.status(404).json({ message: 'Food not found' });
    }

    const deletedFood = foods.splice(index, 1)[0];
    res.status(200).json({
        message: 'Food deleted successfully',
        food: deletedFood
    });
});

// Handle invalid JSON bodies
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ message: 'Invalid JSON format' });
    }
    next(err);
});

// Handle invalid routes
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.listen(4000, () => {
    console.log('Express Server running at http://localhost:4000');
});
