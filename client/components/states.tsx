'use client';

import React from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorProps {
  error: Error;
  retry: () => void;
}

export function ErrorState({ error, retry }: ErrorProps) {
  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Requests</h2>
      <p className="text-gray-600 mb-6">
        {error?.message || 'Unable to connect to the server. Please check your connection.'}
      </p>
      <button
        onClick={retry}
        className="btn-primary flex items-center gap-2 mx-auto"
      >
        <RefreshCw className="w-4 h-4" />
        Try Again
      </button>
    </div>
  );
}

interface EmptyStateProps {
  filter?: string;
}

export function EmptyState({ filter }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="mb-4">
        <svg
          className="w-12 h-12 mx-auto text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        {filter && filter !== 'all'
          ? `No ${filter} requests found`
          : 'No requests yet'}
      </h2>
      <p className="text-gray-600 mb-6">
        {filter && filter !== 'all'
          ? 'Try changing your filter or submit a new request.'
          : 'Submit your first request to get started.'}
      </p>
      <Link href="/submit" className="btn-primary inline-block">
        Submit Request
      </Link>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="card p-6">
      <div className="h-6 skeleton w-48 mb-4"></div>
      <div className="space-y-2 mb-4">
        <div className="h-4 skeleton w-full"></div>
        <div className="h-4 skeleton w-5/6"></div>
        <div className="h-4 skeleton w-4/6"></div>
      </div>
      <div className="flex gap-2">
        <div className="h-6 skeleton w-20"></div>
        <div className="h-6 skeleton w-20"></div>
      </div>
    </div>
  );
}
