import { ObjectId } from 'mongodb';
import { ServiceResponse, ServiceResponseCode, PlanService } from '../services';
import { UserClass } from '../models/user.model';
import { DocumentType } from "@typegoose/typegoose";

class FavoritesServiceResponse implements ServiceResponse {
  code: ServiceResponseCode;
  text: string;
  prop?: UserClass;

  setValues = (code: ServiceResponseCode, text: string, prop?: UserClass) => {
    this.code = code;
    this.text = text;
    this.prop = prop;
  }

  buildResponse = () => {
    return {
      text: this.text,
      userInfo: this.prop ? this.prop.getInfo() : ""
    }
  }
}

export class FavoritesService {
  private planService: PlanService = new PlanService();

  isPlanAlreadyFavorite(user: DocumentType<UserClass>, planId: ObjectId): boolean {
    if (user.favoritesPlan) {
      for (const plan of user.favoritesPlan) {
        if (plan?.toString() === planId.toString())
          return true;
      }
    }
    return false;
  }

  async addFavoritePlan(user: DocumentType<UserClass>, planId: string): Promise<FavoritesServiceResponse> {
    const response = new FavoritesServiceResponse();
    if (await this.planService.isPlanExist(planId)) {
      const id = new ObjectId(planId);
      if (!user.favoritesPlan)
        user.favoritesPlan = [];

      if (!this.isPlanAlreadyFavorite(user, id))
        user.favoritesPlan.push(id);
      try {
        await user.save();
        response.code = ServiceResponseCode.ok;
        response.text = 'Plan with ' + planId + ' added to favorites';
        response.prop = user;
      } catch {
        response.code = ServiceResponseCode.internalServerError;
        response.text = 'Error adding ' + planId + ' to favorites';
        response.prop = user;
      }
    } else {
      response.code = ServiceResponseCode.elementNotFound;
      response.text = 'Plan with ' + planId + ' id does not exist';
    }
    return response;
  }

  async isFavoritePlan(user: DocumentType<UserClass>, planId: string): Promise<FavoritesServiceResponse> {
    const response = new FavoritesServiceResponse();
    if (await this.planService.isPlanExist(planId)) {
      const isFavorite = this.isPlanAlreadyFavorite(user, new ObjectId(planId));
      if (isFavorite) {
        response.code = ServiceResponseCode.elementAlreadyInCollection;
        response.text = 'Plan ' + planId + 'is in favorites';
        response.prop = user;
      } else {
        response.code = ServiceResponseCode.ok;
        response.text = 'Plan ' + planId + 'is not in favorites';
        response.prop = user;
      }
    } else {
      response.code = ServiceResponseCode.elementNotFound;
      response.text = 'Plan with ' + planId + ' id does not exist';
    }

    return response;
  }
}
