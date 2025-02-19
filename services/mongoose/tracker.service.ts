import { ITracker } from "../../models";
import { MongooseService } from "./mongoose.service";
import { isValidObjectId, Model } from "mongoose";
import { TrackerSchema } from "./schema";
import { Models } from "./mongoose.models";

export type ICreateTracker = Omit<ITracker, "_id" | "createdAt" | "updatedAt">;
export type IUpdateTracker = Omit<
  ITracker,
  "employee" | "createdAt" | "updatedAt"
>;

export class TrackerService {
  readonly mongooseService: MongooseService;
  readonly trackerModel: Model<ITracker>;

  constructor(mongooseService: MongooseService) {
    this.mongooseService = mongooseService;
    this.trackerModel = this.mongooseService.mongoose.model(
      Models.Tracker,
      TrackerSchema
    );
  }

  async createTracker(tracker: ICreateTracker): Promise<ITracker> {
    return this.trackerModel.create(tracker);
  }

  async updateTracker(tracker: IUpdateTracker): Promise<ITracker | null> {
    if (!isValidObjectId(tracker._id)) {
      return Promise.resolve(null);
    }

    return this.trackerModel.findByIdAndUpdate(
      tracker._id,
      {
        $set: {
          longitude: tracker.longitude,
          latitude: tracker.latitude,
        },
      },
      { new: true }
    );
  }

  async deleteTrackerById(id: string): Promise<ITracker | null> {
    if (!isValidObjectId(id)) {
      return Promise.resolve(null);
    }

    return this.trackerModel.findByIdAndDelete(id);
  }

  async findTrackerByEmployeeId(employeeId: string): Promise<ITracker | null> {
    if (!isValidObjectId(employeeId)) {
      return Promise.resolve(null);
    }

    return this.trackerModel.findOne({ employee: employeeId });
  }
}
