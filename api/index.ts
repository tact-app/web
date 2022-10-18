import ApiService from './ApiService';
import getUserApi from './entities/user';
import getTasksApi from './entities/tasks';
import getTagsApi from './entities/tags';

export const getAPI = (apiService: ApiService) => ({
  user: getUserApi(apiService),
  tasks: getTasksApi(apiService),
  tags: getTagsApi(apiService),
})