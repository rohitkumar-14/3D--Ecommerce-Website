'use server';

/**
 * @fileOverview AI-powered product tag suggestion flow.
 *
 * - suggestProductTags - A function that suggests relevant tags for a product based on its description.
 * - SuggestProductTagsInput - The input type for the suggestProductTags function.
 * - SuggestProductTagsOutput - The return type for the suggestProductTags function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestProductTagsInputSchema = z.object({
  productDescription: z
    .string()
    .describe('The description of the product for which to suggest tags.'),
});

export type SuggestProductTagsInput = z.infer<typeof SuggestProductTagsInputSchema>;

const SuggestProductTagsOutputSchema = z.object({
  tags: z
    .array(z.string())
    .describe('An array of relevant tags for the product description.'),
});

export type SuggestProductTagsOutput = z.infer<typeof SuggestProductTagsOutputSchema>;

export async function suggestProductTags(input: SuggestProductTagsInput): Promise<SuggestProductTagsOutput> {
  return suggestProductTagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestProductTagsPrompt',
  input: {schema: SuggestProductTagsInputSchema},
  output: {schema: SuggestProductTagsOutputSchema},
  prompt: `You are an expert in product categorization and tagging for e-commerce.

  Based on the following product description, suggest 5-10 relevant tags that would help customers find this product when searching online.

  Product Description: {{{productDescription}}}

  Return the tags as a JSON array of strings.`,
});

const suggestProductTagsFlow = ai.defineFlow(
  {
    name: 'suggestProductTagsFlow',
    inputSchema: SuggestProductTagsInputSchema,
    outputSchema: SuggestProductTagsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
