##  plugin for GitBook

Plugin for [GitBook](https://github.com/GitbookIO/gitbook) which enables user to 
customerize "description" and "keywords" of each page.

eg.

```
<meta name="description" content="...">
<meta name="keywords" content="...">
```

### How to install it?

You can use install via **NPM**:
```
$ npm install html-entities
```
```
$ npm install gitbook-plugin-custom-description
```

And use it for your book with in the book.json:

```
{
  "plugins": ["custom-description"]
}
```

### How to use it?
For "description", just put the code into fenced code block and tag it **description** key word like this:

<span>``` description
A page, so simple
```</span>

It will generate 

<meta name="description" content="A page, so simple">

in the respective html file, in `<head>` and `</head>` tag pair.

For "keywords", just put the code into fenced code block and tag it **keywords** key word like this:

``` keywords
keyword1,keyword2
```

It will generate 

<meta name="keywords" content="keyword1,keyword2">

in the respective html file, in `<head>` and `</head>` tag pair.