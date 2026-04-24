import React, { Suspense } from 'react';
import Link from 'next/link';
import { fetchRequests } from '@/lib/api';
import { RequestCard } from '@/components/request-card';
import { EmptyState, SkeletonCard } from '@/components/states';
import { ArrowRight } from 'lucide-react';

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'billing', label: 'Billing' },
  { value: 'support', label: 'Support' },
  { value: 'feedback', label: 'Feedback' },
  { value: 'general', label: 'General' },
];

interface DashboardContentProps {
  searchParams?: {
    page?: string;
    category?: string;
  };
}

async function DashboardContent({ searchParams }: DashboardContentProps) {
  const page = parseInt(searchParams?.page || '1', 10);
  const category = searchParams?.category || 'all';
  const data = await fetchRequests(page, 10, category);

  if (data.total === 0) {
    return <EmptyState filter={category} />;
  }

  return (
    <>
      <div className="space-y-4">
        {data.data.map((request) => (
          <RequestCard key={request._id} request={request} />
        ))}
      </div>

      {/* Pagination */}
      {data.pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {page > 1 && (
            <Link
              href={`/dashboard?page=${page - 1}&category=${category}`}
              className="btn-secondary"
            >
              ← Previous
            </Link>
          )}
          <span className="px-4 py-2 text-gray-600">
            Page {page} of {data.pages}
          </span>
          {page < data.pages && (
            <Link
              href={`/dashboard?page=${page + 1}&category=${category}`}
              className="btn-primary"
            >
              Next →
            </Link>
          )}
        </div>
      )}
    </>
  );
}

export default async function DashboardPage({
  searchParams,
}: DashboardContentProps) {
  const category = searchParams?.category || 'all';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Request Dashboard</h1>
          <p className="text-lg text-gray-600">
            View all incoming requests and their AI-generated insights
          </p>
        </div>

        {/* CTA to Submit */}
        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <p className="text-blue-900">Have a request to submit?</p>
          <Link href="/submit" className="btn-primary flex items-center gap-2">
            Submit Request
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Filter by Category
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.value}
                href={`/dashboard?page=1&category=${cat.value}`}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  category === cat.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Requests List - with Suspense for loading state */}
        <Suspense fallback={<DashboardLoadingSkeleton />}>
          <DashboardContent searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

function DashboardLoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
