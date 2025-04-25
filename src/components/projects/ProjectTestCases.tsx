
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import TestCaseList from '@/components/test-cases/TestCaseList';
import TestCaseForm from '@/components/test-cases/TestCaseForm';
import ImportTestCases from '@/components/test-cases/ImportTestCases';
import { TestCase } from '@/types/testCase';

interface ProjectTestCasesProps {
  projectId: string;
  testCases: TestCase[];
  activeModule: string;
  activeTestSuite: string;
  onCreateTestCase: (data: any) => void;
  onDeleteTestCase: (id: string) => void;
  onExecuteTestCase: (id: string) => void;
}

const ProjectTestCases: React.FC<ProjectTestCasesProps> = ({
  projectId,
  testCases,
  activeModule,
  activeTestSuite,
  onCreateTestCase,
  onDeleteTestCase,
  onExecuteTestCase,
}) => {
  return (
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
            projectId={projectId}
            moduleId={activeModule}
            testSuiteId={activeTestSuite}
            onImportSuccess={() => {
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
                  onSubmit={onCreateTestCase} 
                  projectId={projectId}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <TestCaseList 
          testCases={testCases} 
          onDelete={onDeleteTestCase}
          onExecute={onExecuteTestCase}
        />
      </CardContent>
    </Card>
  );
};

export default ProjectTestCases;
