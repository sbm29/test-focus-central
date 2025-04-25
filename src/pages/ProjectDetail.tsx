
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { mockProjects, mockTestCases } from '@/data/mockData';
import { FileText, CheckSquare, Activity, ArrowLeft } from 'lucide-react';
import ProjectOverview from '@/components/projects/ProjectOverview';
import ProjectTestCases from '@/components/projects/ProjectTestCases';
import ProjectExecution from '@/components/projects/ProjectExecution';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  const [activeModule, setActiveModule] = useState('');
  const [activeTestSuite, setActiveTestSuite] = useState('');

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

          <TabsContent value="overview">
            <ProjectOverview project={project} />
          </TabsContent>

          <TabsContent value="test-cases">
            <ProjectTestCases 
              projectId={project.id}
              testCases={projectTestCases}
              activeModule={activeModule}
              activeTestSuite={activeTestSuite}
              onCreateTestCase={handleCreateTestCase}
              onDeleteTestCase={handleDeleteTestCase}
              onExecuteTestCase={handleExecuteTestCase}
            />
          </TabsContent>

          <TabsContent value="execution">
            <ProjectExecution 
              onNavigateToTestCases={() => setActiveTab('test-cases')} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ProjectDetail;
