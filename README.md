# Css With Important Loader

The Css with important loader allows you to attach the css property `!important` only specific css file.
This is useful for third-party modules effect css name space of your app. Such like `jquery-ui` etc

# Install

```
npm install css-with-important-loader -D
```

# Usage

## webpack.config.js
As always, you should put this configuration after `css-loader` before some transpile css loaders. because this loader convert css to css. It doesn't do to convert another format.

```
module.exports = {
    ...
    module: {
        rules: {
            {loader: `css-loader`}
            {
                test: /\.css$/,
                use: "css-with-important-loader"
            }

        }
    }

}
```


# Typical Use Cases

## jQuery UI

When you want to override some properties.



I reffered this loader. 
https://github.com/officert/css-important-loader