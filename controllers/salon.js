const Salon = require('../Models/salons'); // Adjust the path if needed


exports.postSalonDetails = async (req, res, next) => {
    const { name, location, contactNumber, ownerName, userId } = req.body; // Add userId

    try {
        // Create the new salon with userId
        const newSalon = await Salon.create({
            name,
            location,
            contactNumber,
            ownerName,
            userId, 
        });

        console.log('Salon created successfully:', newSalon);
        res.status(201).json({
            message: 'Salon created successfully',
            salon: newSalon,
        });
    } catch (error) {
        console.error('Error creating salon:', error);
        res.status(500).json({
            message: 'Failed to create salon',
            error: error.message,
        });
    }
};

exports.getSalonDetails = async (req, res, next) => {
    const { salonId } = req.params;

    try {
        // Fetch the salon details by ID
        const salon = await Salon.findByPk(salonId);

        if (!salon) {
            // If no salon found with the given ID
            return res.status(404).json({
                message: 'Salon not found',
            });
        }

        // If salon is found, return the details
        res.status(200).json(salon);
    } catch (error) {
        console.error('Error fetching salon details:', error);
        res.status(500).json({
            message: 'Failed to fetch salon details',
            error: error.message,
        });
    }
};



exports.getSalonsByUser = async (req, res) => {
    const userId = req.user.id; // Assuming `req.user.id` contains the authenticated user's ID

    try {
        // Fetch all salons where userId matches
        const salons = await Salon.findAll({ where: { userId } });

        // Return an empty array if no salons are found
        if (!salons || salons.length === 0) {
            return res.status(200).json([]); // Respond with an empty array
        }

        res.status(200).json(salons);
    } catch (error) {
        console.error('Error fetching salons by user:', error);
        res.status(500).json({
            message: 'Failed to fetch salons',
            error: error.message,
        });
    }
};

exports.getAllSalons = async (req, res, next) => {
    try {
        const salons = await Salon.findAll(); // Get all salons
        res.status(200).json(salons);
    } catch (error) {
        console.error('Error fetching salons:', error);
        res.status(500).json({
            message: 'Failed to fetch salons',
            error: error.message,
        });
    }
};
