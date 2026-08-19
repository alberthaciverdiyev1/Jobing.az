import validator from 'validator';

export const registerValidator = (req, res, next) => {
    const { name, surname, email, password, role, companyName } = req.body;
    if (!name) return res.status(400).json({ error: "Ad tələb olunur" });
    if (!validator.isLength(name, { min: 2, max: 50 })) return res.status(400).json({ error: "Ad 2-50 simvol olmalıdır" });
    if (!surname) return res.status(400).json({ error: "Soyad tələb olunur" });
    if (!validator.isLength(surname, { min: 2, max: 50 })) return res.status(400).json({ error: "Soyad 2-50 simvol olmalıdır" });
    if (!email) return res.status(400).json({ error: "Email tələb olunur" });
    if (!validator.isEmail(email)) return res.status(400).json({ error: "Düzgün email daxil edin" });
    if (!password) return res.status(400).json({ error: "Şifrə tələb olunur" });
    if (!validator.isLength(password, { min: 6 })) return res.status(400).json({ error: "Şifrə ən az 6 simvol olmalıdır" });
    if (role === 'company' && !companyName) return res.status(400).json({ error: "Şirkət adı tələb olunur" });
    if (role && !['user', 'company'].includes(role)) return res.status(400).json({ error: "Yanlış rol" });
    next();
};

export const loginValidator = (req, res, next) => {
    const { email, password } = req.body;
    if (!email) return res.status(400).json({ error: "Email tələb olunur" });
    if (!validator.isEmail(email)) return res.status(400).json({ error: "Düzgün email daxil edin" });
    if (!password) return res.status(400).json({ error: "Şifrə tələb olunur" });
    next();
};
