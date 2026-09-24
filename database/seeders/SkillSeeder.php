<?php

namespace Database\Seeders;

use App\Modules\Category\Models\Category;
use App\Modules\JobAttribute\Models\Skill;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

/**
 * Her kategori (ve alt kategori) için 20-30 ilgili beceri oluşturur.
 * slug benzersiz olduğu için slug'a kategori id'si eklenir.
 */
class SkillSeeder extends Seeder
{
    public function run(): void
    {
        $domain = [
            'finans-ve-muhasebe' => ['1C', 'SAP FI', 'Excel', 'Finansal Raporlama', 'Bütçeleme', 'Operasyon Analizi', 'Vergi Raporlaması', 'Denetim', 'IFRS', 'Banka İşlemleri', 'Kredi Analizi', 'Risk Yönetimi', 'Muhasebe Programları', 'Nakit Akışı', 'Faturalama', 'Bordro', 'Finansal Tahminleme', 'Maliyet Muhasebesi', 'Dijital Bankacılık', 'Denetim Sistemi', 'Beyanname', 'Konsolidasyon', 'ERP', 'Veri Analizi', 'Bloomberg'],
            'bilisim-teknolojileri-it' => ['PHP', 'Laravel', 'JavaScript', 'React', 'Vue.js', 'Node.js', 'Python', 'SQL', 'PostgreSQL', 'MySQL', 'Redis', 'Docker', 'Kubernetes', 'Git', 'REST API', 'GraphQL', 'CI/CD', 'AWS', 'Linux', 'TypeScript', 'Tailwind CSS', 'Microservices', 'Bash', 'Agile'],
            'satis-ve-musteri-hizmetleri' => ['CRM', 'Satış Stratejisi', 'Müşteri Hizmetleri', 'Ulaşım', 'Telefonla Satış', 'Kasa', 'B2B Satış', 'B2C Satış', 'Müzakere', 'Müşteri Memnuniyeti', 'Salesforce', 'Potansiyel Müşteri Bulma', 'Üst Satış', 'KPI Yönetimi', 'Nakit Yönetimi', 'Kasa İşlemleri', 'Müşteri Kabulü', 'Şikayet Yönetimi', 'Hedef Yönetimi', 'Perakende', 'Mağaza Düzenleme', 'Envanter', 'POS Sistemi', 'Çapraz Satış'],
            'tasarim-ve-kreatif-sanatlar' => ['Figma', 'Adobe Photoshop', 'Adobe Illustrator', 'UI/UX', 'Prototipleme', 'Wireframe', 'Tasarım Sistemi', 'Adobe XD', 'Sketch', 'After Effects', 'Premiere Pro', 'Hareket Tasarımı', '3D Modelleme', 'Blender', 'Tipografi', 'Marka Tasarımı', 'Illustrator', 'InDesign', 'Kullanıcı Araştırması', 'Etkileşim Tasarımı', 'Duyarlı Tasarım', 'Renk Teorisi', 'İkonografi', 'Web Tasarımı', 'Baskı Tasarımı'],
            'hukuk-ve-yargi' => ['Sözleşme Hukuku', 'İş Hukuku', 'Şirketler Hukuku', 'Vergi Hukuku', 'Dava İşleri', 'Hukuki İnceleme', 'Durum Tespiti', 'Uyum', 'Fikri Mülkiyet Hukuku', 'Hukuki Dokümantasyon', 'Dava Takibi', 'Birleşme ve Devralma', 'Veri Gizliliği', 'GDPR', 'Hukuk Araştırması', 'Noterlik', 'Ceza Hukuku', 'Medeni Hukuk', 'İdare Hukuku', 'Uluslararası Hukuk', 'Tahkim', 'Hukuki Danışmanlık', 'Mevzuat', 'Sözleşme Hazırlama', 'Hukuki Yazım'],
            'idari-kadro-ve-ik' => ['Microsoft Office', 'Excel', 'Evrak Akışı', 'Ofis Yönetimi', 'Toplantı Planlama', 'Zaman Yönetimi', 'Telefon Görgü Kuralları', 'Veri Girişi', 'Arşiv', 'Kargo Gönderimi', 'Takvim Yönetimi', 'Rapor Hazırlama', 'İş Planlama', 'Sekreterlik', 'Protokol', 'Envanter', 'Sipariş Yönetimi', 'Çoklu Görev', 'İletişim', 'Problem Çözme', 'Detaylara Dikkat', 'Organizasyon Becerileri', 'CRM', 'E-posta Yönetimi', 'Koordinasyon'],
            'tarim-ve-cevre' => ['Agronomi', 'Bitkisel Üretim', 'Toprak Analizi', 'Sulama Sistemleri', 'Pestisit Yönetimi', 'Hayvancılık', 'Tarım Makineleri', 'Çiftlik İşletmesi', 'Gıda Güvenliği', 'İhracat Lojistiği', 'Sera Yetiştiriciliği', 'Organik Tarım', 'Ürün Planlama', 'Sertifikasyon', 'Veterinerlik', 'Traktör', 'Agroekoloji', 'İklim Koşulları', 'Markalaşma', 'Kooperatifler', 'Su Kaynakları', 'Toprak Becerileri', 'Sera', 'Tahıl Üretimi', 'Bahçecilik'],
            'hizmet-personeli' => ['Temizlik', 'Müşteri Karşılama', 'Ofis Hizmeti', 'Kasiyer', 'Barista', 'Restoran Servisi', 'Otel Hizmeti', 'Hijyen Standartları', 'Dil Becerileri', 'Fiziksel Dayanıklılık', 'Güler Yüzlü Hizmet', 'İletişim', 'Zaman Yönetimi', 'Takım Çalışması', 'Detaylara Dikkat', 'Problem Çözme', 'İş Güvenliği', 'Envanter', 'Sipariş Alma', 'Masa Düzeni', 'Kat Hizmetleri', 'Konsiyerj', 'Resepsiyon', 'Müşteri Bakımı', 'Hızlı Uyum'],
            'tip-ve-eczacilik' => ['Tıbbi Beceriler', 'Hasta Bakımı', 'Tıbbi Malzeme', 'Acil Yardım', 'Onkoloji', 'Kardiyoloji', 'Nöroloji', 'Pediatri', 'Sterilizasyon', 'Enfeksiyon Kontrolü', 'Tıbbi Dokümantasyon', 'Farmakoloji', 'Laboratuvar', 'Hemşirelik', 'Teşhis', 'Radyoloji', 'Cerrahi', 'Fizyoterapi', 'Tıbbi Cihazlar', 'Aşılama', 'Sağlık Bilinci', 'İlk Yardım', 'İlaç Satışı', 'İlaç Hazırlama', 'Klinik Araştırma'],
            'cesitli-genel' => ['Uyum', 'Takım Çalışması', 'İletişim', 'Problem Çözme', 'Eleştirel Düşünme', 'Zaman Yönetimi', 'Microsoft Office', 'Liderlik', 'Başvuru Yönetimi', 'Öz Motivasyon', 'Hızlı Öğrenme', 'Çoklu Görev', 'Detaylara Dikkat', 'Mantıksal Düşünme', 'Raporlama', 'Veri Girişi', 'Müşteri Odaklılık', 'Müzakere', 'Planlama', 'Koordinasyon', 'Araştırma', 'Analiz', 'Esneklik', 'Etik Davranış', 'Stres Yönetimi'],
            'egitim-ve-bilim' => ['Ders Tasarımı', 'Öğretim Yöntemleri', 'Eğiticilik', 'Bilimsel Araştırma', 'İstatistik', 'Pedagoji', 'Mentorluk', 'Seminer Yönetimi', 'Öğrenci Değerlendirme', 'Microsoft Teams', 'Çevrimiçi Eğitim', 'Müfredat Geliştirme', 'İngilizce', 'Bilimsel Yazım', 'Laboratuvar Çalışmaları', 'Eğitim Teknolojileri', 'Sınıf Yönetimi', 'Üniversite Süreçleri', 'GIS', 'Veri Toplama', 'Atıf', 'Akademik Yazım', 'Bilimsel Yöntem', 'Seminerler', 'Sunum Becerisi'],
            'spor-salonlari-fitness-ve-guzellik-merkezleri' => ['Saç Kesimi', 'Boya', 'Manikür', 'Pedikür', 'Masaj', 'Fitness Eğitimi', 'Kardiyo', 'Pilates', 'Yoga', 'Kişisel Antrenör', 'Hijyen', 'Müşteri Bakımı', 'Makyaj', 'Kozmetoloji', 'Cihaz Kullanımı', 'Spa Hizmetleri', 'Spor Ekipmanları', 'Beslenme', 'Sertifikasyon', 'Anatomi', 'Güvenlik', 'Hızlı Hizmet', 'Nail Art', 'Epilasyon', 'Salon Yönetimi'],
            'ulastirma-tasimacilik-ve-lojistik' => ['Lojistik', 'Gümrük İşlemleri', 'İthalat-İhracat', 'Sermaye Yönetimi', 'Lojistik Yazılımı', 'Forklift', 'Sürücülük', 'B1/D Ehliyeti', 'WMS', 'Rota Planlama', 'Envanter', 'Depo Yönetimi', 'Tedarik Zinciri', 'Faturalama', 'Kargo', 'Sevkiyat Belgeleri', 'Uluslararası Taşımacılık', 'Terminal Operasyonları', 'Incoterms', 'Taşıma Güvenliği', 'Yakıt Yönetimi', 'GPS Navigasyon', 'Sevkiyat Planlama', 'Yükleme', 'Paketleme'],
            'sanayi-insaat-ve-imalat' => ['İnşaat Mühendisliği', 'AutoCAD', 'BIM', 'İnşaat Projelendirme', 'İş Güvenliği Tekniği', 'Kaynak', 'Elektrik İşleri', 'Sıhhi Tesisat', 'Beton İşleri', 'Metal İşleri', 'Üretim', 'Kalite Kontrol', 'Yalın Üretim', '5S', 'CNC', 'Torna', 'Freze', 'Vinç Operatörlüğü', 'Malzeme Bilgisi', 'Metraj', 'Yerleşim Planı', 'Yerleşim Tasarımı', 'İş Güvenliği', 'Hidrolik Sistemler', 'Pnömatik Sistemler', 'Bakım'],
            'pazarlama-reklam-ve-pr' => ['SEO', 'Google Ads', 'Meta Ads', 'Google Analytics', 'İçerik Pazarlama', 'Sosyal Medya Yönetimi', 'E-posta Pazarlama', 'Metin Yazarlığı', 'Halkla İlişkiler', 'Medya Planlama', 'Marka Yönetimi', 'Canva', 'Adobe Premiere', 'TikTok Ads', 'LinkedIn Ads', 'Kampanya Yönetimi', 'A/B Testi', 'Pazar Araştırması', 'Analitik', 'Influencer Pazarlama', 'Açılış Sayfası', 'CRM', 'KPI', 'Potansiyel Müşteri Bulma', 'Etkinlik Yönetimi'],
            'turizm-otelcilik-ve-restoran-horeca' => ['Resepsiyon', 'Otel Yönetimi', 'Restoran Servisi', 'Aşçılık', 'Barista', 'Somelye', 'Rezervasyon', 'Misafir İlişkileri', 'Kat Hizmetleri', 'Gıda Güvenliği', 'HACCP', 'Tur Operatörlüğü', 'Barmen', 'Garson', 'Tur Rehberliği', 'Rezervasyon Sistemleri', 'Seyahat Planlama', 'Etkinlik İkramı', 'Menü Tasarımı', 'Envanter', 'POS', 'Müşteri Bakımı', 'İngilizce', 'Çoklu Görev', 'Oda Temizliği'],
            'satinalma-ve-tedarik-zinciri' => ['Satın Alma', 'Tedarik Zinciri', 'Tedarikçi Yönetimi', 'Müzakere', 'Sözleşme Yönetimi', 'İhale', 'Satın Alma Yazılımı', 'Depo', 'Envanter Sayımı', 'Maliyet Analizi', 'İthalat', 'Lojistik', 'Bütçe Kontrolü', 'Tedarikçi Denetimi', 'Sipariş Yönetimi', 'SAP MM', 'Excel', 'Pazar Analizi', 'Incoterms', 'Sevkiyat', 'Kalite Kontrol', 'KPI', 'Raporlama', 'Tahminleme', 'E-satın Alma'],
        ];

        $parents = Category::whereNull('parent_id')->get();
        $created = 0;

        foreach ($parents as $parent) {
            $skills = $domain[$parent->slug] ?? ($domain['cesitli-genel'] ?? []);
            if (empty($skills)) {
                continue;
            }

            // Ana kateqoriya + bütün alt kateqoriyalar
            $categories = collect([$parent])->merge($parent->children ?? Category::where('parent_id', $parent->id)->get());

            foreach ($categories as $cat) {
                foreach (array_values($skills) as $i => $skill) {
                    Skill::updateOrCreate(
                        ['slug' => Str::slug($skill).'-'.$cat->id],
                        [
                            'category_id' => $cat->id,
                            'name' => ['tr' => $skill],
                            'order' => $i,
                            'is_active' => true,
                        ]
                    );
                    $created++;
                }
            }
        }

        $total = Skill::count();
        $this->command?->info("SkillSeeder: {$total} beceri (kategori başına 20-30).");
    }
}
