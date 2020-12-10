type Recipe = {
  name: string;
  dateModified: Date;
  estimatedCost: string;
  image: string;
  categories: string[];
  description: string;
  prepTime: Number;
  cookTime: Number;
  totalTime: Number;
  conservationTime: Number;
  peopleFor: Number;
  ingredients: Ingredient[];
  keywords: string[];
  labels: string[];
  averageRating: Number;
  numberOfRatings: Number;
  nutritionalInfos: NutritionalInfo;
  requiredTools: string[];
};
