import { ObjectId } from "mongodb";
import { ServiceResponse, ServiceResponseCode, PlanService } from "../services";
import { UserClass } from "../models/user.model";
import { DocumentType } from "@typegoose/typegoose";
import { PlanClass } from "../models/plan.model";

class FavoritesServiceResponse implements ServiceResponse {
  code: ServiceResponseCode;
  text: string;
  prop?: UserClass;

  setValues = (code: ServiceResponseCode, text: string, prop?: UserClass) => {
    this.code = code;
    this.text = text;
    this.prop = prop;
  };

  buildResponse = () => {
    return {
      text: this.text,
      userInfo: this.prop ? this.prop.getInfo() : "",
    };
  };
}

export class FavoritesListServiceResponse implements ServiceResponse {
  code: ServiceResponseCode;
  text: string;
  prop?: any;

  setValues = (code: ServiceResponseCode, text: string, prop?: PlanClass[]) => {
    this.code = code;
    this.text = text;
    this.prop = prop;
  };

  buildResponse = () => {
    return {
      text: this.text,
      planList: this.prop?.map((x) => x.getInfo()),
    };
  };

  buildResponsePlusId = () => {
    return {
      text: this.text,
      planList: this.prop?.map((x) => {
        return {
          info: x.getInfo(),
          id: x._id,
        };
      }),
    };
  };
}

export class FavoritesService {
  private planService: PlanService = new PlanService();

  isPlanAlreadyFavorite(
    user: DocumentType<UserClass>,
    planId: ObjectId
  ): boolean {
    if (user.favoritesPlan) {
      for (const plan of user.favoritesPlan) {
        if (plan?.toString() === planId.toString()) return true;
      }
    }
    return false;
  }

  async addFavoritePlan(
    user: DocumentType<UserClass>,
    planId: string
  ): Promise<FavoritesServiceResponse> {
    const response = new FavoritesServiceResponse();
    if (await this.planService.doesPlanExist(planId)) {
      const id = new ObjectId(planId);
      if (!user.favoritesPlan) user.favoritesPlan = [];

      if (!this.isPlanAlreadyFavorite(user, id)) user.favoritesPlan.push(id);
      try {
        await user.save();
        response.code = ServiceResponseCode.ok;
        response.text = "Plan with " + planId + " added to favorites";
        response.prop = user;
      } catch {
        response.code = ServiceResponseCode.internalServerError;
        response.text = "Error adding " + planId + " to favorites";
        response.prop = user;
      }
    } else {
      response.code = ServiceResponseCode.elementNotFound;
      response.text = "Plan with " + planId + " id does not exist";
    }
    return response;
  }

  async removeFavoritePlan(
    user: DocumentType<UserClass>,
    planId: string
  ): Promise<FavoritesServiceResponse> {
    const response = new FavoritesServiceResponse();
    if (await this.planService.doesPlanExist(planId)) {
      const id = new ObjectId(planId);
      if (!user.favoritesPlan || !this.isPlanAlreadyFavorite(user, id)) {
        response.code = ServiceResponseCode.elementNotFound;
        response.text =
          "Plan " + planId + " is not in favorite list or does not exist";
        response.prop = user;
      } else {
        user.favoritesPlan.forEach((plan, index) => {
          if (plan?.toString() === planId) user.favoritesPlan?.splice(index, 1);
        });
        try {
          await user.save();
          response.code = ServiceResponseCode.ok;
          response.text = "Plan with " + planId + " removed to favorites";
          response.prop = user;
        } catch {
          response.code = ServiceResponseCode.internalServerError;
          response.text = "Error removing " + planId + " to favorites";
          response.prop = user;
        }
      }
    } else {
      response.code = ServiceResponseCode.elementNotFound;
      response.text = "Plan with " + planId + " id does not exist";
    }
    return response;
  }

  async isFavoritePlan(
    user: DocumentType<UserClass>,
    planId: string
  ): Promise<FavoritesServiceResponse> {
    const response = new FavoritesServiceResponse();
    if (await this.planService.doesPlanExist(planId)) {
      const isFavorite = this.isPlanAlreadyFavorite(user, new ObjectId(planId));
      if (isFavorite) {
        response.code = ServiceResponseCode.elementAlreadyInCollection;
        response.text = "Plan " + planId + "is in favorites";
        response.prop = user;
      } else {
        response.code = ServiceResponseCode.ok;
        response.text = "Plan " + planId + "is not in favorites";
        response.prop = user;
      }
    } else {
      response.code = ServiceResponseCode.elementNotFound;
      response.text = "Plan with " + planId + " id does not exist";
    }

    return response;
  }

  async getFavoritePlansByUser(
    user: DocumentType<UserClass>
  ): Promise<FavoritesListServiceResponse> {
    const response = new FavoritesListServiceResponse();
    const planService: PlanService = new PlanService();

    if (user.favoritesPlan != undefined) {
      response.code = ServiceResponseCode.ok;
      response.text = "List of favorite plans for user " + user.username;

      response.prop = await Promise.all(
        user.favoritesPlan.map(
          async (planId) => await planService.getPlan(planId?.toString() ?? "")
        )
      );

      // if a plan which has been deleted is inside the user preferences
      // then it appears as null in the list
      response.prop = response.prop.filter((x) => x != null);
    } else {
      response.code = ServiceResponseCode.internalServerError;
      response.text =
        "User document for " +
        user.username +
        " does not have a favorite plans entry";
    }

    return response;
  }
}
