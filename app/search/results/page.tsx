import { Suspense } from 'react';
import SearchResultsClient from './SearchResultsClient';

export default function SearchResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <SearchResultsClient />
    </Suspense>
  );
}
