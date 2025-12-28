
const UserModel = require('../models/user');
const CategoryModel = require("../models/category");
const ProductModel = require("../models/product");
const OrderModel = require("../models/order");
const generateMonths = require('../../libs/generateMonths');

exports.dashboard = async (req, res) => {
    try {
        const userCount = await UserModel.countDocuments();
        const categoryCount = await CategoryModel.countDocuments();
        const productCount = await ProductModel.countDocuments();
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const revenueThisMonth = await OrderModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: startOfMonth }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$totalPrice' }
                }
            }
        ]);

        const startOfYear = new Date();
        startOfYear.setMonth(0);
        startOfYear.setDate(1);
        startOfYear.setHours(0, 0, 0, 0);


        const revenueThisYear = await OrderModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: startOfYear }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$totalPrice' }
                }
            }
        ]);

        // Start from the first day of the month 11 months ago to include the last 12 months (including current)
        const fromDate = new Date();
        fromDate.setMonth(fromDate.getMonth() - 11);
        fromDate.setDate(1);
        fromDate.setHours(0, 0, 0, 0);

        const revenueByMonth = await OrderModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: fromDate }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    total: { $sum: '$totalPrice' }
                }
            },
            {
                $project: {
                    _id: 0,
                    month: {
                        $concat: [
                            { $toString: '$_id.year' },
                            '-',
                            {
                                $cond: [
                                    { $lt: ['$_id.month', 10] },
                                    { $concat: ['0', { $toString: '$_id.month' }] },
                                    { $toString: '$_id.month' }
                                ]
                            }
                        ]
                    },
                    total: 1
                }
            },
            { $sort: { month: 1 } }
        ]);

        console.log(revenueByMonth);
        console.log(revenueThisMonth);
        console.log(revenueThisYear);

        const months = generateMonths(fromDate);

        const revenueMap = revenueByMonth.reduce((acc, item) => {
            acc[item.month] = item.total;
            return acc;
        }, {});

        const result = months.map(month => ({
            month,
            total: revenueMap[month] || 0
        }));



        res.status(200).json({
            status: "success",
            data: {
                users: userCount,
                categories: categoryCount,
                products: productCount,
                revenue: {
                    thisMonth: revenueThisMonth[0]?.total || 0,
                    thisYear: revenueThisYear[0]?.total || 0,
                    byMonth: result
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
}