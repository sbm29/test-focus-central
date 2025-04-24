
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { TestCase } from '@/types/testCase';
import { Link } from 'react-router-dom';
import { MoreHorizontal, Pencil, Trash, CheckSquare } from 'lucide-react';

interface TestCaseListProps {
  testCases: TestCase[];
  onDelete: (id: string) => void;
  onExecute: (id: string) => void;
}

const TestCaseList: React.FC<TestCaseListProps> = ({ testCases, onDelete, onExecute }) => {
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Low':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Low</Badge>;
      case 'Medium':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Medium</Badge>;
      case 'High':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">High</Badge>;
      case 'Critical':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Critical</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Functional':
        return <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200">Functional</Badge>;
      case 'Performance':
        return <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 border-indigo-200">Performance</Badge>;
      case 'Security':
        return <Badge variant="secondary" className="bg-rose-50 text-rose-700 border-rose-200">Security</Badge>;
      case 'Usability':
        return <Badge variant="secondary" className="bg-teal-50 text-teal-700 border-teal-200">Usability</Badge>;
      case 'Compatibility':
        return <Badge variant="secondary" className="bg-sky-50 text-sky-700 border-sky-200">Compatibility</Badge>;
      default:
        return <Badge variant="secondary" className="bg-gray-50 text-gray-700 border-gray-200">{type}</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]">
              <Checkbox />
            </TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="w-[100px]">Priority</TableHead>
            <TableHead className="w-[130px]">Type</TableHead>
            <TableHead className="w-[180px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {testCases.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                No test cases found
              </TableCell>
            </TableRow>
          ) : (
            testCases.map((testCase) => (
              <TableRow key={testCase.id}>
                <TableCell className="p-0 pr-0 text-center">
                  <Checkbox />
                </TableCell>
                <TableCell>
                  <Link 
                    to={`/test-cases/${testCase.id}`} 
                    className="font-medium hover:text-primary transition-colors"
                  >
                    {testCase.title}
                  </Link>
                  <p className="text-sm text-muted-foreground truncate max-w-md">
                    {testCase.description}
                  </p>
                </TableCell>
                <TableCell>{getPriorityBadge(testCase.priority)}</TableCell>
                <TableCell>{getTypeBadge(testCase.type)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onExecute(testCase.id)}
                      title="Execute Test"
                    >
                      <CheckSquare className="h-4 w-4" />
                    </Button>
                    <Link to={`/test-cases/${testCase.id}/edit`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Edit Test Case"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => onDelete(testCase.id)}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TestCaseList;
