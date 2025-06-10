'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { suggestProductTags, type SuggestProductTagsOutput } from '@/ai/flows/suggest-product-tags';
import { Loader2, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  productDescription: z.string().min(20, {
    message: "Product description must be at least 20 characters.",
  }).max(2000, {
    message: "Product description must not exceed 2000 characters."
  }),
});

type FormData = z.infer<typeof formSchema>;

export function TagSuggestionForm() {
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productDescription: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setSuggestedTags([]);
    try {
      const result: SuggestProductTagsOutput = await suggestProductTags({
        productDescription: data.productDescription,
      });
      setSuggestedTags(result.tags);
      toast({
        title: "Tags Suggested!",
        description: `${result.tags.length} tags have been generated.`,
      });
    } catch (error) {
      console.error("Error suggesting tags:", error);
      toast({
        title: "Error",
        description: "Failed to suggest tags. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center">
          <Tag className="mr-2 h-6 w-6 text-primary" />
          AI Product Tag Suggester
        </CardTitle>
        <CardDescription>
          Enter a product description below, and our AI will suggest relevant tags to improve searchability and categorization.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="productDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="productDescription" className="text-base">Product Description</FormLabel>
                  <FormControl>
                    <Textarea
                      id="productDescription"
                      placeholder="e.g., A comfortable and stylish classic t-shirt made from premium cotton. Perfect for everyday wear, available in various sizes and colors."
                      rows={6}
                      className="resize-y"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col items-stretch gap-4">
            <Button type="submit" disabled={isLoading} className="w-full text-lg py-3">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Suggesting Tags...
                </>
              ) : (
                <>
                  <Tag className="mr-2 h-5 w-5" />
                  Suggest Tags
                </>
              )}
            </Button>

            {suggestedTags.length > 0 && (
              <div className="mt-6 p-4 border rounded-md bg-secondary/30">
                <h3 className="text-lg font-semibold mb-3">Suggested Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {suggestedTags.map((tag, index) => (
                    <Badge key={index} variant="default" className="text-sm px-3 py-1">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
