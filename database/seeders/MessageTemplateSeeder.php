<?php

namespace Database\Seeders;

use App\Modules\Company\Models\MessageTemplate;
use Illuminate\Database\Seeder;

class MessageTemplateSeeder extends Seeder
{
    public function run(): void
    {
        if (MessageTemplate::whereNull('company_id')->exists()) {
            return;
        }

        MessageTemplate::create([
            'company_id' => null,
            'type' => 'rejected',
            'title' => [
                'az' => 'CV İmtina (İmtina Məktubu)',
                'en' => 'Application Rejection Letter',
                'tr' => 'Başvuru Reddedilme Mektubu',
                'ru' => 'Письмо об отказе по вакансии',
            ],
            'content' => [
                'az' => "Hörmətli {applicant_name},\n\n'{vacancy_title}' vakansiyası üzrə göndərdiyiniz müraciət üçün təşəkkür edirik. CV-nizi diqqətlə nəzərdən keçirdik, lakin təəssüf ki, hazırda təcrübənizin vakansiyanın tələblərinə tam uyğun gəlmədiyini bildiririk.\n\nGələcək karyeranızda uğurlar arzulayırıq!\n\nHörmətlə,\n{company_name}",
                'en' => "Dear {applicant_name},\n\nThank you for applying for the position of '{vacancy_title}'. We reviewed your application carefully, but unfortunately, we have decided to proceed with candidates whose skills more closely match our current requirements.\n\nWe wish you all the best in your career search.\n\nBest regards,\n{company_name}",
                'tr' => "Sayın {applicant_name},\n\n'{vacancy_title}' pozisyonuna gösterdiğiniz ilgi ve başvuru için teşekkür ederiz. Özgeçmişiniz titizlikle incelenmiş olup, mevcut gereksinimlerimize daha yakın adaylarla devam etme kararı aldığımızı üzüntüyle bildiririz.\n\nKariyerinizde başarılar dileriz.\n\nSaygılarımızla,\n{company_name}",
                'ru' => "Уважаемый(ая) {applicant_name},\n\nБлагодарим вас за отклик на вакансию '{vacancy_title}'. Мы внимательно изучили ваше резюме, но, к сожалению, в настоящий момент не готовы пригласить вас на следующий этап.\n\nЖелаем успехов в поиске работы.\n\nС уважением,\n{company_name}",
            ],
            'is_active' => true,
        ]);

        MessageTemplate::create([
            'company_id' => null,
            'type' => 'interview',
            'title' => [
                'az' => 'Müsahibə Dəvəti Məktubu',
                'en' => 'Interview Invitation Letter',
                'tr' => 'Mülakat Davet Mektubu',
                'ru' => 'Приглашение на собеседование',
            ],
            'content' => [
                'az' => "Hörmətli {applicant_name},\n\n'{vacancy_title}' vakansiyası üzrə təqdim etdiyiniz CV bizi çox maraqlandırdı! Sizi ilkin müsahibə mərhələsinə dəvət etməkdən məmnunluq duyuruq.\n\nMüsahibə vaxtını təyin etmək üçün tezliklə sizinlə əlaqə saxlayacağıq.\n\nHörmətlə,\n{company_name}",
                'en' => "Dear {applicant_name},\n\nThank you for applying to '{vacancy_title}'. We were impressed by your background and would like to invite you for an interview.\n\nOur team will reach out to you shortly to schedule a convenient time.\n\nBest regards,\n{company_name}",
                'tr' => "Sayın {applicant_name},\n\n'{vacancy_title}' pozisyonuna yaptığınız başvuru ilgimizi çekti! Sizi mülakat sürecimize davet etmekten mutluluk duyarız.\n\nUygun zamanı belirlemek için sizinle kısa süre içinde iletişime geçeceğiz.\n\nSaygılarımızla,\n{company_name}",
                'ru' => "Уважаемый(ая) {applicant_name},\n\nСпасибо за отклик на вакансию '{vacancy_title}'. Ваше резюме произвело на нас хорошее впечатление, и мы рады пригласить вас на собеседование.\n\nМы свяжемся с вами в ближайшее время для согласования времени.\n\nС уважением,\n{company_name}",
            ],
            'is_active' => true,
        ]);

        MessageTemplate::create([
            'company_id' => null,
            'type' => 'accepted',
            'title' => [
                'az' => 'İş Təklifi (Offer Letter)',
                'en' => 'Job Offer Letter',
                'tr' => 'İş Teklifi Mektubu',
                'ru' => 'Предложение о работе (Job Offer)',
            ],
            'content' => [
                'az' => "Hörmətli {applicant_name},\n\n'{vacancy_title}' vəzifəsi üzrə müsahibə mərhələlərini uğurla başa vurduğunuz üçün sizi təbrik edirik! Şirkətimiz sizə iş təklifi etməkdən şaddır.\n\nTəfərrüatlı iş təklifi sənədini təqdim etmək üçün sizinlə əlaqə saxlayacağıq.\n\nHörmətlə,\n{company_name}",
                'en' => "Dear {applicant_name},\n\nCongratulations on successfully completing the interview process for '{vacancy_title}'! We are thrilled to offer you the position at our company.\n\nWe will get in touch with you shortly to finalize the details.\n\nBest regards,\n{company_name}",
                'tr' => "Sayın {applicant_name},\n\n'{vacancy_title}' pozisyonu için mülakat süreçlerini başarıyla tamamladığınız için tebrik ederiz! Şirketimiz bünyesinde size iş teklif etmekten mutluluk duyuyoruz.\n\nDetayları paylaşmak üzere sizinle iletişime geçeceğiz.\n\nSaygılarımızla,\n{company_name}",
                'ru' => "Уважаемый(ая) {applicant_name},\n\nПоздравляем с успешным прохождением собеседований на позицию '{vacancy_title}'! Мы рады предложить вам работу в нашей компании.\n\nВ ближайшее время мы свяжемся с вами для уточнения деталей.\n\nС уважением,\n{company_name}",
            ],
            'is_active' => true,
        ]);
    }
}
