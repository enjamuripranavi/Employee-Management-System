const { test, describe, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const Employee = require('../src/models/Employee');

describe('Employee Management API Tests', () => {
  let mongoServer;

  before(async () => {
    // Start in-memory MongoDB
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  after(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  beforeEach(async () => {
    await Employee.deleteMany({});
  });

  // 1. Health check
  test('GET /api/health should return ok and db connected', async () => {
    const res = await request(app).get('/api/health');
    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'ok');
    assert.equal(res.body.database.connected, true);
  });

  // 2. GET /api/employees - empty list
  test('GET /api/employees should return empty list initially', async () => {
    const res = await request(app).get('/api/employees');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.count, 0);
    assert.deepEqual(res.body.data, []);
  });

  // 3. POST /api/employees - create employee successfully
  test('POST /api/employees should create a new employee', async () => {
    const newEmp = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      department: 'Engineering',
      designation: 'Software Engineer',
    };

    const res = await request(app).post('/api/employees').send(newEmp);
    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.name, 'John Doe');
    assert.equal(res.body.data.email, 'john.doe@example.com');
    assert.equal(res.body.data.department, 'Engineering');
    assert.equal(res.body.data.designation, 'Software Engineer');
    assert.ok(res.body.data.id || res.body.data._id);
  });

  // 4. POST /api/employees - required field validation
  test('POST /api/employees should fail if required fields are missing', async () => {
    const res = await request(app).post('/api/employees').send({
      name: '',
      email: '',
      department: '',
      designation: '',
    });

    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.ok(res.body.message.includes('required'));
  });

  // 5. POST /api/employees - invalid email format
  test('POST /api/employees should fail with invalid email format', async () => {
    const res = await request(app).post('/api/employees').send({
      name: 'Jane Doe',
      email: 'invalid-email-address',
      department: 'Marketing',
      designation: 'Content Writer',
    });

    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.ok(res.body.message.toLowerCase().includes('valid email'));
  });

  // 6. POST /api/employees - duplicate email handling (409 Conflict)
  test('POST /api/employees should reject duplicate email addresses with 409', async () => {
    const empData = {
      name: 'Alice Smith',
      email: 'alice@example.com',
      department: 'Finance',
      designation: 'Accountant',
    };

    const firstRes = await request(app).post('/api/employees').send(empData);
    assert.equal(firstRes.status, 201);

    const dupRes = await request(app).post('/api/employees').send({
      name: 'Alice Duplicate',
      email: 'alice@example.com',
      department: 'HR',
      designation: 'Recruiter',
    });

    assert.equal(dupRes.status, 409);
    assert.equal(dupRes.body.success, false);
    assert.ok(dupRes.body.message.includes('already exists'));
  });

  // 7. GET /api/employees/:id - retrieve single employee
  test('GET /api/employees/:id should return single employee', async () => {
    const created = await Employee.create({
      name: 'Bob Marley',
      email: 'bob@example.com',
      department: 'Design',
      designation: 'UI/UX Designer',
    });

    const res = await request(app).get(`/api/employees/${created._id}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.name, 'Bob Marley');
  });

  // 8. GET /api/employees/:id - 404 on non-existent ID
  test('GET /api/employees/:id should return 404 for non-existent ID', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/employees/${fakeId}`);
    assert.equal(res.status, 404);
    assert.equal(res.body.success, false);
  });

  // 9. PUT /api/employees/:id - update existing employee
  test('PUT /api/employees/:id should update employee details', async () => {
    const created = await Employee.create({
      name: 'Charlie Brown',
      email: 'charlie@example.com',
      department: 'Sales',
      designation: 'Sales Representative',
    });

    const updateData = {
      name: 'Charles Brown',
      email: 'charles.b@example.com',
      department: 'Sales',
      designation: 'Senior Account Executive',
    };

    const res = await request(app).put(`/api/employees/${created._id}`).send(updateData);
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.name, 'Charles Brown');
    assert.equal(res.body.data.designation, 'Senior Account Executive');

    // Verify in database
    const inDb = await Employee.findById(created._id);
    assert.equal(inDb.name, 'Charles Brown');
    assert.equal(inDb.email, 'charles.b@example.com');
  });

  // 10. DELETE /api/employees/:id - delete existing employee
  test('DELETE /api/employees/:id should delete employee from database', async () => {
    const created = await Employee.create({
      name: 'Diana Prince',
      email: 'diana@example.com',
      department: 'Operations',
      designation: 'Operations Lead',
    });

    const res = await request(app).delete(`/api/employees/${created._id}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);

    const inDb = await Employee.findById(created._id);
    assert.equal(inDb, null);
  });

  // 11. Search query testing
  test('GET /api/employees?search=xxx should filter matching records', async () => {
    await Employee.create([
      { name: 'Sarah Tech', email: 'sarah@tech.com', department: 'Engineering', designation: 'Developer' },
      { name: 'Mark Sales', email: 'mark@sales.com', department: 'Sales', designation: 'Manager' },
      { name: 'Anna HR', email: 'anna@hr.com', department: 'Human Resources', designation: 'Recruiter' },
    ]);

    const res1 = await request(app).get('/api/employees?search=tech');
    assert.equal(res1.status, 200);
    assert.equal(res1.body.count, 1);
    assert.equal(res1.body.data[0].name, 'Sarah Tech');

    const res2 = await request(app).get('/api/employees?search=Sales');
    assert.equal(res2.status, 200);
    assert.equal(res2.body.count, 1);
    assert.equal(res2.body.data[0].department, 'Sales');
  });

  // 12. Summary stats endpoint
  test('GET /api/employees/stats/summary should return total counts and department distribution', async () => {
    await Employee.create([
      { name: 'Emp 1', email: 'e1@test.com', department: 'Engineering', designation: 'Dev' },
      { name: 'Emp 2', email: 'e2@test.com', department: 'Engineering', designation: 'Dev' },
      { name: 'Emp 3', email: 'e3@test.com', department: 'Marketing', designation: 'Specialist' },
    ]);

    const res = await request(app).get('/api/employees/stats/summary');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.totalEmployees, 3);
    assert.equal(res.body.data.totalDepartments, 2);
  });
});
