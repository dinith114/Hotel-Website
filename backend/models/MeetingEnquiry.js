const mongoose = require('mongoose');

const meetingEnquirySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a name'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Please provide an email address'],
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                'Please add a valid email',
            ],
        },
        mobilePhone: {
            type: String,
            required: [true, 'Please provide a mobile phone number'],
        },
        companyName: {
            type: String,
            trim: true,
        },
        landPhone: {
            type: String,
            trim: true,
        },
        companyAddress: {
            type: String,
            trim: true,
        },
        date: {
            type: Date,
            required: [true, 'Please provide a date for the meeting'],
        },
        seating: {
            type: String,
        },
        menuType: {
            type: String,
        },
        guests: {
            type: Number,
            min: [1, 'Number of guests must be at least 1'],
        },
        equipment: {
            type: [String],
            default: [],
        },
        specialRequirement: {
            type: String,
        },
        status: {
            type: String,
            enum: ['pending', 'reviewed', 'resolved'],
            default: 'pending',
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('MeetingEnquiry', meetingEnquirySchema);