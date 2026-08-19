export const addJobValidator = (req, res, next) => {
    const defaultValues = { title: 0, minSalary: 0, maxSalary: 0, minAge: 0, maxAge: 0, categoryId: 0, companyName: 0, cityId: 0, educationId: 0, experienceId: 0, userName: "", email: 0, phone: 0 };
    const data = {
        title: req.body.data?.position || defaultValues.title,
        minSalary: req.body.data?.minSalary || defaultValues.minSalary,
        maxSalary: req.body.data?.maxSalary || defaultValues.maxSalary,
        minAge: req.body.data?.minAge || defaultValues.minAge,
        maxAge: req.body.data?.maxAge || defaultValues.maxAge,
        categoryId: req.body.data?.category || defaultValues.categoryId,
        companyName: req.body.data?.companyName || defaultValues.companyName,
        cityId: req.body.data?.city || defaultValues.cityId,
        educationId: req.body.data?.education || defaultValues.educationId,
        experienceId: req.body.data?.experience || defaultValues.experienceId,
        userName: req.body.data?.username || defaultValues.userName,
        email: req.body.data?.email || defaultValues.email,
        phone: req.body.data?.phone || defaultValues.phone,
    };
    if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) data.email = defaultValues.email;
    const requiredFields = ["title", "companyName", "userName", "categoryId", "cityId", "educationId", "experienceId"];
    const hasValidationError = requiredFields.some(field => !data[field]);
    const hasContactInfo = data.email || data.phone;
    if (hasValidationError || !hasContactInfo) {
        return res.status(200).json({ status: 400, message: "Validation failed. Please correct the fields.", data });
    }
    next();
};

export const promotionValidator = (req, res, next) => {
    const { planId, jobId, phone } = req.body;
    if (!planId) return res.status(400).json({ error: 'Plan ID tələb olunur' });
    if (!jobId) return res.status(400).json({ error: 'Vakansiya ID tələb olunur' });
    if (!phone || !phone.trim()) return res.status(400).json({ error: 'Telefon nömrəsi tələb olunur' });
    const cleanedPhone = phone.trim().replace(/[\s\-\(\)]/g, '');
    if (cleanedPhone.length < 7) return res.status(400).json({ error: 'Düzgün telefon nömrəsi daxil edin' });
    next();
};
