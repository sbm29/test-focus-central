
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { TestCase } from '@/types/testCase';

const testExecutionSchema = z.object({
  status: z.enum(['Passed', 'Failed', 'Blocked', 'Not Executed']),
  actualResults: z.string().min(5, { message: 'Please describe the actual results.' }),
  notes: z.string().optional(),
});

type TestExecutionFormValues = z.infer<typeof testExecutionSchema>;

interface TestExecutionFormProps {
  testCase: TestCase;
  onSubmit: (data: TestExecutionFormValues) => void;
  defaultValues?: Partial<TestExecutionFormValues>;
}

const TestExecutionForm: React.FC<TestExecutionFormProps> = ({
  testCase,
  onSubmit,
  defaultValues,
}) => {
  const { toast } = useToast();
  
  const form = useForm<TestExecutionFormValues>({
    resolver: zodResolver(testExecutionSchema),
    defaultValues: {
      status: defaultValues?.status || 'Not Executed',
      actualResults: defaultValues?.actualResults || '',
      notes: defaultValues?.notes || '',
    },
  });

  const handleSubmit = (values: TestExecutionFormValues) => {
    onSubmit(values);
    
    toast({
      title: `Test case ${values.status.toLowerCase()}`,
      description: `Test case "${testCase.title}" has been marked as ${values.status.toLowerCase()}.`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{testCase.title}</CardTitle>
          <CardDescription>{testCase.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {testCase.preconditions && (
            <div>
              <h3 className="font-medium">Preconditions</h3>
              <p className="text-sm text-muted-foreground">{testCase.preconditions}</p>
            </div>
          )}
          
          <div>
            <h3 className="font-medium mb-2">Test Steps</h3>
            <div className="text-sm whitespace-pre-line bg-muted p-3 rounded-md">
              {testCase.steps}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Expected Results</h3>
            <div className="text-sm whitespace-pre-line bg-muted p-3 rounded-md">
              {testCase.expectedResults}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Separator />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Test Result</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Passed">Passed</SelectItem>
                    <SelectItem value="Failed">Failed</SelectItem>
                    <SelectItem value="Blocked">Blocked</SelectItem>
                    <SelectItem value="Not Executed">Not Executed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="actualResults"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Actual Results</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe what actually happened when executing the test" 
                    className="min-h-20"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Add any additional notes or observations" 
                    className="min-h-20"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit">
              Save Execution
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default TestExecutionForm;
