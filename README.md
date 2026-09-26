# Converter Neo – GitHub Pages ile ücretsiz yayın

## 1) Apps Script'i güncelle (TCMB kurları için)
1. Mevcut Apps Script projende `Code.gs` içeriğini `apps-script/Code.gs` ile değiştir.
2. **Dağıt → Yeni dağıtım → Web uygulaması** · Yürüt: *Ben* · Erişim: *Herkes* → Dağıt.
3. Verilen `https://script.google.com/macros/s/.../exec` linkini kopyala.
4. `index.html` içinde `const API_URL = "..."` satırına yapıştır.

## 2) GitHub Pages'e yükle
1. github.com'da ücretsiz hesap aç → **New repository** → ad: `converter-neo` → **Public** → Create.
2. **Add file → Upload files** → bu klasördeki her şeyi sürükle (`index.html`, `manifest.webmanifest`, `sw.js`, `icons/` klasörü). `apps-script/` ve `README.md` yüklenmese de olur.
3. **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main` / `(root)` → Save.
4. 1–2 dk sonra adres: `https://KULLANICIADIN.github.io/converter-neo/`

## 3) Telefona uygulama olarak ekle
- **iPhone (Safari):** Paylaş → *Ana Ekrana Ekle*.
- **Android (Chrome):** ⋮ → *Uygulamayı yükle* / *Ana ekrana ekle*.

Ana ekrandan açınca adres çubuğu olmadan, tam ekran açılır; internet yokken de son kurlarla çalışır.

## Kurları değiştirme
- İlk açılışta USD, EUR, TRY, GBP, CNY gelir.
- Bir satırın **bayrak/kod** kısmına (▾) dokun → listeden yeni kuru seç. Seçimin telefonda kalır.
- Seçtiğin kur zaten listedeyse iki satır yer değiştirir.
- Listenin altındaki **Varsayılan kurlara dön** ile ilk 5 kura dönülür.

## TCMB kontrolü
Apps Script linkinin sonuna `?format=json` ekleyip tarayıcıda aç. `"source":"TCMB"` görüyorsan tamam.
Uygulamada sağ üstte **TCMB 26.09.2026** gibi yazar; **Yedek kaynak** yazıyorsa TCMB'ye ulaşılamamıştır.

## Kendi logonu kullanmak istersen
`icons/` içindeki PNG'leri aynı adlarla ve aynı boyutlarla (180, 192, 512, 32 px) değiştir.

## Sonradan değişiklik yaparsan
`sw.js` içindeki `converter-neo-v1` → `v2` yap; telefonlar yeni sürümü alsın.
