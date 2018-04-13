const css = require('css');
const loaderUtils = require('loader-utils');

function processRule(rule) {
    if (!rule || !rule.declarations) return ;

    rule.declarations.forEach(declaration => {
        if (declaration.type === 'declaration') {
            if (!declaration.value.endsWith('!important')) {
                declaration.value += ' !important';
            }
        }
    });
}

function processMediaQuery(rule) {
    if (!rule || !rule.rules) return ;

    rule.rules.forEach(processRule);
}

function isTargetFile(files, resourcePath) {
    return files == null || files.find(f => resourcePath.indexOf(f) >= 0) != null
}

module.exports = function(source) {
    this.cacheable();
    var options = loaderUtils.getOptions(this)

    if(options != null && !isTargetFile(options.files, this.resourcePath)){
        return source
    }

    let ast;
    try{
        ast = css.parse(source)
    } catch(e){
        return source
    }

    if (!ast || !ast.stylesheet || !ast.stylesheet.rules || !ast.stylesheet.rules.length) {
        return source
    }

    ast.stylesheet.rules.forEach(rule => {
      if (rule.type === 'rule') {
        processRule(rule);
      } else if (rule.type === 'media') {
        processMediaQuery(rule);
      }
    });

    return css.stringify(ast);
}