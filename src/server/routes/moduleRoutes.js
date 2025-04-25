
const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const Module = require('../models/Module');

const router = express.Router();

// Get all modules
router.get('/', protect, async (req, res) => {
  try {
    const { projectId } = req.query;
    const filter = projectId ? { projectId } : {};
    
    const modules = await Module.find(filter)
      .populate('projectId', 'name')
      .populate('createdBy', 'name');
    
    res.json(modules);
  } catch (error) {
    console.error('Get modules error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create module
router.post('/', protect, async (req, res) => {
  try {
    const { projectId, name, description } = req.body;
    
    const module = await Module.create({
      projectId,
      name,
      description,
      createdBy: req.user.id
    });
    
    res.status(201).json(module);
  } catch (error) {
    console.error('Create module error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get module by id
router.get('/:id', protect, async (req, res) => {
  try {
    const module = await Module.findById(req.params.id)
      .populate('projectId', 'name')
      .populate('createdBy', 'name');
    
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }
    
    res.json(module);
  } catch (error) {
    console.error('Get module error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update module
router.put('/:id', protect, async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const module = await Module.findById(req.params.id);
    
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }
    
    module.name = name || module.name;
    module.description = description || module.description;
    
    await module.save();
    
    res.json(module);
  } catch (error) {
    console.error('Update module error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete module
router.delete('/:id', protect, authorize(['admin', 'test_manager']), async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);
    
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }
    
    await module.deleteOne();
    
    res.json({ message: 'Module deleted successfully' });
  } catch (error) {
    console.error('Delete module error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
