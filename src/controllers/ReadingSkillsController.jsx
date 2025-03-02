import { ReadingSkills } from '../models/ReadingSkillsModel';

export class ReadingSkillsController {
  constructor() {
    this.readingSkills = [];
  }

  addReadingSkills(skillsData) {
    const readingSkills = new ReadingSkills(
      skillsData.phonemicAwareness,
      skillsData.phonics,
      skillsData.fluency
    );

    this.readingSkills.push(readingSkills);
  }

  getReadingSkillsById(id) {
    return this.readingSkills.find(skills => skills.id === id);
  }

  getAllReadingSkills() {
    return this.readingSkills;
  }
}