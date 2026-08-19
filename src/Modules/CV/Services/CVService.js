import CVRepository from '../Repositories/CVRepository.js';
import ICVService from '../Interfaces/ICVService.js';

class CVService extends ICVService {
    
    async getMyCVs(userId) {
        return await CVRepository.model.findAll({ 
            where: { userId, isActive: true },
            order: [['createdAt', 'DESC']]
        });
    }

    async createCV(data, userId) {
        return await CVRepository.create({
            ...data,
            userId,
            isActive: false // Admins review CVs perhaps
        });
    }

    async uploadCVFile(title, file, userId) {
        return await CVRepository.create({
            userId,
            title: title || file.originalname,
            type: 'uploaded',
            isActive: false,
            fileUrl: `/uploads/cv/${file.filename}`,
            fileName: file.originalname,
            fileSize: file.size,
            mimeType: file.mimetype
        });
    }

    async deleteCV(id, userId) {
        const cv = await CVRepository.findById(id);
        if (!cv || cv.userId !== userId) throw new Error('CV tapılmadı və ya icazəniz yoxdur');
        await cv.destroy();
        return true;
    }
}
export default new CVService();
