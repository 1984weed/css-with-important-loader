const fs = require('fs')
const path = require('path')
const assign = require('object-assign')
const chai = require('chai')
const expect = chai.expect
const webpack = require('webpack')
const loader = require('../')
const css = require('css')

describe('css-with-important-loader', function(){
    'use strict'
    this.timeout(10000)

    const outputDir = path.resolve(__dirname, './output');
    const bundleFileName = 'bundle.js';
    const getBundleFile = function() {
        return path.join(outputDir, bundleFileName)
    }

    const cssWithImportantLoader = path.resolve(__dirname, '../')
    const globalConfig = {
        context: path.resolve(__dirname, '../'),
        mode: 'development',
		output: {
            path: outputDir,
            filename: bundleFileName
        },
        module: {
            rules: [
                {
                    test: /\.css/,
                    exclude: /node_modules/,
                    use: [
                        { loader: 'css-loader'},
                        {
							loader: cssWithImportantLoader,
							options: {
                            }
                        }
                    ]
                }
            ]
        }
    }

    const nonImportant = `
         div {
            background-color: #eee;
            width: 200px;
            height: 50px;
            border: 1px dotted black;
            overflow: visible;
        }
    `

    const normalExpectStr = `
        div {
        background-color: #eee !important;
        width: 200px !important;
        height: 50px !important;
        border: 1px dotted black !important;
        overflow: visible !important;
    }
    `

    const empty = ``

    it('loader should returns all properties with important', function(){
        const generatedCode = generateCode(nonImportant, ["a.css"], "/usr/local/src/a.css")

        compareCss(generatedCode, normalExpectStr)
    })

    it('loader should returns all the css rule with !important without duplicating pattern', function(){
        const generatedCode = generateCode(nonImportant, ["a.css"], "/usr/local/src/a.css")

        compareCss(generatedCode, normalExpectStr)
    })


    it('loader should returns all properties with important because file is not set', function(){
        const generatedCode = generateCode(nonImportant, null, "/usr/local/src/a.css")

        compareCss(generatedCode, normalExpectStr)
    })

    it('loader should returns original source because of target files are different from resourcePath', function(){
        const generatedCode = generateCode(nonImportant, ["a.css"], "/usr/local/src/b.css")
        compareCss(generatedCode, nonImportant)
    })

    it('loader should retur empty', function() {
        const generatedCode = generateCode(empty, ["a.css"], "/usr/local/src/a.css")
        compareCss(generatedCode, empty)
    })

    describe('media query', function(){
        const mediaQuery = `
            @media screen and (max-width: 600px) {
                body {
                    background-color: olive;
                }
                div {
                    padding: 0;
                    mergin: 0;
                }
            }
        `

        const importantMediaQuery = `
            @media screen and (max-width: 600px) {
                body {
                    background-color: olive !important;
                }
                div {
                    padding: 0 !important;
                    mergin: 0 !important;
                }
            }
        `

        const mediaQueryHasImportant = `
            @media screen and (max-width: 600px) {
                body {
                    background-color: olive;
                }
                div {
                    padding: 0;
                    mergin: 0 !important;
                }
            }
        `
        
        it('should return all the css rules with !important', function() {
            const generatedCode = generateCode(mediaQuery, ["a.css"], "/usr/local/src/a.css")
            compareCss(generatedCode, importantMediaQuery)
        })

        it('should return all the css rules with !important without duplicating pattern', function() {
            const generatedCode = generateCode(mediaQueryHasImportant, ["a.css"], "/usr/local/src/a.css")
            compareCss(generatedCode, importantMediaQuery)
        })
    })


    function compareCss(actualCss, expectedCss) {
        expect(css.stringify(css.parse(actualCss))).to.be.deep.equal(css.stringify(css.parse(expectedCss)))
    }

    function generateCode(css, files, resourcePath) {
        return loader.call({
            cacheable: function(){
            },
            query: {
                files: files
            },
            resourcePath: resourcePath
        },
        css)
    }
})