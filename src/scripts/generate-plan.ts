// 3p
import { Config } from '@foal/core';
import { connect, disconnect } from 'mongoose';
import { PlanService } from "../app/services";
import { CostLevels } from "../app/models/recipe.model"

export async function main(args: any) {
  // const uri = Config.getOrThrow('mongodb.uri', 'string');
  // await connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
  // const planService = new PlanService();
  // console.log('il tuo piano generico e', await planService.generateAndSavePlan('name1',2));
  // console.log('il tuo piano da povero e', await planService.generateAndSavePlan('name2',2, CostLevels.low));
  // console.log('il tuo piano da molto ricco e', await planService.generateAndSavePlan('name3',2, CostLevels.veryHigh));
  // await disconnect();
}
