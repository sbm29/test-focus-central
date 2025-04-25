
import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockProjects, mockTestCases } from '@/data/mockData';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import TestExecutionForm from '@/components/test-execution/TestExecutionForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const TestExecution = () => {
  const { id } = useParams<{ id?: string }>();
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedTestCase, setSelectedTestCase] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const navigate = useNavigate();
  
  // If there's no ID, show a project selection screen
  if (!id) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Test Execution</h1>
            <p className="text-muted-foreground mt-1">Execute and track test cases</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Select a Project</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between border-b border-border pb-3">
                    <div>
                      <h3 className="font-medium">{project.name}</h3>
                      <p className="text-sm text-muted-foreground">{project.testCaseCount} test cases</p>
                    </div>
                    <Link to={`/test-execution/${project.id}`}>
                      <Button>Execute Tests</Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  // If ID is provided, show the test execution screen for that project
  const project = mockProjects.find(p => p.id === id);
  const projectTestCases = mockTestCases.filter(tc => tc.projectId === id);

  if (!project) {
    return (
      <MainLayout>
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <Link to="/test-execution">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Test Execution
            </Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const pendingTestCases = projectTestCases.filter(tc => tc.status === 'Pending' || !tc.status);
  const completedTestCases = projectTestCases.filter(tc => tc.status && tc.status !== 'Pending');

  const handleSubmitExecution = (values: any) => {
    console.log('Execution submitted:', values);
  };
  
  const handleViewDetails = (testCase: any) => {
    setSelectedTestCase(testCase);
    setDetailsOpen(true);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Link to="/test-execution">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Test Execution
            </Button>
          </Link>
        </div>

        <div>
          <h1 className="text-2xl font-bold">{project.name} - Test Execution</h1>
          <p className="text-muted-foreground mt-1">Execute test cases for this project</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending" className="relative">
              Pending Execution
              {pendingTestCases.length > 0 && (
                <span className="ml-2 rounded-full bg-primary text-primary-foreground text-xs py-0.5 px-2">
                  {pendingTestCases.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed
              {completedTestCases.length > 0 && (
                <span className="ml-2 rounded-full bg-muted text-muted-foreground text-xs py-0.5 px-2">
                  {completedTestCases.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            {pendingTestCases.length === 0 ? (
              <div className="bg-muted/40 rounded-lg p-8 text-center">
                <h3 className="text-lg font-medium">No pending test cases</h3>
                <p className="text-muted-foreground mt-1">All test cases have been executed</p>
                <Button variant="outline" className="mt-4" onClick={() => setActiveTab('completed')}>
                  View Completed Tests
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {pendingTestCases.map((testCase) => (
                  <Card key={testCase.id}>
                    <CardHeader className="pb-0">
                      <CardTitle className="text-lg">Execute: {testCase.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <TestExecutionForm
                        testCase={testCase}
                        onSubmit={handleSubmitExecution}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed">
            {completedTestCases.length === 0 ? (
              <div className="bg-muted/40 rounded-lg p-8 text-center">
                <h3 className="text-lg font-medium">No completed test cases</h3>
                <p className="text-muted-foreground mt-1">Execute test cases to see them here</p>
                <Button variant="outline" className="mt-4" onClick={() => setActiveTab('pending')}>
                  Go to Pending Tests
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {completedTestCases.map((testCase) => (
                  <Card key={testCase.id}>
                    <div className="flex items-center p-4 border-b border-border">
                      <div className="flex-1">
                        <h3 className="font-medium">{testCase.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-block h-2 w-2 rounded-full ${
                            testCase.status === 'Passed' ? 'bg-green-500' : 
                            testCase.status === 'Failed' ? 'bg-red-500' : 'bg-amber-500'
                          }`} />
                          <span className={`text-sm ${
                            testCase.status === 'Passed' ? 'test-status-passed' : 
                            testCase.status === 'Failed' ? 'test-status-failed' : 'test-status-blocked'
                          }`}>
                            {testCase.status}
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(testCase)}>
                        <ArrowRight className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Test Execution Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Test Execution Details</DialogTitle>
          </DialogHeader>
          {selectedTestCase && (
            <div className="space-y-6 pt-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{selectedTestCase.title}</h2>
                <Badge variant={selectedTestCase.status === 'Passed' ? 'outline' : 'destructive'}>
                  {selectedTestCase.status}
                </Badge>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Priority</h3>
                  <p>{selectedTestCase.priority}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Type</h3>
                  <p>{selectedTestCase.type}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                <p className="text-sm">{selectedTestCase.description}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Steps</h3>
                <div className="text-sm whitespace-pre-line bg-muted/40 p-3 rounded-md">
                  {selectedTestCase.steps}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Expected Results</h3>
                  <div className="text-sm whitespace-pre-line bg-muted/40 p-3 rounded-md">
                    {selectedTestCase.expectedResults}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Actual Results</h3>
                  <div className="text-sm whitespace-pre-line bg-muted/40 p-3 rounded-md">
                    {selectedTestCase.actualResults || "No results recorded"}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setDetailsOpen(false)}>Close</Button>
                <Button onClick={() => navigate(`/test-cases/${selectedTestCase.id}`)}>
                  View Test Case
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default TestExecution;
