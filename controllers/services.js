const Service = require('../Models/services');  // Import the Service model
 // For input validation (optional)

const getServices = async (req, res) => {
    const salonId = req.params.salonId; // Extract salonId from request params

    try {
        // Fetch services associated with the given salonId
        const services = await Service.findAll({
            where: { salonId },
        });

        // If no services are found, return an empty array
        if (!services.length) {
            return res.status(404).json({ message: 'No services found for this salon.' });
        }

        res.status(200).json(services);  // Return the services in JSON format
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ message: 'Failed to fetch services. Please try again later.' });
    }
};
const addService = async (req, res) => {
    let { name, price, duration, salonId, description, slots } = req.body;

    // Validate and parse `duration`
    duration = parseInt(duration.trim(), 10);
    console.log('Parsed duration:', duration);
    if (isNaN(duration)) {
        return res.status(400).json({ message: 'Invalid duration value. It should be an integer.' });
    }

    // Validate `slots` format (log received slots)
    console.log('Received slots:', slots);
    if (!Array.isArray(slots)) {
        return res.status(400).json({ message: 'Slots must be an array of time ranges.' });
    }
    
    const isValidSlots = slots.every(slot => typeof slot === 'string' && /^\d{1,2}(AM|PM)-\d{1,2}(AM|PM)$/.test(slot));
    console.log('Are the slots valid?', isValidSlots);
    
    if (!isValidSlots) {
        return res.status(400).json({ message: 'Invalid slot format. Each slot must be like "10 AM - 11 AM".' });
    }

    try {
        // Save the service
        const newService = await Service.create({
            name,
            price,
            duration,
            salonId,
            description,
            slots, // Save as JSON
        });

        res.status(201).json({ message: 'Service added successfully!', service: newService });
    } catch (error) {
        console.error('Error adding service:', error);
        res.status(500).json({ message: 'Failed to add service. Please try again later.' });
    }
};




const getAvailableSlots = async (req, res) => {
    const { serviceId } = req.params; // Extract the serviceId from request parameters
    const { date } = req.query; // Extract the date from query parameters (optional)

    try {
        // Fetch the service by ID
        const service = await Service.findByPk(serviceId);

        // If service is not found, return a 404 error
        if (!service) {
            return res.status(404).json({ message: 'Service not found.' });
        }

        // Get the slots from the service
        const slots = service.slots || [];

        // Filter available slots based on the date (if provided) and `isBooked` status
        const availableSlots = slots.filter(slot => {
            const isCorrectDate = date ? slot.date === date : true; // Match date if provided
            return isCorrectDate && !slot.isBooked;
        });

        // If no slots are available, return a 404 response
        if (!availableSlots.length) {
            return res.status(404).json({ message: 'No available slots for the specified criteria.' });
        }

        // Return the available slots
        res.status(200).json({ slots: availableSlots });

    } catch (error) {
        console.error('Error fetching available slots:', error);
        res.status(500).json({ message: 'Failed to fetch available slots. Please try again later.' });
    }
};




module.exports = {
    getServices,
    addService,
    getAvailableSlots
};
