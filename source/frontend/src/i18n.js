import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { register } from "timeago.js";

i18n.use(initReactI18next).init({
    resources: {
        en: {
            translations: {
                'Sign Up': 'Sign Up',
                'Sign In': 'Sign In',
                'Login': 'Login',
                'Password mismatch': 'Password mismatch',
                'Username': 'Username',
                'Display Name': 'Display Name',
                'Password': 'Password',
                'Password Confirm': 'Password Confirm',
                'Logout': 'Logout',
                'Users': 'Users',
                'Next >': 'Next >',
                '< Previous': '< Previous',
                'Load Failure': 'Load Failure',
                'User is not found': 'User is not found',
                'Edit': 'Edit',
                'Save': 'Save',
                'Cancel': 'Cancel',
                'Change Display Name': 'Change Display Name',
                'My Profile': 'My Profile',
                'There are no hoaxes': 'There are no hoaxes',
                'Load old hoaxes': 'Load old hoaxes',
                'There are new Hoaxes': 'There are new Hoaxes',
                'Delete Hoax': 'Delete Hoax',
                'Are you sure to delete hoax?': 'Are you sure to delete hoax?',
                'Delete My Account': 'Delete My Account',
                'Are you sure to delete your account?': 'Are you sure to delete your account?',
            }
        },
        tr: {
            translations: {
                'Sign Up': 'Kayıt Ol',
                'Sign In': 'Giriş',
                'Login': 'Giriş Yap',
                'Password mismatch': 'Parolayı aynı giriniz.',
                'Username': 'Kullanıcı Adı',
                'Display Name': 'Tercih edilen isim',
                'Password': 'Parola',
                'Password Confirm': 'Parolayı tekrarla',
                'Logout': 'Çıkış',
                'Users': 'Kullanıcılar',
                'Next >': 'İleri >',
                '< Previous': '< Geri',
                'Load Failure': 'Liste alınamadı',
                'User is not found': 'Kullanıcı Bulunamadı',
                'Edit': 'Düzenle',
                'Save': 'Kaydet',
                'Cancel': 'İptal',
                'Change Display Name': 'Görünen isminizi değiştirin',
                'My Profile': 'Profilim',
                'There are no hoaxes': 'Hoax bulunamadı',
                'Load old hoaxes': 'Geçmiş Hoaxları getir',
                'There are new Hoaxes': 'Yeni Hoaxlar var',
                'Delete Hoax': `Hoax'u sil`,
                'Are you sure to delete hoax?': `Hoax'u silmek istediğinizden emin misiniz?`,
                'Delete My Account': 'Hesabımı sil',
                'Are you sure to delete your account?': 'Hesabınızı silmek istediğinizden emin misiniz?'
            }
        }
    },
    fallbackLng: 'en',
    ns: ['translations'],
    defaultNS: 'translations',
    keySeparator: false,
    interpolation: {
        escapeValue: false,
        formatSeparator: ','
    },
    react: {
        wait: true
    }
});

const timeagoTR = (number, index) => {
    return [
        ['az önce', 'şimdi'],
        ['%s saniye önce', '%s saniye içinde'],
        ['1 dakika önce', '1 dakika içinde'],
        ['%s dakika önce', '%s dakika içinde'],
        ['1 saat önce', '1 saat içinde'],
        ['%s saat önce', '%s saat içinde'],
        ['1 gün önce', '1 gün içinde'],
        ['%s gün önce', '%s gün içinde'],
        ['1 hafta önce', '1 hafta içinde'],
        ['%s hafta önce', '%s hafta içinde'],
        ['1 ay önce', '1 ay içinde'],
        ['%s ay önce', '%s ay içinde'],
        ['1 yıl önce', '1 yıl içinde'],
        ['%s yıl önce', '%s yıl içinde'],
    ][index];
}
register('tr', timeagoTR);

export default i18n;