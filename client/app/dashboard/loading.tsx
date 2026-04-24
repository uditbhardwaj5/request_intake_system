import React from 'react';

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-10 skeleton w-64 mb-4"></div>
          <div className="h-4 skeleton w-96"></div>
        </div>

        {/* Filter Skeleton */}
        <div className="mb-8">
          <div className="h-10 skeleton w-full max-w-2xl"></div>
        </div>

        {/* Cards Skeleton */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="card p-6">
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
          ))}
        </div>
      </div>
    </div>
  );
}
