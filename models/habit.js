const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
    habit_name: {
        type: String,
        required: true
    },
    record: {
        type: Map
    }
}, {
    timestamps: true
});

const Habit = mongoose.model('Habit', habitSchema, 'Habit');

module.exports = Habit;