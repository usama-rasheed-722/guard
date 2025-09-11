const { Wallet, Transaction, User } = require('../models');
const { successResponse, errorResponse, serverErrorResponse, notFoundResponse, paginatedResponse } = require('../helpers/response');
const { getPaginationParams, getPaginationMeta, buildSortOptions } = require('../helpers/pagination');
const { Op } = require('sequelize');
const moment = require('moment');

// Get wallet balance
const getWallet = async (req, res) => {
  try {
    const userId = req.user.id;

    let wallet = await Wallet.findOne({
      where: { user_id: userId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!wallet) {
      // Create wallet if it doesn't exist
      wallet = await Wallet.create({
        user_id: userId,
        balance: 0.00,
        currency: 'USD'
      });
    }

    return successResponse(res, 'Wallet retrieved successfully', { wallet });

  } catch (error) {
    console.error('Get wallet error:', error);
    return serverErrorResponse(res, 'Failed to retrieve wallet', error);
  }
};

// Get wallet transactions
const getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      page = 1,
      limit = 10,
      type,
      status,
      date_from,
      date_to,
      sort_by = 'created_at',
      sort_order = 'DESC'
    } = req.query;

    const { page: finalPage, limit: finalLimit, offset } = getPaginationParams(page, limit);

    // Build where clause
    const whereClause = {
      [Op.or]: [
        { from_user_id: userId },
        { to_user_id: userId }
      ]
    };

    // Type filter
    if (type) {
      whereClause.type = type;
    }

    // Status filter
    if (status) {
      whereClause.status = status;
    }

    // Date range filter
    if (date_from || date_to) {
      whereClause.created_at = {};
      if (date_from) whereClause.created_at[Op.gte] = date_from;
      if (date_to) whereClause.created_at[Op.lte] = date_to;
    }

    const totalItems = await Transaction.count({ where: whereClause });

    const transactions = await Transaction.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'fromUser',
          attributes: ['id', 'name', 'email'],
          required: false
        },
        {
          model: User,
          as: 'toUser',
          attributes: ['id', 'name', 'email'],
          required: false
        }
      ],
      order: buildSortOptions(sort_by, sort_order),
      limit: finalLimit,
      offset
    });

    const pagination = getPaginationMeta(totalItems, finalPage, finalLimit);

    return paginatedResponse(res, 'Transactions retrieved successfully', transactions.rows, pagination);

  } catch (error) {
    console.error('Get transactions error:', error);
    return serverErrorResponse(res, 'Failed to retrieve transactions', error);
  }
};

// Add funds to wallet (deposit)
const addFunds = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, description = 'Wallet deposit' } = req.body;

    if (amount <= 0) {
      return errorResponse(res, 'Amount must be greater than 0', 400);
    }

    // Get or create wallet
    let wallet = await Wallet.findOne({ where: { user_id: userId } });
    if (!wallet) {
      wallet = await Wallet.create({
        user_id: userId,
        balance: 0.00,
        currency: 'USD'
      });
    }

    // Create transaction record
    const transaction = await Transaction.create({
      from_user_id: null, // System deposit
      to_user_id: userId,
      amount: amount,
      type: 'deposit',
      status: 'success',
      description,
      processed_at: new Date()
    });

    // Update wallet balance
    const newBalance = parseFloat(wallet.balance) + parseFloat(amount);
    await wallet.update({
      balance: newBalance,
      last_updated: new Date()
    });

    // Fetch updated wallet
    const updatedWallet = await Wallet.findByPk(wallet.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    return successResponse(res, 'Funds added successfully', {
      wallet: updatedWallet,
      transaction
    });

  } catch (error) {
    console.error('Add funds error:', error);
    return serverErrorResponse(res, 'Failed to add funds', error);
  }
};

// Withdraw funds from wallet
const withdrawFunds = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, description = 'Wallet withdrawal' } = req.body;

    if (amount <= 0) {
      return errorResponse(res, 'Amount must be greater than 0', 400);
    }

    // Get wallet
    const wallet = await Wallet.findOne({ where: { user_id: userId } });
    if (!wallet) {
      return notFoundResponse(res, 'Wallet not found');
    }

    // Check if sufficient balance
    if (parseFloat(wallet.balance) < parseFloat(amount)) {
      return errorResponse(res, 'Insufficient balance', 400);
    }

    // Create transaction record
    const transaction = await Transaction.create({
      from_user_id: userId,
      to_user_id: null, // System withdrawal
      amount: amount,
      type: 'withdrawal',
      status: 'pending', // This would typically be processed by a payment gateway
      description
    });

    // Update wallet balance
    const newBalance = parseFloat(wallet.balance) - parseFloat(amount);
    await wallet.update({
      balance: newBalance,
      last_updated: new Date()
    });

    // Fetch updated wallet
    const updatedWallet = await Wallet.findByPk(wallet.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    return successResponse(res, 'Withdrawal request submitted successfully', {
      wallet: updatedWallet,
      transaction
    });

  } catch (error) {
    console.error('Withdraw funds error:', error);
    return serverErrorResponse(res, 'Failed to withdraw funds', error);
  }
};

// Create escrow transaction (for job/shift payments)
const createEscrowTransaction = async (req, res) => {
  try {
    const fromUserId = req.user.id;
    const { to_user_id, amount, job_id, shift_id, description } = req.body;

    if (amount <= 0) {
      return errorResponse(res, 'Amount must be greater than 0', 400);
    }

    // Get from user's wallet
    const fromWallet = await Wallet.findOne({ where: { user_id: fromUserId } });
    if (!fromWallet) {
      return notFoundResponse(res, 'Wallet not found');
    }

    // Check if sufficient balance
    if (parseFloat(fromWallet.balance) < parseFloat(amount)) {
      return errorResponse(res, 'Insufficient balance', 400);
    }

    // Get to user's wallet (create if doesn't exist)
    let toWallet = await Wallet.findOne({ where: { user_id: to_user_id } });
    if (!toWallet) {
      toWallet = await Wallet.create({
        user_id: to_user_id,
        balance: 0.00,
        currency: 'USD'
      });
    }

    // Calculate escrow release date (5 days from now)
    const escrowReleaseDate = moment().add(5, 'days').toDate();

    // Create escrow transaction
    const transaction = await Transaction.create({
      from_user_id: fromUserId,
      to_user_id: to_user_id,
      amount: amount,
      type: 'escrow',
      status: 'success',
      description: description || 'Escrow payment',
      job_id: job_id || null,
      shift_id: shift_id || null,
      escrow_release_date: escrowReleaseDate,
      processed_at: new Date()
    });

    // Update wallet balances
    const newFromBalance = parseFloat(fromWallet.balance) - parseFloat(amount);
    await fromWallet.update({
      balance: newFromBalance,
      last_updated: new Date()
    });

    return successResponse(res, 'Escrow transaction created successfully', {
      transaction,
      escrow_release_date: escrowReleaseDate
    });

  } catch (error) {
    console.error('Create escrow transaction error:', error);
    return serverErrorResponse(res, 'Failed to create escrow transaction', error);
  }
};

// Release escrow funds (automatic after 5 days or manual)
const releaseEscrowFunds = async (req, res) => {
  try {
    const { transaction_id } = req.params;

    const transaction = await Transaction.findByPk(transaction_id);
    if (!transaction) {
      return notFoundResponse(res, 'Transaction not found');
    }

    if (transaction.type !== 'escrow') {
      return errorResponse(res, 'Transaction is not an escrow transaction', 400);
    }

    if (transaction.status !== 'success') {
      return errorResponse(res, 'Escrow transaction is not in success status', 400);
    }

    // Check if escrow period has passed
    const now = new Date();
    if (transaction.escrow_release_date > now) {
      return errorResponse(res, 'Escrow period has not yet passed', 400);
    }

    // Get to user's wallet
    let toWallet = await Wallet.findOne({ where: { user_id: transaction.to_user_id } });
    if (!toWallet) {
      toWallet = await Wallet.create({
        user_id: transaction.to_user_id,
        balance: 0.00,
        currency: 'USD'
      });
    }

    // Create release transaction
    const releaseTransaction = await Transaction.create({
      from_user_id: null, // System release
      to_user_id: transaction.to_user_id,
      amount: transaction.amount,
      type: 'release',
      status: 'success',
      description: 'Escrow funds released',
      job_id: transaction.job_id,
      shift_id: transaction.shift_id,
      processed_at: new Date()
    });

    // Update to user's wallet balance
    const newBalance = parseFloat(toWallet.balance) + parseFloat(transaction.amount);
    await toWallet.update({
      balance: newBalance,
      last_updated: new Date()
    });

    return successResponse(res, 'Escrow funds released successfully', {
      release_transaction: releaseTransaction,
      original_transaction: transaction
    });

  } catch (error) {
    console.error('Release escrow funds error:', error);
    return serverErrorResponse(res, 'Failed to release escrow funds', error);
  }
};

module.exports = {
  getWallet,
  getTransactions,
  addFunds,
  withdrawFunds,
  createEscrowTransaction,
  releaseEscrowFunds
};