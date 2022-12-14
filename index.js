var descRule = /^\s*```\s{0,4}description((.*[\r\n]+)+?)?\s*```$/im;
var kwdsRule = /^\s*```\s{0,4}keywords((.*[\r\n]+)+?)?\s*```$/im;

const htmlent = require('html-entities');
const fs = require('fs');

function processSEO(page) {
  var match;
  if(match = descRule.exec(page.content)) {
    var rawBlock = match[0];
    var seoBlock = match[1].replace(/[\r\n]/mg, "");
    //seoBlock = htmlent.Html5Entities.decode(seoBlock);
    page.content = page.content.replace(rawBlock, '<div id="meta-description---">' + seoBlock + '</div>');
  }
  if(match = kwdsRule.exec(page.content)) {
    var rawBlock = match[0];
    var seoBlock = match[1].replace(/[\r\n]/mg, "");
    //console.log(seoBlock);
    //seoBlock = htmlent.Html5Entities.decode(seoBlock);
    //console.log(seoBlock);
    page.content = page.content.replace(rawBlock, '<div id="meta-keywords---">' + seoBlock + '</div>');
  }

  return page;
}
function makeSEO() {
  var rootDir = this.output.root();
  var ignoreDir = rootDir + "/" + "gitbook";
  var batchModify = function(rootDir){
    fs.readdir(rootDir, function(err,files){
      for(var i=0; i<files.length; i++) {
        var file = files[i];
        var fpath = rootDir + "/" + file;
        if (/\.html$/.test(file)) {
          var data = fs.readFileSync(fpath, 'utf-8');
          var rule =/<meta name="description" [^>]+>/im;
          var rule2 = /<div id="meta-description---">([^>]+)?<\/div>/;
          var match1, match2, match3, match4;
          match1 = rule.exec(data);
          if (match1) {
            match2 = rule2.exec(data, match1[0].index + match1[0].length);
            if (match2) {
              data = data.replace(match2[0], '');
              var seoDesc = '<meta name="description" content="' + htmlent.decode(match2[1]) + '">\n<meta name="og:description" content="' + htmlent.decode(match2[1]) + '">\n<meta name="twitter:description" content="' + htmlent.decode(match2[1]) + '">';

              data = data.replace(match1[0], seoDesc);
              var rule3 = /<meta name="keywords" [^>]+/im;
              var rule4 = /<div id="meta-keywords---">([^>]+)?<\/div>/im;
              if (match3 = rule3.exec(data)) {
                match4 = rule4.exec(data, match1[0].index + match1[0].length);
                if (match4) {
                  data = data.replace(match4[0], '');
                  data = data.replace(match3[0], '');
                  data = data.replace(seoDesc, seoDesc + '\r\n\t\t<meta name="keywords" content="' + htmlent.decode(match4[1]) + '">');

                }
              } else {
                match4 = rule4.exec(data, match1[0].index + match1[0].length);
                if (match4) {
                  data = data.replace(match4[0], '');
                  data = data.replace(seoDesc, seoDesc + '\r\n\t\t<meta name="keywords" content="' + htmlent.decode(match4[1]) + '">');

                }
              }
              fs.writeFileSync(fpath, data, 'utf-8');
            }
          } else {
          }
        } else if (fpath != "."       && 
                   fpath != ".."      &&
                   fpath != ignoreDir &&
                   fs.lstatSync(fpath).isDirectory()) {
          batchModify(fpath);
        }
      }
    });
  };

  batchModify(rootDir);
}
module.exports = {
  hooks: {
    'page:before': processSEO,
    'finish': makeSEO
  }
};
