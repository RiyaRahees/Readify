const Address = require("../model/Address");

exports.addAddress = async (req, res) => {

    try {

        const address = await Address.create(req.body);

        res.status(201).json(address);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

exports.getAddresses = async (req, res) => {

    try {

        const addresses = await Address.find({
            user: req.params.userId
        });

        res.json(addresses);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

exports.deleteAddress = async (req, res) => {

    try {

        await Address.findByIdAndDelete(
            req.params.id
        );

        res.json({
            message: "Address Deleted"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

exports.setDefaultAddress = async (req, res) => {
    try {
        const address = await Address.findById(req.params.id);
        if (!address) {
            return res.status(404).json({ message: "Address not found" });
        }

        // Set all other addresses for this user to isDefault: false
        await Address.updateMany(
            { user: address.user },
            { isDefault: false }
        );

        address.isDefault = true;
        await address.save();

        res.json({
            success: true,
            message: "Default address set successfully",
            address
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};