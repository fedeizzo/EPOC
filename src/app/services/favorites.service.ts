import { ObjectId } from 'mongodb';
import { ServiceResponse, ServiceResponseCode, PlanService } from '../services';
import { UserClass } from '../models/user.model';

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

  async addFavoritePlan(user: UserClass, planId: string): Promise<FavoritesServiceResponse> {
    const response = new FavoritesServiceResponse();
    if (await this.planService.isPlanExist(planId)) {
      if (user.favoritesPlan)
        user.favoritesPlan.add(new ObjectId(planId));
      else {
        user.favoritesPlan = new Set();
        user.favoritesPlan.add(new ObjectId(planId));
      }
      response.code = ServiceResponseCode.ok;
      response.text = 'Plan with ' + planId + ' added to favorites';
      response.prop = user;
    } else {
      response.code = ServiceResponseCode.elementNotFound;
      response.text = 'Plan with ' + planId + ' id does not exist';
    }
    return response;
  }
}
