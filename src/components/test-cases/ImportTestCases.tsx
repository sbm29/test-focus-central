
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Import } from 'lucide-react';
import { importTestCasesFromExcel, validateTestCase } from '@/utils/excelImport';

interface ImportTestCasesProps {
  projectId: string;
  moduleId: string;
  testSuiteId: string;
  onImportSuccess: () => void;
}

const ImportTestCases = ({ projectId, moduleId, testSuiteId, onImportSuccess }: ImportTestCasesProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const testCases = await importTestCasesFromExcel(file);
      const validationErrors: string[] = [];
      
      testCases.forEach((testCase, index) => {
        const errors = validateTestCase(testCase);
        if (errors.length > 0) {
          validationErrors.push(`Row ${index + 1}: ${errors.join(', ')}`);
        }
      });

      if (validationErrors.length > 0) {
        toast({
          title: "Validation Error",
          description: "Some test cases are missing required fields",
          variant: "destructive"
        });
        return;
      }

      // Add project, module and test suite IDs to each test case
      const enrichedTestCases = testCases.map(testCase => ({
        ...testCase,
        projectId,
        moduleId,
        testSuiteId
      }));

      // Make API call to save test cases
      const response = await fetch('/api/test-cases/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ testCases: enrichedTestCases }),
      });

      if (!response.ok) {
        throw new Error('Failed to import test cases');
      }

      toast({
        title: "Success",
        description: `Successfully imported ${testCases.length} test cases`,
      });

      onImportSuccess();
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to import test cases",
        variant: "destructive"
      });
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Import className="h-4 w-4 mr-2" />
          Import Test Cases
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Test Cases</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Upload an Excel (.xlsx) or CSV file with the following columns:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>title (required)</li>
              <li>description (required)</li>
              <li>priority</li>
              <li>type (required)</li>
              <li>preconditions</li>
              <li>steps (required)</li>
              <li>expectedResults (required)</li>
            </ul>
          </div>
          <div className="flex justify-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.csv"
              onChange={handleFileUpload}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportTestCases;
