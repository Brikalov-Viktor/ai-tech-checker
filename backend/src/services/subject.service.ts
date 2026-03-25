import { AppDataSource } from '../data-source';
import { Subject } from '../entities/Subject';
import { CreateSubjectDto, UpdateSubjectDto } from '../dtos/subject.dto';

export class SubjectService {
  private subjectRepository = AppDataSource.getRepository(Subject);

  async getAllSubjects() {
    const subjects = await this.subjectRepository.find({
      relations: ['questions'],
      order: { name: 'ASC' }
    });
    return subjects;
  }

  async getSubjectById(id: number) {
    const subject = await this.subjectRepository.findOne({
      where: { id },
      relations: ['questions']
    });

    if (!subject) {
      throw new Error('Тема не найдена');
    }

    return subject;
  }

  async createSubject(data: CreateSubjectDto) {
    // Проверяем, существует ли тема с таким именем
    const existingSubject = await this.subjectRepository.findOne({
      where: { name: data.name }
    });

    if (existingSubject) {
      throw new Error('Тема с таким названием уже существует');
    }

    const subject = this.subjectRepository.create(data);
    await this.subjectRepository.save(subject);
    return subject;
  }

  async updateSubject(id: number, data: UpdateSubjectDto) {
    const subject = await this.getSubjectById(id);

    // Если меняется имя, проверяем уникальность
    if (data.name && data.name !== subject.name) {
      const existingSubject = await this.subjectRepository.findOne({
        where: { name: data.name }
      });
      if (existingSubject) {
        throw new Error('Тема с таким названием уже существует');
      }
    }

    Object.assign(subject, data);
    await this.subjectRepository.save(subject);
    return subject;
  }

  async deleteSubject(id: number) {
    const subject = await this.getSubjectById(id);
    
    // Проверяем, есть ли вопросы у этой темы
    if (subject.questions && subject.questions.length > 0) {
      throw new Error('Нельзя удалить тему, у которой есть вопросы');
    }

    await this.subjectRepository.remove(subject);
    return { message: 'Тема успешно удалена' };
  }
}