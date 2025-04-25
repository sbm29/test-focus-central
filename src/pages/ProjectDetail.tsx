import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { mockProjects, mockTestCases } from '@/data/mockData';
import { Pencil, Plus, FileText, CheckSquare, Activity, ArrowLeft } from 'lucide-react';
import TestCaseList from '@/components/test-cases/TestCaseList';
import TestCaseForm from '@/components/test-cases/TestCaseForm';
import ImportTestCases from '@/components/test-cases/ImportTestCases';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeModule, setActiveModule] = useState('');
  const [activeTestSuite, setActiveTestSuite] = useState('');

  // Find the project by ID from mock data
  const project = mockProjects.find((p) => p.id === id);
  const projectTestCases = mockTestCases.filter((tc) => tc.projectId === id);
  
  if (!project) {
    return (
      <MainLayout>
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <Link to="/projects">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'on hold': return 'bg-amber-100 text-amber-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
        <div className="flex items-center gap-2 mb-6">
          <Link to="/projects">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Projects
            </Button>
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row justify-between gap-4 items-start">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{project.name}</h1>
              <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
            </div>
            <p className="text-muted-foreground mt-1">{project.description}</p>
          </div>
          
          <div className="flex gap-2 w-full lg:w-auto">
            <Button variant="outline" className="flex-1 lg:flex-auto">
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex-1 lg:flex-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Test Case
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Test Case</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                  <TestCaseForm 
                    onSubmit={handleCreateTestCase} 
                    projectId={project.id}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">
              <Activity className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="test-cases">
              <FileText className="h-4 w-4 mr-2" />
              Test Cases
            </TabsTrigger>
            <TabsTrigger value="execution">
              <CheckSquare className="h-4 w-4 mr-2" />
              Test Execution
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Project Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Test Cases
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{project.testCaseCount}</div>
                  <div className="text-muted-foreground text-sm mt-1">Total test cases</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Pass Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{project.passRate}%</div>
                  <div className="text-muted-foreground text-sm mt-1">Overall pass rate</div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Created Date</dt>
                    <dd>{project.createdAt.toLocaleDateString()}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Last Updated</dt>
                    <dd>{project.updatedAt.toLocaleDateString()}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Test Cases</dt>
                    <dd>{project.testCaseCount}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Progress</dt>
                    <dd>{project.progress}%</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="test-cases">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Test Cases</CardTitle>
                  <CardDescription>
                    All test cases for this project
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <ImportTestCases 
                    projectId={project.id}
                    moduleId={activeModule}
                    testSuiteId={activeTestSuite}
                    onImportSuccess={() => {
                      // Refresh test cases list
                      console.log('Refreshing test cases after import');
                    }}
                  />
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Test Case
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Create New Test Case</DialogTitle>
                      </DialogHeader>
                      <div className="mt-4">
                        <TestCaseForm 
                          onSubmit={handleCreateTestCase} 
                          projectId={project.id}
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <TestCaseList 
                  testCases={projectTestCases} 
                  onDelete={handleDeleteTestCase}
                  onExecute={handleExecuteTestCase}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="execution">
            <Card>
              <CardHeader>
                <CardTitle>Test Execution</CardTitle>
                <CardDescription>
                  Execute and track test runs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center py-8">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">
                      Select test cases to execute from the Test Cases tab
                    </p>
                    <Button onClick={() => setActiveTab('test-cases')}>
                      Go to Test Cases
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ProjectDetail;
