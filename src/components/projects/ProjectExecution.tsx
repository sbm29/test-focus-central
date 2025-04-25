
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ProjectExecutionProps {
  onNavigateToTestCases: () => void;
}

const ProjectExecution: React.FC<ProjectExecutionProps> = ({ onNavigateToTestCases }) => {
  return (
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
            <Button onClick={onNavigateToTestCases}>
              Go to Test Cases
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectExecution;
