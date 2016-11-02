# EJS 搭配 FrontMatter 的用法

因為網路上能找到的 Gulp 範例都太強大了，頭腦很容易變成一團漿糊黏在一起。所以寫了這一篇，從最單純的 EJS 開始，慢慢增加東西進去。

## 只用 EJS

首先從最最單純的 ejs_only 開始，這個例子裡面有兩個檔案：
* data_1.txt
* data_2.txt

內容很簡單只有一行，以 data_1.txt 為例：
```
data_1 = <%= data_1 %>
```

其中的 `<%= data_1 %>` 就代表這裡要將變數 `data_1` 的值填在這邊，所以如果值是 `wooo` 那麼我們會得到 `data_1 = wooo` 的結果。

那麼只使用 EJS 的情況下，我們是這樣給定變數的值：
```
var gulp = require('gulp');
var ejs = require("gulp-ejs");

gulp.task('ejs_only', function() {
    return gulp.src(['ejs_only/*.txt'])
        .pipe(ejs({
            'data_1': "I have a pen",
            'data_2': "I have a bird"
        }))
        .pipe(gulp.dest('ejs_only/output'));
});
```

重點在這一段，當 Gulp pipe 給 EJS 的時候，順便指定各個變數的值：
```
.pipe(ejs({
    'data_1': "I have a pen",
    'data_2': "I have a bird"
}))
```

但是這麼做有個很明顯的缺點，就是每一個檔案的變數值都一樣，如果你要給不同檔案不同的資料的話，就得要把變數名稱錯開來不能重複。這麼做其實檔案一多就會非常不方便，很容易出錯。所以我們需要一個方式，可以按照個別檔案來給定變數資料。 

## 搭配 gulp-data

Gulp 有一個 gulp-data 可以做這件事情，接著就來試試看 gulp-data 所提供的功能，範例在 ejs_data 資料夾裡面。從這邊開始，兩個檔案將使用相同的變數名稱，來證明我們有根據不同檔案給資料。

這是 data_1.txt：
```
data = <%= data %>
```
這是 data_2.txt：
```
data = <%= data %>
```
長的一模一樣，你沒有眼花。

接著是重點，必須要在 gulpfile.js 裡面判斷檔案名稱來給資料：
```
var data = require('gulp-data');

gulp.task('ejs_data', function() {
    return gulp.src(['ejs_data/*.txt'])
        .pipe(data(function(file) {
            if (file.path.endsWith("ejs_data/data_1.txt")) {
                return {'data': "I have a pen"}
            } else if (file.path.endsWith("ejs_data/data_2.txt")) {
                return {'data': "I have a bird"};
            }
        }))
        .pipe(ejs())
        .pipe(gulp.dest('ejs_data/output'));
});
```
其中的這五行就是在判斷檔案名稱來給資料：
```
if (file.path.endsWith("ejs_data/data_1.txt")) {
    return {'data': "I have a pen"}
} else if (file.path.endsWith("ejs_data/data_2.txt")) {
    return {'data': "I have a bird"};
}
```

這樣一來我們就解決了不同檔案要給不同值的問題。[gulp-data 網址](https://www.npmjs.com/package/gulp-data)裡面的範例還提供了從 JSON 或是資料庫來讀取資料的方法，也可以參考。

## 使用 gulp-front-matter

gulp-data 看起來解決了問題，但是其實只解決了一半。它確實可以給不同檔案不同的值，但是都必須要有個資料來源。不管是像上面範例寫在 gulpfile.js 裡，或是從 JSON 讀取，都要另外維護一份資料。檔案數量多了就會開始混亂。

現時最常見的作法應該就是採用 FrontMatter 的格式來把資料寫在 EJS 檔案的開頭，讓樣板與資料放在同一個檔案，方便維護。使用 FrontMatter 的範例檔案放在 ejs_fm 資料夾裡。

採用 FrontMatter 的 data_1.txt：
```
---
data: I have aaaa pen
---
data = <%= data %>
```

在 gulpfile.js 裡這樣用：
```
var frontMatter = require('gulp-front-matter');

gulp.task('ejs_fm', function() {
    return gulp.src(['ejs_fm/*.txt'])
        .pipe(frontMatter({
            property: 'data',
            remove: true
        }))
        .pipe(ejs())
        .pipe(gulp.dest('ejs_fm/output'));
});
```

其中的 `property: 'data'` 表示要把資料放在 `data` 這個屬性裡，一般的樣板功能都會從這個 `data` 屬性讀取資料。另外 `remove: true` 則表示將 FrontMatter 讀取完就從原始碼隱藏起來，這樣子輸出的資料才不會還有 FrontMatter 在前面。不過 `remove` 預設就是 `true` 所以略過不寫也是可以的。

## 執行範例

因為這邊的範例通通沒有使用 `watch` 來自動執行，所以要手動去輸入：
* 安裝必要的模組： `npm install`
* 編譯 ejs_fm：`gulp ejs_fm`，其餘類推