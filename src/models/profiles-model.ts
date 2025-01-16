import { Document, model, Schema, Types } from 'mongoose';

interface IProfile extends Document<Types.ObjectId> {
  name: string;
  role: string;
  email: string;
  phone: string;
}

class ProfileModel {
  public static readonly collectionName = 'profiles';
  private static readonly schema = new Schema<IProfile>({
    _id: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  }, {
    autoIndex: false,
    autoCreate: false,
    versionKey: false
  });
  private static readonly model = model<IProfile>(this.collectionName, this.schema);

  public static async get(): Promise<IProfile | null> {
    return await this.model.findOne({});
  }

  public static async getById(id: Types.ObjectId | string): Promise<IProfile | null> {
    return await this.model.findOne({ _id: id instanceof Types.ObjectId ? id : new Types.ObjectId(id) });
  }

  public static async update(doc: IProfile): Promise<boolean> {
    const query = await this.model.updateOne({ _id: doc._id }, doc);
    return query.modifiedCount > 0;
  }

  public static async insert(
    name: string,
    role: string,
    email: string,
    phone: string
  ): Promise<IProfile> {
    const doc = new this.model({
      _id: new Types.ObjectId(),
      name,
      role,
      email,
      phone
    });

    return await doc.save();
  }

  public static async total(): Promise<number> {
    return await this.model.countDocuments({});
  }
}

export { ProfileModel };
export type { IProfile };
