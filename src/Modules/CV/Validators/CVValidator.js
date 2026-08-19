export const addJobSeekerValidator = (req, res, next) => {
    const defaultValues = { title: '', userName: '', email: '', phone: '', categoryId: 0, cityId: 0, educationId: 0, experienceId: 0, aboutJob: '' };
    const data = {
        title: req.body.position || defaultValues.title,
        userName: req.body.username || defaultValues.userName,
        email: req.body.email || defaultValues.email,
        phone: req.body.phone || defaultValues.phone,
        categoryId: req.body.category || defaultValues.categoryId,
        cityId: req.body.city || defaultValues.cityId,
        educationId: req.body.education || defaultValues.educationId,
        experienceId: req.body.experience || defaultValues.experienceId,
        aboutJob: req.body.aboutJob || defaultValues.aboutJob,
    };
    if (!data.title || data.title.length < 3) return res.status(400).json({ error: 'Vəzifə adı ən az 3 simvol olmalıdır' });
    if (!data.userName) return res.status(400).json({ error: 'Ad tələb olunur' });
    if (!data.email && !data.phone) return res.status(400).json({ error: 'Email və ya telefon nömrəsi tələb olunur' });
    if (data.email && !/^\S+@\S+\.\S+$/.test(data.email)) return res.status(400).json({ error: 'Düzgün email daxil edin' });
    if (!data.categoryId) return res.status(400).json({ error: 'Kateqoriya seçimi tələb olunur' });
    if (!data.cityId) return res.status(400).json({ error: 'Şəhər seçimi tələb olunur' });
    if (!data.aboutJob || data.aboutJob.replace(/<[^>]*>/g, '').trim().length < 10) return res.status(400).json({ error: 'Özünüz haqqında məlumat ən az 10 simvol olmalıdır' });
    next();
};
