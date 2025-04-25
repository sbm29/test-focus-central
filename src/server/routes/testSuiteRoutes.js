
const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const TestSuite = require('../models/TestSuite');

const router = express.Router();

// Get all test suites
router.get('/', protect, async (req, res) => {
  try {
    const { moduleId, projectId } = req.query;
    const filter = {};
    
    if (moduleId) filter.moduleId = moduleId;
    if (projectId) filter.projectId = projectId;
    
    const testSuites = await TestSuite.find(filter)
      .populate('moduleId', 'name')
      .populate('projectId', 'name')
      .populate('createdBy', 'name');
    
    res.json(testSuites);
  } catch (error) {
    console.error('Get test suites error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create test suite
router.post('/', protect, async (req, res) => {
  try {
    const { moduleId, projectId, name, description } = req.body;
    
    const testSuite = await TestSuite.create({
      moduleId,
      projectId,
      name,
      description,
      createdBy: req.user.id
    });
    
    res.status(201).json(testSuite);
  } catch (error) {
    console.error('Create test suite error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get test suite by id
router.get('/:id', protect, async (req, res) => {
  try {
    const testSuite = await TestSuite.findById(req.params.id)
      .populate('moduleId', 'name')
      .populate('projectId', 'name')
      .populate('createdBy', 'name');
    
    if (!testSuite) {
      return res.status(404).json({ message: 'Test suite not found' });
    }
    
    res.json(testSuite);
  } catch (error) {
    console.error('Get test suite error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update test suite
router.put('/:id', protect, async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const testSuite = await TestSuite.findById(req.params.id);
    
    if (!testSuite) {
      return res.status(404).json({ message: 'Test suite not found' });
    }
    
    testSuite.name = name || testSuite.name;
    testSuite.description = description || testSuite.description;
    
    await testSuite.save();
    
    res.json(testSuite);
  } catch (error) {
    console.error('Update test suite error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete test suite
router.delete('/:id', protect, authorize(['admin', 'test_manager']), async (req, res) => {
  try {
    const testSuite = await TestSuite.findById(req.params.id);
    
    if (!testSuite) {
      return res.status(404).json({ message: 'Test suite not found' });
    }
    
    await testSuite.deleteOne();
    
    res.json({ message: 'Test suite deleted successfully' });
  } catch (error) {
    console.error('Delete test suite error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
