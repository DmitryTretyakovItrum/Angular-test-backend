import { Elysia, t } from 'elysia';
import swagger from '@elysiajs/swagger';
import { connectDB } from './models';
import { seedDatabase } from './libs/seed-database';
import { JobModel } from './models/job-model';
import Logger from './libs/logger';
import { ProfileModel } from './models/profiles-model';
import { Types } from 'mongoose';

connectDB()
  .then(() => seedDatabase())
  .then(() => Logger.i('Database seeded'))
  .catch(Logger.e);

const app = new Elysia()
  .use(swagger())
  .get('/jobs/get', async ({ query, error }) => {
    try {
      const { count = 10, page = 1, name, tag } = query;

      let queryObj: any = {};
      if (name) queryObj.name = new RegExp(name, 'i');
      if (tag) queryObj.tags = { $in: tag.split(',').map((t => t.trim())) };

      const jobs = await JobModel.get(count, page, queryObj);
      const response = jobs.map((job) => {
        return {
          id: job._id,
          name: job.name,
          tags: job.tags,
          user: job.user,
          failedRunsCount: job.failedRunsCount,
          successRunsCount: job.successRunsCount,
          lastRunDate: job.lastRunDate,
          schedule: job.schedule,
          status: job.status
        };
      });

      return response;
    } catch (e: any) {
      Logger.e(e);
      return error(422, `Controller error ${e.message}`);
    }
  }, {
    detail: {
      tags: ['Jobs'],
      description: 'Getting a list of Jobs with pagination support'
    },
    query: t.Object({
      count: t.Optional(t.Number({ default: 10 })),
      page: t.Optional(t.Number({ default: 1 })),
      name: t.Optional(t.String()),
      tag: t.Optional(t.String()),
    }),
    response: {
      200: t.Array(t.Object({
        id: t.Number(),
        name: t.String(),
        tags: t.Optional(t.Array(t.String())),
        user: t.String(),
        failedRunsCount: t.Number(),
        successRunsCount: t.Number(),
        lastRunDate: t.Date(),
        schedule: t.String(),
        status: t.Number()
      })),
      422: t.String({ default: 'Controller error <error_message>' })
    },
  })
  .patch('/jobs/patch', async ({ body, error }) => {
    try {
      const doc: any = {
        _id: body.id,
        name: body.name,
        tags: body.tags,
        user: body.user,
        failedRunsCount: body.failedRunsCount,
        successRunsCount: body.successRunsCount,
        lastRunDate: body.lastRunDate,
        schedule: body.schedule,
        status: body.status
      }

      if (!await JobModel.update(doc)) {
        return { success: false, error: 'Job not found' };
      }

      return { success: true };
    } catch (e: any) {
      Logger.e(e);
      return error(422, `Controller error ${e.message}`);
    }
  }, {
    detail: {
      tags: ['Jobs'],
      description: 'Changing the job'
    },
    body: t.Object({
      id: t.Number(),
      name: t.String(),
      tags: t.Optional(t.Array(t.String())),
      user: t.String(),
      failedRunsCount: t.Number(),
      successRunsCount: t.Number(),
      lastRunDate: t.Date(),
      schedule: t.String(),
      status: t.Number()
    }),
    response: {
      200: t.Object({
        success: t.Boolean(),
        error: t.Optional(t.String()),
      }),
      422: t.String({ default: 'Controller error <error_message>' })
    },
  })
  .get('/profile/get', async ({ error }) => {
    try {
      const profile = await ProfileModel.get();

      if (!profile) {
        return error(404, 'Profile not found');
      }

      const response = {
        id: profile._id.toString(),
        name: profile.name,
        role: profile.role,
        email: profile.email,
        phone: profile.phone
      };

      return response;
    } catch (e: any) {
      Logger.e(e);
      return error(422, `Controller error ${e.message}`);
    }
  }, {
    detail: {
      tags: ['Profile'],
      description: 'Getting the current profile'
    },
    response: {
      200: t.Object({
        id: t.String(),
        name: t.String(),
        role: t.String(),
        email: t.String(),
        phone: t.String(),
      }),
      404: t.String({ default: 'Profile not found' }),
      422: t.String({ default: 'Controller error <error_message>' })
    }
  })
  .patch('/profile/patch', async ({ body, error }) => {
    try {
      const doc: any = {
        _id: new Types.ObjectId(body.id),
        name: body.name,
        role: body.role,
        email: body.email,
        phone: body.phone
      }

      if (!await ProfileModel.update(doc)) {
        return { success: false, error: 'Profile not found' };
      }

      return { success: true };
    } catch (e: any) {
      Logger.e(e);
      return error(422, `Controller error ${e.message}`);
    }
  }, {
    detail: {
      tags: ['Profile'],
      description: 'Changing the current profile'
    },
    body: t.Object({
      id: t.String(),
      name: t.String(),
      role: t.String(),
      email: t.String(),
      phone: t.String(),
    }),
    response: {
      200: t.Object({
        success: t.Boolean(),
        error: t.Optional(t.String()),
      }),
      422: t.String({ default: 'Controller error <error_message>' })
    }
  });

// Start the server
app.listen({
  idleTimeout: 60,
  port: 3100
}, (app) => {
  Logger.i(`Server running at http://${app?.hostname}:${app?.port}`);
});

