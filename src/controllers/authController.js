const { User, CompanyProfile, GuardProfile, Wallet } = require('../models');
const { hashPassword, comparePassword, generateToken } = require('../helpers/auth');
const { successResponse, errorResponse, serverErrorResponse } = require('../helpers/response');

// Register new user
const register = async (req, res) => {
  try {
    const { name, email, password, phone, role = 'guard' } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return errorResponse(res, 'User with this email already exists', 409);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role,
      status: role === 'admin' ? 'active' : 'pending'
    });

    // Create wallet for user
    await Wallet.create({
      user_id: user.id,
      balance: 0.00,
      currency: 'USD'
    });

    // Create profile based on role
    if (role === 'agency') {
      await CompanyProfile.create({
        user_id: user.id,
        company_name: name,
        verification_status: 'pending'
      });
    } else if (role === 'guard') {
      await GuardProfile.create({
        user_id: user.id,
        verification_status: 'pending'
      });
    }

    // Generate token
    const token = generateToken(user.id, user.role);
    // Remove password from response
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      email_verified: user.email_verified,
      phone_verified: user.phone_verified
    };

    return successResponse(res, 'User registered successfully', {
      user: userResponse,
      token
    }, 201);

  } catch (error) {
    console.error('Registration error:', error);
    return serverErrorResponse(res, 'Registration failed', error);
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user with password
    const user = await User.findOne({ 
      where: { email },
      attributes: ['id', 'name', 'email', 'password', 'role', 'status', 'email_verified', 'phone_verified', 'last_login']
    });

    if (!user) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    // Check if account is active
    if (user.status === 'suspended') {
      return errorResponse(res, 'Account is suspended', 403);
    }

    if (user.status === 'pending') {
      return errorResponse(res, 'Account is pending approval', 403);
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    // Update last login
    await user.update({ last_login: new Date() });

    // Generate token
    const token = generateToken(user.id, user.role);

    // Remove password from response
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      email_verified: user.email_verified,
      phone_verified: user.phone_verified,
      last_login: user.last_login
    };

    return successResponse(res, 'Login successful', {
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    return serverErrorResponse(res, 'Login failed', error);
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: []
    });

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    // Include role-specific profile
    if (userRole === 'agency') {
      user = await User.findByPk(userId, {
        attributes: { exclude: ['password'] },
        include: [{
          model: CompanyProfile,
          as: 'companyProfile'
        }]
      });
    } else if (userRole === 'guard') {
      user = await User.findByPk(userId, {
        attributes: { exclude: ['password'] },
        include: [{
          model: GuardProfile,
          as: 'guardProfile'
        }]
      });
    }

    return successResponse(res, 'Profile retrieved successfully', { user });

  } catch (error) {
    console.error('Get profile error:', error);
    return serverErrorResponse(res, 'Failed to retrieve profile', error);
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    // Update user fields
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;

    await user.update(updateData);

    // Get updated user without password
    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    return successResponse(res, 'Profile updated successfully', { user: updatedUser });

  } catch (error) {
    console.error('Update profile error:', error);
    return serverErrorResponse(res, 'Failed to update profile', error);
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    // Verify current password
    const isCurrentPasswordValid = await comparePassword(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return errorResponse(res, 'Current password is incorrect', 400);
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword);

    // Update password
    await user.update({ password: hashedNewPassword });

    return successResponse(res, 'Password changed successfully');

  } catch (error) {
    console.error('Change password error:', error);
    return serverErrorResponse(res, 'Failed to change password', error);
  }
};

// Logout (client-side token removal)
const logout = async (req, res) => {
  try {
    // In a stateless JWT system, logout is typically handled client-side
    // by removing the token from storage
    return successResponse(res, 'Logged out successfully');
  } catch (error) {
    console.error('Logout error:', error);
    return serverErrorResponse(res, 'Logout failed', error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout
};