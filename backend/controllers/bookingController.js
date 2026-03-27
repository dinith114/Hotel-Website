const Booking = require('../models/Booking');
const Room = require('../models/Room');
const { sendSuccess } = require('../utils/responseHandler');
const sendEmail = require('../utils/sendEmail');

// @desc    Check room availability for given dates
// @route   POST /api/v1/bookings/availability
// @access  Public
exports.checkAvailability = async (req, res, next) => {
    try {
        const { checkInDate, checkOutDate } = req.body;

        if (!checkInDate || !checkOutDate) {
            return res.status(400).json({ success: false, message: 'Please provide checkInDate and checkOutDate' });
        }

        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);

        if (checkIn >= checkOut) {
            return res.status(400).json({ success: false, message: 'Check-out date must be after check-in date' });
        }

        // 1. Find all bookings that overlap with the requested dates and are NOT cancelled
        const overlappingBookings = await Booking.find({
            status: { $ne: 'cancelled' },
            $or: [
                // New booking starts during an existing booking
                { checkInDate: { $lt: checkOut }, checkOutDate: { $gt: checkIn } }
            ]
        });

        // 2. Count how many rooms of each type are already booked in those overlapping bookings
        const bookedRoomCounts = {
            'Standard': 0,
            'Deluxe': 0,
            'Super Deluxe': 0
        };

        overlappingBookings.forEach(booking => {
            if (booking.rooms && booking.rooms.length > 0) {
                booking.rooms.forEach(room => {
                    if (bookedRoomCounts[room.roomType] !== undefined) {
                        bookedRoomCounts[room.roomType] += room.roomCount || 1;
                    }
                });
            }
        });

        // 3. Get total inventory of rooms from DB (or fallback to defaults if DB is empty)
        let rooms = await Room.find();
        
        // If DB is empty, mock default template data (10 of each)
        if (!rooms || rooms.length === 0) {
           rooms = [
               { roomType: 'Standard', totalInventory: 10 },
               { roomType: 'Deluxe', totalInventory: 10 },
               { roomType: 'Super Deluxe', totalInventory: 10 }
           ];
        }

        // 4. Calculate available rooms
        const availability = rooms.map(room => {
            const booked = bookedRoomCounts[room.roomType] || 0;
            const available = room.totalInventory - booked;
            
            return {
                roomType: room.roomType,
                totalInventory: room.totalInventory,
                currentlyBooked: booked,
                availableRooms: available > 0 ? available : 0,
                isAvailable: available > 0
            };
        });

        sendSuccess(res, availability, 'Availability checked successfully.');
    } catch (error) {
        next(error);
    }
};

// @desc    Submit a new booking request
// @route   POST /api/v1/bookings
// @access  Public
exports.createBooking = async (req, res, next) => {
    try {
        // Here we could add logic to ensure checkOutDate > checkInDate, 
        // to strictly validate inputs before saving to DB
        if (new Date(req.body.checkInDate) >= new Date(req.body.checkOutDate)) {
            return res.status(400).json({ success: false, message: 'Check-out date must be after check-in date' });
        }

        if (!req.body.rooms || req.body.rooms.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please select at least one room'
            });
        }

        const firstRoom = req.body.rooms[0];
        if (!firstRoom || firstRoom.adults < 1 || firstRoom.roomCount < 1 || firstRoom.children < 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide valid guest and room details'
            });
        }

            //the place where the frontend form data receives
        const booking = await Booking.create(req.body);

        // Send response first
        sendSuccess(
            res,
            booking,
            'Booking request submitted successfully. We will contact you soon!',
            201
        );

        // Then send emails in background
        setImmediate(async () => {
            try {
                const guestMessage = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                        <h2 style="color: #4CAF50; text-align: center;">Booking Request Received!</h2>
                        <p>Dear ${booking.firstName} ${booking.lastName},</p>
                        <p>We have successfully received your booking request for the dates <strong>${new Date(booking.checkInDate).toDateString()}</strong> to <strong>${new Date(booking.checkOutDate).toDateString()}</strong>.</p>
                        <p>Our reception team is currently reviewing availability and will contact you shortly to confirm your reservation and arrange payment.</p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                        <p style="font-size: 12px; color: #888; text-align: center;">Thank you for choosing our Hotel!</p>
                    </div>
                `;

                await sendEmail({
                    email: booking.email,
                    subject: 'Your Booking Request is Received - Hotel Team',
                    message: guestMessage
                });

                const adminMessage = `
                    <div style="font-family: Arial, sans-serif; border-left: 4px solid #ff9800; padding-left: 15px;">
                        <h2>🚨 New Booking Request Alert</h2>
                        <p><strong>Guest Name:</strong> ${booking.firstName} ${booking.lastName}</p>
                        <p><strong>Email:</strong> ${booking.email} | <strong>Phone:</strong> ${booking.phone}</p>
                        <p><strong>Check-In:</strong> ${new Date(booking.checkInDate).toDateString()}</p>
                        <p><strong>Check-Out:</strong> ${new Date(booking.checkOutDate).toDateString()}</p>
                        <p><strong>Special Remarks:</strong> ${booking.specialRemarks || 'None'}</p>
                        <p>Please log into the Admin Dashboard to Review and Confirm this booking.</p>
                    </div>
                `;

                await sendEmail({
                    email: process.env.SMTP_EMAIL,
                    subject: `NEW BOOKING ALERT: ${booking.firstName} ${booking.lastName}`,
                    message: adminMessage
                });
            } catch (err) {
                console.error('Background email sending failed:', err);
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get all bookings (For Admin, Optional for now)
// @route   GET /api/v1/bookings
// @access  Private (Needs auth later)
exports.getBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find().sort('-createdAt');
        sendSuccess(res, bookings, 'Bookings fetched successfully.');
    } catch (error) {
        next(error);
    }
};

// @desc    Get single booking by ID
// @route   GET /api/v1/bookings/:id
// @access  Private
exports.getBookingById = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        
        sendSuccess(res, booking, 'Booking fetched successfully.');
    } catch (error) {
        next(error);
    }
};

// @desc    Update a booking (e.g., change status to confirmed or canceled)
// @route   PUT /api/v1/bookings/:id
// @access  Private
exports.updateBooking = async (req, res, next) => {
    try {
        let booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        sendSuccess(res, booking, 'Booking updated successfully.');
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a booking
// @route   DELETE /api/v1/bookings/:id
// @access  Private
exports.deleteBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        await booking.deleteOne();

        sendSuccess(res, null, 'Booking deleted successfully.');
    } catch (error) {
        next(error);
    }
};
