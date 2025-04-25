
import * as XLSX from 'xlsx';
import { TestCase } from '@/types/testCase';

export const importTestCasesFromExcel = (file: File): Promise<Partial<TestCase>[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Validate and transform the data
        const testCases = jsonData.map((row: any) => ({
          title: row.title,
          description: row.description,
          priority: row.priority || 'Medium',
          type: row.type,
          preconditions: row.preconditions || '',
          steps: row.steps,
          expectedResults: row.expectedResults,
          status: row.status || 'Draft',
          moduleId: row.moduleId || '',
          testSuiteId: row.testSuiteId || ''
        }));

        resolve(testCases);
      } catch (error) {
        console.error('Excel import error:', error);
        reject(new Error('Failed to parse Excel file'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsBinaryString(file);
  });
};

export const validateTestCase = (testCase: Partial<TestCase>): string[] => {
  const errors: string[] = [];
  const requiredFields = ['title', 'description', 'type', 'steps', 'expectedResults'];
  
  requiredFields.forEach(field => {
    if (!testCase[field as keyof Partial<TestCase>]) {
      errors.push(`${field} is required`);
    }
  });

  return errors;
};
