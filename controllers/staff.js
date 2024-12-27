const Staff = require('../Models/staff'); 
const Service = require('../Models/services');

const addStaff = async (req, res) => {
    const { name, email, phone, role, salary, serviceName, salonId } = req.body;
    console.log('Service name received:', serviceName);

    // Validate all required fields
    if (!name || !email || !phone || !role || !salary || !serviceName || !salonId) {
        return res.status(400).json({ message: 'All fields, including a valid salon ID, are required.' });
    }

    try {
        // Verify the service exists in the database
        const service = await Service.findOne({ where: { name: serviceName} });
        if (!service) {
            return res.status(404).json({ message: 'Selected service does not exist.' });
        }
        

        // Create staff with the provided details
        const newStaff = await Staff.create({
            name,
            email,
            phone,
            role,
            salary,
            services: service.name, // Use the name from the service found
            salonId,
        });

        // Respond with success
        res.status(201).json({ message: 'Staff added successfully!', staff: newStaff });
    } catch (error) {
        console.error('Error adding staff:', error);
        res.status(500).json({ message: 'Failed to add staff. Please try again later.' });
    }
};


module.exports = {
  
    addStaff,
  
};
