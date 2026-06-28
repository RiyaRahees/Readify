const Wallet = require("../model/Wallet");

exports.getWallet = async (req, res) => {

    try {

        const wallet = await Wallet.findOne({
            userId: req.params.userId
        });

        res.json(wallet);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

exports.addMoneyToWallet = async (req, res) => {

    try {

        const {
            userId,
            amount,
            paymentId
        } = req.body;

        let wallet = await Wallet.findOne({
            userId
        });

        if (!wallet) {

            wallet = await Wallet.create({
                userId,
                balance: 0,
                transactions: []
            });

        }

        wallet.balance += Number(amount);

        wallet.transactions.push({

            type: "credit",

            amount,

            paymentId,

            description:
                "Wallet Recharge"

        });

        await wallet.save();

        res.json({
            success: true
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

exports.payWithWallet =
async (req, res) => {

    const {
        userId,
        amount
    } = req.body;

    const wallet =
        await Wallet.findOne({
            userId
        });

    if (!wallet) {

        return res.status(404).json({
            message:
            "Wallet not found"
        });

    }

    if (
        wallet.balance < amount
    ) {

        return res.status(400).json({
            message:
            "Insufficient balance"
        });

    }

    wallet.balance -= amount;

    wallet.transactions.push({

        type: "debit",

        amount,

        description:
        "Order Payment"

    });

    await wallet.save();

    res.json({
        success: true
    });
};