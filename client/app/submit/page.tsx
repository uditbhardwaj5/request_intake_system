'use client';

import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { createRequest, CreateRequestPayload } from '@/lib/api';
import Link from 'next/link';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';

interface ApiErrorLike {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export default function SubmitPage() {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateRequestPayload>({
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<CreateRequestPayload> = async (data) => {
    try {
      setSubmitStatus('loading');
      setErrorMessage('');

      await createRequest(data);

      setSubmitStatus('success');
      reset();

      // Reset success state after 3 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
    } catch (error: unknown) {
      const typedError = error as ApiErrorLike;
      setSubmitStatus('error');
      setErrorMessage(
        typedError.response?.data?.message ||
        typedError.message ||
        'Failed to submit request. Please try again.',
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Submit Your Request</h1>
          <p className="text-lg text-gray-600">
            Our AI will automatically analyze and categorize your request
          </p>
        </div>

        <div className="max-w-md mx-auto">
          {/* Navigation */}
          <div className="text-center mb-8">
            <Link
              href="/dashboard"
              className="inline-block text-blue-600 hover:text-blue-700 font-medium underline"
            >
              ← View Dashboard
            </Link>
          </div>

          {/* Form Card */}
          <div className="card p-8">
            {submitStatus === 'success' ? (
              <div className="text-center py-8">
                <div className="flex justify-center mb-4">
                  <CheckCircle className="w-16 h-16 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>
                <p className="text-gray-600 mb-4">
                  Your request has been submitted. Our AI is analyzing it now.
                </p>
                <button
                  onClick={() => setSubmitStatus('idle')}
                  className="btn-primary"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Error Alert */}
                {submitStatus === 'error' && (
                  <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-900">Submission Failed</p>
                      <p className="text-sm text-red-700">{errorMessage}</p>
                    </div>
                  </div>
                )}

                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    {...register('name', {
                      required: 'Name is required',
                      minLength: { value: 2, message: 'Name must be at least 2 characters' },
                    })}
                    disabled={submitStatus === 'loading'}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    disabled={submitStatus === 'loading'}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                  )}
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    placeholder="Describe your request in detail..."
                    rows={5}
                    {...register('message', {
                      required: 'Message is required',
                      minLength: {
                        value: 10,
                        message: 'Message must be at least 10 characters',
                      },
                    })}
                    disabled={submitStatus === 'loading'}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                  />
                  {errors.message && (
                    <p className="text-sm text-red-600 mt-1">{errors.message.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitStatus === 'loading' || isSubmitting}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  {submitStatus === 'loading' ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Request'
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Footer Info */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Your request will be analyzed by our AI and automatically categorized for faster resolution.
          </p>
        </div>
      </div>
    </div>
  );
}
