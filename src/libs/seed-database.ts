import { JobModel } from '../models/job-model';
import { ProfileModel } from '../models/profiles-model';

const tagList = Array.from({ length: 10 }, (v, k) => `tag${k + 1}`);

async function seedDatabase() {
  if(await ProfileModel.total() === 0){
    const userNumber: number = randomInteger(100, 999);

    await ProfileModel.insert(
      `User${userNumber}`,
      'user',
      `user-${userNumber}@example.com`,
      `8900${userNumber}${randomInteger(1000, 9999)}`
    );
  }

  if (await JobModel.total() === 0) {
    const jobs: any[] = [];

    for (let i = 1; i <= 50; i++) {
      jobs.push({
        _id: i,
        name: `Job ${i}`,
        tags: tagList.slice(randomInteger(0, 4), randomInteger(5, 9)),
        user: `User ${i}`,
        failedRunsCount: randomInteger(0, 10),
        successRunsCount: randomInteger(0, 100),
        lastRunDate: new Date(Date.now() - i * 86400000),
        schedule: '0 0 * * *',
        status: i % 2
      });
    }

    await JobModel.insertMany(jobs);
  }
}

function randomInteger(min: number, max: number) {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

export { seedDatabase };