const argv = require("minimist")(process.argv.slice(2));
const readXlsxFile = require("read-excel-file/node");
const fs = require("fs");

readXlsxFile("./" + argv.file, {
  sheet: argv.sheet,
}).then((rows) => {
  const [header, ...data] = rows;
  const jsonData = data.map((row) => {
    return header.reduce((acc, key, index) => {
      acc[key.toLowerCase()] = row[index]?.replaceAll("\n", "<br/>");
      return acc;
    }, {});
  });

  const translations = {
    ko: {},
    en: {},
    ja: {},
  };

  jsonData.forEach(({ key, ko, ja, en }) => {
    if (ko) translations.ko[key] = ko;
    if (en) translations.en[key] = en;
    if (ja) translations.ja[key] = ja;
  });

  Object.keys(translations).forEach((lang) => {
    fs.writeFileSync(
      `./${lang}.json`,
      JSON.stringify(translations[lang], null, 2)
    );
  });
});
