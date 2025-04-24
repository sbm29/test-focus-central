
const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const TestCase = require('../models/TestCase');
const TestExecution = require('../models/TestExecution');

const router = express.Router();

// Get all test cases
router.get('/', protect, async (req, res) => {
  try {
    const { projectId } = req.query;
    const filter = projectId ? { projectId } : {};
    
    const testCases = await TestCase.find(filter)
      .populate('projectId', 'name')
      .populate('createdBy', 'name');
    
    res.json(testCases);
  } catch (error) {
    console.error('Get test cases error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create test case
router.post('/', protect, async (req, res) => {
  try {
    const { 
      projectId, title, description, priority, 
      type, preconditions, steps, expectedResults 
    } = req.body;
    
    const testCase = await TestCase.create({
      projectId,
      title,
      description,
      priority,
      type,
      preconditions,
      steps,
      expectedResults,
      createdBy: req.user.id
    });
    
    res.status(201).json(testCase);
  } catch (error) {
    console.error('Create test case error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get test case by id
router.get('/:id', protect, async (req, res) => {
  try {
    const testCase = await TestCase.findById(req.params.id)
      .populate('projectId', 'name')
      .populate('createdBy', 'name');
    
    if (!testCase) {
      return res.status(404).json({ message: 'Test case not found' });
    }
    
    // Get the latest execution
    const latestExecution = await TestExecution.findOne({ 
      testCaseId: testCase._id 
    })
    .sort('-createdAt')
    .populate('executedBy', 'name');
    
    res.json({
      ...testCase.toObject(),
      latestExecution
    });
  } catch (error) {
    console.error('Get test case error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update test case
router.put('/:id', protect, async (req, res) => {
  try {
    const { 
      title, description, priority, 
      type, preconditions, steps, expectedResults, status 
    } = req.body;
    
    const testCase = await TestCase.findById(req.params.id);
    
    if (!testCase) {
      return res.status(404).json({ message: 'Test case not found' });
    }
    
    // Update fields
    testCase.title = title || testCase.title;
    testCase.description = description || testCase.description;
    testCase.priority = priority || testCase.priority;
    testCase.type = type || testCase.type;
    testCase.preconditions = preconditions || testCase.preconditions;
    testCase.steps = steps || testCase.steps;
    testCase.expectedResults = expectedResults || testCase.expectedResults;
    testCase.status = status || testCase.status;
    
    await testCase.save();
    
    res.json(testCase);
  } catch (error) {
    console.error('Update test case error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete test case
router.delete('/:id', protect, authorize(['admin', 'test_manager']), async (req, res) => {
  try {
    const testCase = await TestCase.findById(req.params.id);
    
    if (!testCase) {
      return res.status(404).json({ message: 'Test case not found' });
    }
    
    await testCase.deleteOne();
    
    // Also delete related test executions
    await TestExecution.deleteMany({ testCaseId: req.params.id });
    
    res.json({ message: 'Test case deleted successfully' });
  } catch (error) {
    console.error('Delete test case error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Execute test case
router.post('/:id/execute', protect, async (req, res) => {
  try {
    const { status, actualResults, notes } = req.body;
    
    // Verify test case exists
    const testCase = await TestCase.findById(req.params.id);
    if (!testCase) {
      return res.status(404).json({ message: 'Test case not found' });
    }
    
    // Create new test execution
    const testExecution = await TestExecution.create({
      testCaseId: req.params.id,
      status,
      actualResults,
      notes,
      executedBy: req.user.id
    });
    
    // Update test case status based on execution
    testCase.status = status === 'Passed' ? 'Passed' : 
                      status === 'Failed' ? 'Failed' : 
                      testCase.status;
    await testCase.save();
    
    res.status(201).json(testExecution);
  } catch (error) {
    console.error('Execute test case error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get test executions for a test case
router.get('/:id/executions', protect, async (req, res) => {
  try {
    const executions = await TestExecution.find({ 
      testCaseId: req.params.id 
    })
    .sort('-createdAt')
    .populate('executedBy', 'name');
    
    res.json(executions);
  } catch (error) {
    console.error('Get test executions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
