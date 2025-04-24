
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { useToast } from '@/components/ui/use-toast';
import { TestCase } from '@/types/testCase';

const testCaseSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']),
  type: z.enum(['Functional', 'Performance', 'Security', 'Usability', 'Compatibility', 'Other']),
  preconditions: z.string().optional(),
  steps: z.string().min(10, { message: 'Test steps are required.' }),
  expectedResults: z.string().min(5, { message: 'Expected results are required.' }),
});

type TestCaseFormValues = z.infer<typeof testCaseSchema>;

interface TestCaseFormProps {
  onSubmit: (data: TestCaseFormValues) => void;
  defaultValues?: Partial<TestCaseFormValues>;
  isEditing?: boolean;
  projectId?: string;
}

const TestCaseForm: React.FC<TestCaseFormProps> = ({
  onSubmit,
  defaultValues,
  isEditing = false,
  projectId,
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("details");
  
  const form = useForm<TestCaseFormValues>({
    resolver: zodResolver(testCaseSchema),
    defaultValues: {
      title: defaultValues?.title || '',
      description: defaultValues?.description || '',
      priority: defaultValues?.priority || 'Medium',
      type: defaultValues?.type || 'Functional',
      preconditions: defaultValues?.preconditions || '',
      steps: defaultValues?.steps || '',
      expectedResults: defaultValues?.expectedResults || '',
    },
  });

  const handleSubmit = (values: TestCaseFormValues) => {
    onSubmit(values);
    
    toast({
      title: `Test case ${isEditing ? 'updated' : 'created'} successfully`,
      description: `"${values.title}" has been ${isEditing ? 'updated' : 'created'}.`,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="steps">Steps & Expected Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter test case title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter test case description" 
                      className="min-h-20"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Functional">Functional</SelectItem>
                        <SelectItem value="Performance">Performance</SelectItem>
                        <SelectItem value="Security">Security</SelectItem>
                        <SelectItem value="Usability">Usability</SelectItem>
                        <SelectItem value="Compatibility">Compatibility</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="preconditions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preconditions</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter test case preconditions (optional)" 
                      className="min-h-20"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-between">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="button" onClick={() => setActiveTab("steps")}>
                Next: Steps
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="steps" className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="steps"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Test Steps</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter detailed test steps" 
                      className="min-h-40"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="expectedResults"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected Results</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter expected results" 
                      className="min-h-24"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setActiveTab("details")}
              >
                Back
              </Button>
              <Button type="submit">
                {isEditing ? 'Update Test Case' : 'Create Test Case'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
};

export default TestCaseForm;
