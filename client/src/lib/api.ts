// GapZero API Client Service Layer

const API_BASE_URL = '/api';

export class ApiError extends Error {
  status: number;
  details?: any;

  constructor(message: string, status: number, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('gapzero_auth_token') || 'demo-token';
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = {
    ...getAuthHeader(),
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      data?.error || `Request failed with status ${response.status}`,
      response.status,
      data?.details
    );
  }

  return data.data !== undefined ? data.data : data;
}

export async function uploadResumeFile(file: File, targetRole: string): Promise<any> {
  const formData = new FormData();
  formData.append('resume', file);
  formData.append('target_role', targetRole);

  const token = localStorage.getItem('gapzero_auth_token') || 'demo-token';

  const response = await fetch(`${API_BASE_URL}/resume/analyze`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new ApiError(data?.error || 'Failed to upload and analyze resume', response.status);
  }

  return data.data;
}
