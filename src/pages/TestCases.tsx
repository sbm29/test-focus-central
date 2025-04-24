
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import TestCaseList from '@/components/test-cases/TestCaseList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockTestCases, mockProjects } from '@/data/mockData';
import TestCaseForm from '@/components/test-cases/TestCaseForm';
import { Plus, Search, Filter } from 'lucide-react';

const TestCases = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');

  const filteredTestCases = mockTestCases.filter((testCase) => {
    const matchesSearch = testCase.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        testCase.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || testCase.priority.toLowerCase() === priorityFilter.toLowerCase();
    const matchesType = typeFilter === 'all' || testCase.type.toLowerCase() === typeFilter.toLowerCase();
    const matchesProject = projectFilter === 'all' || testCase.projectId === projectFilter;
    
    return matchesSearch && matchesPriority && matchesType && matchesProject;
  });

  const handleCreateTestCase = (data: any) => {
    console.log('Create test case with data:', data);
    setIsDialogOpen(false);
  };

  const handleDeleteTestCase = (testCaseId: string) => {
    console.log('Delete test case:', testCaseId);
  };

  const handleExecuteTestCase = (testCaseId: string) => {
    console.log('Execute test case:', testCaseId);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Test Cases</h1>
            <p className="text-muted-foreground mt-1">Manage your test cases across all projects</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Test Case
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Test Case</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <TestCaseForm onSubmit={handleCreateTestCase} />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search test cases..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select 
            defaultValue="all" 
            onValueChange={setProjectFilter}
          >
            <SelectTrigger className="w-full md:w-36">
              <SelectValue placeholder="Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {mockProjects.map(project => (
                <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select 
            defaultValue="all" 
            onValueChange={setPriorityFilter}
          >
            <SelectTrigger className="w-full md:w-36">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
          <Select 
            defaultValue="all" 
            onValueChange={setTypeFilter}
          >
            <SelectTrigger className="w-full md:w-36">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="functional">Functional</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
              <SelectItem value="security">Security</SelectItem>
              <SelectItem value="usability">Usability</SelectItem>
              <SelectItem value="compatibility">Compatibility</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <TestCaseList 
            testCases={filteredTestCases} 
            onDelete={handleDeleteTestCase}
            onExecute={handleExecuteTestCase}
          />
        </div>

        {filteredTestCases.length === 0 && (
          <div className="bg-muted/40 rounded-lg p-8 text-center">
            <h3 className="text-lg font-medium">No test cases found</h3>
            <p className="text-muted-foreground mt-1">Try adjusting your search or filters</p>
            <Button variant="outline" className="mt-4" onClick={() => {
              setSearchTerm('');
              setPriorityFilter('all');
              setTypeFilter('all');
              setProjectFilter('all');
            }}>
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default TestCases;
