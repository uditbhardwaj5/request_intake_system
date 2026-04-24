import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Request {
  _id: string;
  name: string;
  email: string;
  message: string;
  category: 'billing' | 'support' | 'feedback' | 'general' | null;
  summary: string | null;
  urgency: 'low' | 'medium' | 'high' | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRequestPayload {
  name: string;
  email: string;
  message: string;
}

export interface RequestsResponse {
  statusCode: number;
  message: string;
  data: {
    data: Request[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export async function createRequest(payload: CreateRequestPayload): Promise<Request> {
  const response = await apiClient.post('/requests', payload);
  return response.data.data;
}

export async function fetchRequests(
  page: number = 1,
  limit: number = 10,
  category?: string,
): Promise<RequestsResponse['data']> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (category && category !== 'all') {
    params.append('category', category);
  }

  const response = await apiClient.get(`/requests?${params.toString()}`);
  return response.data.data;
}
