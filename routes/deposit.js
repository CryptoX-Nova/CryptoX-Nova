const express = require("express");

const router = express.Router();

const db = require("../database/database");

const admin = require("../middleware/admin");

// =====================================
// SUBMIT DEPOSIT
// =====================================

router.post("/", (req, res) => {

    // Check login
    if (!req.session.user) {

        return res.status(401).json({
            success: false,
            message: "Please login first."
        });

    }

    const userId = req.session.user.id;

    const { coin, amount } = req.body;

    // Validation
    if (!coin || !amount) {

        return res.json({
            success: false,
            message: "All fields are required."
        });

    }

    const depositAmount = Number(amount);

    if (isNaN(depositAmount) || depositAmount <= 0) {

        return res.json({
            success: false,
            message: "Invalid amount."
        });

    }

    const allowedCoins = ["USDT", "BTC", "ETH", "SOL"];

    if (!allowedCoins.includes(coin.toUpperCase())) {

        return res.json({
            success: false,
            message: "Invalid coin."
        });

    }

    db.run(

        `
        INSERT INTO deposits
        (
            user_id,
            coin,
            amount,
            status
        )
        VALUES
        (
            ?, ?, ?, ?
        )
        `,

        [
            userId,
            coin.toUpperCase(),
            depositAmount,
            "pending"
        ],

        function (err) {

            if (err) {

                console.log(err);

                return res.json({

                    success: false,
                    message: "Failed to submit deposit."

                });

            }

            res.json({

                success: true,
                message: "Deposit request submitted successfully.",
                depositId: this.lastID

            });

        }

    );

});


// =====================================
// USER DEPOSIT HISTORY
// =====================================

router.get("/history", (req, res) => {

    if (!req.session.user) {

        return res.status(401).json({

            success: false,
            message: "Please login first."

        });

    }

    db.all(

        `
        SELECT
            id,
            coin,
            amount,
            status,
            created_at,
            approved_at
        FROM deposits
        WHERE user_id = ?
        ORDER BY id DESC
        `,

        [
            req.session.user.id
        ],

        (err, rows) => {

            if (err) {

                return res.json({

                    success: false,
                    message: "Database error."

                });

            }

            res.json({

                success: true,
                deposits: rows

            });

        }

    );

});

// =====================================
// GET PENDING DEPOSITS
// =====================================

router.get("/pending-deposits", admin, (req, res) => {

    db.all(

        `
        SELECT
            deposits.id,
            users.username,
            deposits.user_id,
            deposits.coin,
            deposits.amount,
            deposits.status,
            deposits.created_at

        FROM deposits

        INNER JOIN users
        ON users.id = deposits.user_id

        WHERE deposits.status = 'pending'

        ORDER BY deposits.created_at DESC
        `,

        [],

        (err, rows) => {

            if (err) {

                console.log(err);

                return res.json({
                    success: false,
                    message: "Database error."
                });

            }

            res.json({
                success: true,
                deposits: rows
            });

        }

    );

});


// =====================================
// APPROVE DEPOSIT
// =====================================

router.post("/deposit/approve/:id", admin, (req, res) => {

    const depositId = req.params.id;

    db.get(

        `SELECT * FROM deposits WHERE id = ?`,

        [depositId],

        (err, deposit) => {

            if (err || !deposit) {

                return res.json({
                    success: false,
                    message: "Deposit not found."
                });

            }

            if (deposit.status !== "pending") {

                return res.json({
                    success: false,
                    message: "Deposit already processed."
                });

            }

            db.run(

                `
                UPDATE wallets

                SET balance = balance + ?

                WHERE user_id = ?

                AND coin = ?
                `,

                [
                    deposit.amount,
                    deposit.user_id,
                    deposit.coin
                ],

                function (err) {

                    if (err) {

                        console.log(err);

                        return res.json({
                            success: false,
                            message: "Wallet update failed."
                        });

                    }

                    db.run(

                        `
                        UPDATE deposits

                        SET
                            status = 'approved',
                            approved_at = CURRENT_TIMESTAMP

                        WHERE id = ?
                        `,

                        [depositId],

                        (err) => {

                            if (err) {

                                return res.json({
                                    success: false,
                                    message: "Failed to approve deposit."
                                });

                            }

                            res.json({
                                success: true,
                                message: "Deposit approved successfully."
                            });

                        }

                    );

                }

            );

        }

    );

});


// =====================================
// REJECT DEPOSIT
// =====================================

router.post("/deposit/reject/:id", admin, (req, res) => {

    const depositId = req.params.id;

    db.run(

        `
        UPDATE deposits

        SET status = 'rejected'

        WHERE id = ?

        AND status = 'pending'
        `,

        [depositId],

        function (err) {

            if (err) {

                return res.json({
                    success: false,
                    message: "Database error."
                });

            }

            if (this.changes === 0) {

                return res.json({
                    success: false,
                    message: "Deposit not found or already processed."
                });

            }

            res.json({
                success: true,
                message: "Deposit rejected successfully."
            });

        }

    );

});

module.exports = router;