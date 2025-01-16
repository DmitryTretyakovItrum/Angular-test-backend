import { Document, model, RootFilterQuery, Schema, Types } from 'mongoose';

interface IJob extends Document<number> {
  name: string;
  tags?: string[];
  user: string;
  failedRunsCount: number;
  successRunsCount: number;
  lastRunDate: Date;
  schedule: string;
  status: number;
}

class JobModel {
  public static readonly collectionName = 'job';
  private static readonly schema = new Schema<IJob>({
    _id: { type: Number, required: true },
    name: { type: String, required: true },
    tags: { type: [String], required: false },
    user: { type: String, required: true },
    failedRunsCount: { type: Number, required: true },
    successRunsCount: { type: Number, required: true },
    lastRunDate: { type: Date, required: true },
    schedule: { type: String, required: true },
    status: { type: Number, required: true }
  }, {
    autoIndex: false,
    autoCreate: false,
    versionKey: false
  });
  private static readonly model = model<IJob>(this.collectionName, this.schema);

  public static async get(count: number = 10, page: number = 1, filter?: RootFilterQuery<IJob>): Promise<IJob[]> {
    return await this.model.find(filter || {})
      .skip((page - 1) * count)
      .limit(count);
  }

  public static async getById(id: number): Promise<IJob | null> {
    return await this.model.findOne({ _id: id });
  }

  public static async update(doc: IJob): Promise<boolean> {
    const query = await this.model.updateOne({ _id: doc._id }, doc);
    return query.modifiedCount > 0;
  }

  public static async insert(
    name: string,
    user: string,
    failedRunsCount: number,
    successRunsCount: number,
    lastRunDate: Date,
    schedule: string,
    status: number,
    tags?: string[]
  ): Promise<IJob> {
    const doc = new this.model({
      _id: new Types.ObjectId(),
      name,
      user,
      failedRunsCount,
      successRunsCount,
      lastRunDate,
      schedule,
      status
    });

    if (tags) {
      doc.tags = tags;
    }

    return await doc.save();
  }

  public static async insertMany(docs: IJob[]): Promise<void> {
    await this.model.insertMany(docs);
  }

  public static async total(): Promise<number> {
    return await this.model.countDocuments({});
  }
}

export { JobModel };
export type { IJob };
