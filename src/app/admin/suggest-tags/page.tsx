
'use client';

import { TagSuggestionForm } from '@/components/admin/TagSuggestionForm';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function SuggestTagsPage() {
  const { currentUser, isLoading: authIsLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authIsLoading && (!currentUser || currentUser.role !== 'admin')) {
      router.push('/login?redirect=/admin/suggest-tags');
    }
  }, [currentUser, authIsLoading, router]);

  if (authIsLoading || !currentUser || currentUser.role !== 'admin') {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  return (
    <div className="py-8">
      <h1 className="text-4xl font-headline font-bold text-center mb-10">
        Product Tagging Assistant
      </h1>
      <TagSuggestionForm />
    </div>
  );
}
