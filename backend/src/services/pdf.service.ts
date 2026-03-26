import { AppDataSource } from '../data-source';
import { Interview } from '../entities/Interview';
import PDFDocument from 'pdfkit';

export class PDFService {
  async generateRecommendationsPDF(userId: string, interviewId: string): Promise<Buffer> {
    const interviewRepository = AppDataSource.getRepository(Interview);
    
    const interview = await interviewRepository.findOne({
      where: { id: interviewId, userId },
      relations: ['user', 'userAnswers', 'userAnswers.question', 'userAnswers.question.subject', 'position']
    });
    
    if (!interview) {
      throw new Error('Интервью не найдено');
    }
    
    return new Promise((resolve) => {
      const doc = new PDFDocument();
      const chunks: Buffer[] = [];
      
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      
      // Заголовок
      doc.fontSize(24).text('Результаты технической проверки', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text('Система автоматической оценки компетенций AI Tech Checker', { align: 'center' });
      doc.moveDown(2);
      
      // Информация о кандидате
      doc.fontSize(16).text('Информация о кандидате', { underline: true });
      doc.moveDown();
      doc.fontSize(10);
      doc.text(`Имя: ${interview.user.name}`);
      doc.text(`Логин: ${interview.user.login}`);
      doc.text(`Уровень: ${interview.user.grade || 'Не указан'}`);
      if (interview.position) {
        doc.text(`Позиция: ${interview.position.title}`);
      }
      doc.text(`Дата проверки: ${new Date(interview.completedAt || interview.startedAt).toLocaleString('ru-RU')}`);
      doc.moveDown();
      
      // Общий результат
      doc.fontSize(16).text('Общий результат', { underline: true });
      doc.moveDown();
      doc.fontSize(36).text(`${Math.round(interview.score || 0)}%`, { align: 'center' });
      doc.moveDown();
      
      // Рекомендации
      if (interview.recommendations && interview.recommendations.length > 0) {
        doc.fontSize(16).text('Рекомендации по развитию', { underline: true });
        doc.moveDown();
        interview.recommendations.forEach((rec: string) => {
          doc.fontSize(10).text(`• ${rec}`);
        });
        doc.moveDown();
      }
      
      // Завершаем документ
      doc.end();
    });
  }
}