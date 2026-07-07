import { afterEach, describe, expect, it } from '@jest/globals';
import { ConfigurationManager } from '../../src/config';
import { createProjectResponse } from '../../src/tools/projects/response-formatter';
import { createTaskResponse } from '../../src/tools/tasks/crud/TaskResponseFormatter';

describe('tool response verbosity', () => {
  afterEach(() => {
    delete process.env.VIKUNJA_RESPONSE_VERBOSITY;
    ConfigurationManager.reset();
  });

  it('applies global minimal verbosity to task responses', () => {
    process.env.VIKUNJA_RESPONSE_VERBOSITY = 'minimal';
    ConfigurationManager.reset();

    const result = createTaskResponse('get-task', 'Task found', {
      task: {
        id: 1,
        title: 'Task',
        done: false,
        project_id: 4,
        bucket_id: 9,
        labels: [{ id: 2, title: 'Red' }],
        assignees: [{ id: 3, username: 'demin' }],
        description: 'Hidden',
        priority: 3,
      },
    });

    expect(result.transformation.originalResponse.data).toEqual({
      id: 1,
      title: 'Task',
      done: false,
      project_id: 4,
      bucket_id: 9,
      labels: [{ id: 2, title: 'Red' }],
      assignees: [{ id: 3, username: 'demin' }],
    });
    expect(result.transformation.context.verbosity).toBe('minimal');
  });

  it('keeps operational task fields even when globally excluded', () => {
    process.env.VIKUNJA_RESPONSE_EXCLUDE_FIELDS = 'done,project_id,bucket_id,labels,assignees';
    ConfigurationManager.reset();

    const result = createTaskResponse('get-task', 'Task found', {
      task: {
        id: 1,
        title: 'Task',
        done: false,
        project_id: 4,
        bucket_id: 9,
        labels: [{ id: 2, title: 'Red' }],
        assignees: [{ id: 3, username: 'demin' }],
      },
    });

    expect(result.transformation.originalResponse.data).toEqual({
      id: 1,
      title: 'Task',
      done: false,
      project_id: 4,
      bucket_id: 9,
      labels: [{ id: 2, title: 'Red' }],
      assignees: [{ id: 3, username: 'demin' }],
    });
  });

  it('lets project request verbosity override the global setting', () => {
    process.env.VIKUNJA_RESPONSE_VERBOSITY = 'minimal';
    ConfigurationManager.reset();

    const result = createProjectResponse(
      'get-project',
      'Project found',
      {
        project: {
          id: 2,
          title: 'Project',
          description: 'Visible',
          parent_project_id: 1,
          is_archived: false,
        },
      },
      {},
      'standard',
    );

    expect(result.transformation.originalResponse.data).toEqual({
      project: {
        id: 2,
        title: 'Project',
        description: 'Visible',
        parent_project_id: 1,
        is_archived: false,
      },
    });
    expect(result.transformation.context.verbosity).toBe('standard');
  });
});
