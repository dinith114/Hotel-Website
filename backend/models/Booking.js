const mongoose = require('mongoose');

// Because the UI has a "+ Add Row" button for Rooms and Meal Plans, 
// a single booking might contain multiple rooms.
const roomSelectionSchema = new mongoose.Schema({
    roomType: {
        type: String,
        required: [true, 'Please specify the room type']
        // Removed enum so it accepts any dynamically created room type from the database
    },
    mealPlan: {
        type: String,
        required: [true, 'Please specify a meal plan'],
        enum: ['Bed and Breakfast', 'Room Only', 'Half Board', 'Full Board']
    },
    adults: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },
    children: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    roomCount: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    }
});

const bookingSchema = new mongoose.Schema(
    {
        // --- 1. Contact Details ---
        firstName: {
            type: String,
            required: [true, 'Please provide first name'],
            trim: true,
        },
        lastName: {
            type: String,
            required: [true, 'Please provide last name'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Please provide an email address'],
        },
        phone: {
            type: String,
            required: [true, 'Please provide a phone number'],
            trim: true,
        },
        country: {
            type: String,
            required: [true, 'Please select your country'],
        },

        // --- 2. Dates (Passed automatically from the earlier step) ---
        checkInDate: {
            type: Date,
            required: [true, 'Please provide check-in date'],
        },
        checkOutDate: {
            type: Date,
            required: [true, 'Please provide check-out date'],
        },

        // --- 3. Room & Meal Plan Selection ---
        rooms: [roomSelectionSchema],

        // --- 4. Extra Services & Remarks ---
        arrivalTime: {
            type: String, // e.g., "02:30 PM"
            trim: true
        },
        specialRemarks: {
            type: String,
            trim: true,
        },
        airportPickup: {
            type: String,
            trim: true,
        },
        airportDrop: {
            type: String,
            trim: true,
        },

        // Internal Status
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled'],
            default: 'pending',
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Booking', bookingSchema);
