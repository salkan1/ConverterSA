/**
 * Converter Neo – kur servisi (Google Apps Script)
 *
 * Uygulama bu adresi ?format=json ile çağırır. TCMB'nin yayımladığı TÜM kurları
 * "1 USD = ? birim" şeklinde döndürür, böylece uygulamada istediğin kuru seçebilirsin.
 * Parametresiz açılırsa eski sürümdeki gibi Index.html sayfasını gösterir.
 *
 * Dağıtım: Dağıt > Yeni dağıtım > Web uygulaması
 *   - Şu kullanıcı olarak yürüt: Ben
 *   - Erişimi olanlar: Herkes
 *
 * Test: Dağıtım linkinin sonuna ?format=json ekleyip tarayıcıda aç; "source":"TCMB" görmelisin.
 */
function doGet(e) {
  if (e && e.parameter && e.parameter.format === 'json') {
    return ContentService
      .createTextOutput(JSON.stringify(getExchangeRates()))
      .setMimeType(ContentService.MimeType.JSON);
  }
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Converter Neo')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
}

function getExchangeRates() {
  var cache = CacheService.getScriptCache();
  var cached = cache.get('rates_v2');
  if (cached) return JSON.parse(cached);

  var result;
  try {
    // TCMB resmi günlük XML — Döviz Satış (ForexSelling)
    var xml = UrlFetchApp.fetch('https://www.tcmb.gov.tr/kurlar/today.xml').getContentText();
    var root = XmlService.parse(xml).getRootElement();
    var tryPer = {};   // 1 birim yabancı para = ? TL

    root.getChildren('Currency').forEach(function (c) {
      var code = c.getAttribute('CurrencyCode').getValue();
      var unit = parseFloat(c.getChildText('Unit')) || 1;          // JPY gibi 100'lük birimler
      var sell = parseFloat(c.getChildText('ForexSelling'));
      if (!isNaN(sell) && sell > 0) tryPer[code] = sell / unit;
    });

    var usdTry = tryPer.USD;
    var rates = { USD: 1, TRY: usdTry };
    Object.keys(tryPer).forEach(function (code) {
      if (code !== 'USD') rates[code] = usdTry / tryPer[code];
    });

    result = {
      rates: rates,
      source: 'TCMB',
      date: root.getAttribute('Tarih') ? root.getAttribute('Tarih').getValue() : ''
    };
    cache.put('rates_v2', JSON.stringify(result), 1800);   // 30 dk önbellek
  } catch (err) {
    // Yedek: open.er-api.com (TCMB değil)
    var d = JSON.parse(UrlFetchApp.fetch('https://open.er-api.com/v6/latest/USD').getContentText());
    result = { rates: d.rates, source: 'er-api', date: '' };
    cache.put('rates_v2', JSON.stringify(result), 600);    // yedekte 10 dk
  }
  return result;
}
