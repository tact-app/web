import ApiService from '../ApiService';
import { GoalData } from '../../components/pages/Goals/types';
import { JSONContent } from '@tiptap/core';

const getGoalsApi = (apiService: ApiService) => ({
  list: (id: string) => apiService.get<{ goals: Record<string, GoalData>, order: string[] }>(`/api/goals`, { id }),
  create: (goal: GoalData) => apiService.post<GoalData[]>(`/api/goals/create`, goal),
  delete: (listId: string, ids: string[]) => apiService.post<GoalData[]>(`/api/goals/delete`, { ids, listId }),
  order: (data: { listId: string, goalIds: string[], destination: number }) => apiService.post<GoalData[]>(`/api/goals/order`, data),
  update: (data: { id: string, fields: Partial<GoalData> }) => apiService.post<GoalData[]>(`/api/goals/update`, data),
  addDescription: (data: { description: JSONContent, id: string }) => apiService.post<GoalData[]>(`/api/goals/description`, data),
  getDescription: (id: string) => apiService.post<GoalData[]>(`/api/goals/description`, { id }),
});

export default getGoalsApi;
