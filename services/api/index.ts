import { ApiService } from './ApiService';
import getTasksApi from './entities/tasks';
import getTagsApi from './entities/tags';
import getGoalsApi from './entities/goals';
import getDescriptionsApi from './entities/descriptions';
import getFocusConfigurationsApi from './entities/focusConfigurations';
import getSpacesApi from './entities/spaces';

export const getAPI = (apiService: ApiService) => ({
  tasks: getTasksApi(apiService),
  goals: getGoalsApi(apiService),
  tags: getTagsApi(apiService),
  descriptions: getDescriptionsApi(apiService),
  spaces: getSpacesApi(apiService),
  focusConfigurations: getFocusConfigurationsApi(apiService),
});
