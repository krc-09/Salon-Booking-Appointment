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
    let { name, price, duration, salonId, description } = req.body;  // Get description from request body

    // Remove any extra spaces and ensure duration is an integer
    duration = parseInt(duration.trim(), 10);

    if (isNaN(duration)) {
        return res.status(400).json({ message: 'Invalid duration value. It should be an integer.' });
    }

    try {
        // Create a new service record in the database, including description
        const newService = await Service.create({
            name,
            price,
            duration,
            salonId,
            description  // Include description in the database entry
        });

        res.status(201).json({ message: 'Service added successfully!', service: newService });
    } catch (error) {
        console.error('Error adding service:', error);
        res.status(500).json({ message: 'Failed to add service. Please try again later.' });
    }
};




module.exports = {
    getServices,
    addService,
};
