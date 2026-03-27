# YouthLyrics
This is the web application used for the Benton Youth Group's projected lyrics.

## UG Bookmarklet:

Source:
```javascript
(async function() {
  window.name = await (await fetch(window.location)).text();
  window.location = "https://bentonchurch.github.io/youth-lyrics/import.html";
}());
```

Bookmarlet:
```
javascript:(function()%7B(async%20function()%20%7B%0A%20%20window.name%20%3D%20await%20(await%20fetch(window.location)).text()%3B%0A%20%20window.location%20%3D%20%22https%3A%2F%2Fbentonchurch.github.io%2Fyouth-lyrics%2Fimport.html%22%3B%0A%7D())%3B%7D)()%3B
```
