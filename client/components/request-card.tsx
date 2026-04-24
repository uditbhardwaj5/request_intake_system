'use client';

import React from 'react';
import { Request } from '@/lib/api';
import { Calendar, Mail, Tag, AlertTriangle } from 'lucide-react';

interface RequestCardProps {
  request: Request;
}

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  billing: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
  support: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
  feedback: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
  general: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' },
};

const urgencyColors: Record<string, string> = {
  low: 'text-green-600',
  medium: 'text-yellow-600',
  high: 'text-red-600',
};

export function RequestCard({ request }: RequestCardProps) {
  const categoryColor = request.category ? categoryColors[request.category] : null;
  const createdDate = new Date(request.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="card p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{request.name}</h3>
          <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
            <Mail className="w-4 h-4" />
            {request.email}
          </p>
        </div>
        {request.urgency && (
          <div className={`text-sm font-medium ${urgencyColors[request.urgency]} flex items-center gap-1`}>
            <AlertTriangle className="w-4 h-4" />
            {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}
          </div>
        )}
      </div>

      <p className="text-gray-700 mb-4 line-clamp-2">{request.message}</p>

      {request.summary && (
        <p className="text-sm text-gray-600 mb-4 p-2 bg-gray-50 rounded italic">
          "{request.summary}"
        </p>
      )}

      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-2">
          {request.category && categoryColor && (
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${categoryColor.bg} ${categoryColor.text} border ${categoryColor.border}`}
            >
              <Tag className="w-3 h-3" />
              {request.category.charAt(0).toUpperCase() + request.category.slice(1)}
            </span>
          )}
          {!request.category && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border border-gray-300 text-gray-500">
              Analyzing...
            </span>
          )}
        </div>
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {createdDate}
        </span>
      </div>
    </div>
  );
}
