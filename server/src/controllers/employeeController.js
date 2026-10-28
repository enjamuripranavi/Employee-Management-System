const Employee = require('../models/Employee');
const { isDBConnected } = require('../config/db');

// Helper to check DB readiness
const checkDB = (res) => {
  if (!isDBConnected()) {
    res.status(503).json({
      success: false,
      message: 'Database is not connected. Please ensure MongoDB is running and MONGODB_URI is properly configured.',
      dbConnected: false,
    });
    return false;
  }
  return true;
};

/**
 * @desc   Get all employees with optional search and department filter
 * @route  GET /api/employees
 */
const getAllEmployees = async (req, res, next) => {
  try {
    if (!checkDB(res)) return;

    const { search, department, sort } = req.query;
    let query = {};

    // Filter by department if specified
    if (department && department.trim() !== '' && department.toLowerCase() !== 'all') {
      query.department = new RegExp(`^${department.trim()}$`, 'i');
    }

    // Search query across name, email, department, designation
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { department: searchRegex },
        { designation: searchRegex },
      ];
    }

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (sort === 'name_asc') sortOptions = { name: 1 };
    if (sort === 'name_desc') sortOptions = { name: -1 };
    if (sort === 'oldest') sortOptions = { createdAt: 1 };

    const employees = await Employee.find(query).sort(sortOptions);

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get single employee by ID
 * @route  GET /api/employees/:id
 */
const getEmployeeById = async (req, res, next) => {
  try {
    if (!checkDB(res)) return;

    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: `Employee not found with ID: ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Create new employee
 * @route  POST /api/employees
 */
const createEmployee = async (req, res, next) => {
  try {
    if (!checkDB(res)) return;

    const { name, email, department, designation } = req.body;

    // Validate required fields explicitly for fast feedback
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Full name is required' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Email address is required' });
    }
    if (!department || !department.trim()) {
      return res.status(400).json({ success: false, message: 'Department is required' });
    }
    if (!designation || !designation.trim()) {
      return res.status(400).json({ success: false, message: 'Designation is required' });
    }

    const employee = await Employee.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      department: department.trim(),
      designation: designation.trim(),
    });

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Update an existing employee
 * @route  PUT /api/employees/:id
 */
const updateEmployee = async (req, res, next) => {
  try {
    if (!checkDB(res)) return;

    const { name, email, department, designation } = req.body;

    // Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Full name cannot be empty' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Email cannot be empty' });
    }
    if (!department || !department.trim()) {
      return res.status(400).json({ success: false, message: 'Department cannot be empty' });
    }
    if (!designation || !designation.trim()) {
      return res.status(400).json({ success: false, message: 'Designation cannot be empty' });
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        department: department.trim(),
        designation: designation.trim(),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedEmployee) {
      return res.status(404).json({
        success: false,
        message: `Employee not found with ID: ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: updatedEmployee,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Delete an employee
 * @route  DELETE /api/employees/:id
 */
const deleteEmployee = async (req, res, next) => {
  try {
    if (!checkDB(res)) return;

    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: `Employee not found with ID: ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Employee "${employee.name}" deleted successfully`,
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get employee statistics (counts and department distribution)
 * @route  GET /api/employees/stats/summary
 */
const getEmployeeStats = async (req, res, next) => {
  try {
    if (!checkDB(res)) return;

    const totalEmployees = await Employee.countDocuments();
    const departmentDistribution = await Employee.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalEmployees,
        totalDepartments: departmentDistribution.length,
        departmentDistribution,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeStats,
};
