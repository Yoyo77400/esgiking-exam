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

  async createTracker(employee_id: string): Promise<ITracker> {
    return this.trackerModel.create({ employee_id });
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

    return this.trackerModel.findOne({ employee_id: employeeId });
  }

  async findNearestTracker(
    restaurantLocation: { latitude: number; longitude: number }
  ): Promise<ITracker | null> {
    const trackers = await this.trackerModel.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [restaurantLocation.longitude, restaurantLocation.latitude]
          },
          distanceField: "distance",
          spherical: true
        }
      },
      {
        $lookup: {
          from: "employees",
          localField: "employee_id",
          foreignField: "_id",
          as: "employee"
        }
      },
      {
        $unwind: "$employee"
      },
      {
        $limit: 1
      }
    ]);

    return trackers.length > 0 ? trackers[0] : null;
  }
}
