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