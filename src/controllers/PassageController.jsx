import PassageModel from '../models/PassageModel';

class PassageController {
  constructor() {
    this.passages = [
      new PassageModel('Week 1', 85, 90, 78, 85, 92, 88),
      new PassageModel('Week 2', 88, 91, 80, 87, 94, 89),
      new PassageModel('Week 3', 0, 0, 0, 0, 0, 0),
    ];
  }

  getPassageData() {
    return this.passages;
  }
}

export default PassageController;