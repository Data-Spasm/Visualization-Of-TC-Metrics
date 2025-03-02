class ReadingAssessmentModel {
    constructor() {
      this.passages = [
        { number: 5, passagesPlayed: 10, passagesFinished: 8 },
        { number: 10, passagesPlayed: 15, passagesFinished: 12 },
        { number: 20, passagesPlayed: 20, passagesFinished: 15 },
        { number: 30, passagesPlayed: 25, passagesFinished: 18 },
        { number: 40, passagesPlayed: 30, passagesFinished: 22 },
      ];
    }
  
    getPassages() {
      return this.passages;
    }
  }
  
  export default ReadingAssessmentModel;
  