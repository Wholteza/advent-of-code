
export class Elf {
  private itemsContentInCalories: number[];
  constructor() {
    this.itemsContentInCalories = [];
  }
  public addCalories =  (calories: number) => {
    this.itemsContentInCalories.push(calories)
  }
  public getTotalCalories = (): number =>{
    return this.itemsContentInCalories.reduce((totalCalories, caloriesToAdd) => {
      totalCalories += caloriesToAdd;
      return totalCalories;
    }, 0);
  };
}
