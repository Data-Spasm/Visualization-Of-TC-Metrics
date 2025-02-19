import ReadingAssessmentModel from '../models/ReadingAssessmentModel';

class ReadingAssessmentController {
  constructor() {
    this.model = new ReadingAssessmentModel();
  }

  getPassageData() {
    return this.model.getPassages();
  }
}

export default ReadingAssessmentController;
