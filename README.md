# YouthLyrics
This is the web application used for the Benton Youth Group's projected lyrics.

## UG Bookmarklet:

Before the bookmarlet can work, you must go to the [CORS proxy](https://cors-anywhere.herokuapp.com/corsdemo) and request temporary access.

Source:
```javascript
(async function() {
  const data = await (await fetch(window.location)).text();
  const blob = new Blob([data], { type: "text/plain" });
  const formData = new FormData();
  
  formData.append("file", blob);
  
  const downloadLink = (await (await fetch("https://cors-anywhere.herokuapp.com/https://tmpfile.link/api/upload", {
    method: "POST",
    body: formData,
  })).json()).downloadLink;

  window.location = `https://bentonchurch.github.io/youth-lyrics/import.html?url=${downloadLink}`;
}());
```

Bookmarklet:
```
javascript:(function()%7B(async%20function()%20%7B%0A%20%20const%20data%20%3D%20await%20(await%20fetch(window.location)).text()%3B%0A%20%20const%20blob%20%3D%20new%20Blob(%5Bdata%5D%2C%20%7B%20type%3A%20%22text%2Fplain%22%20%7D)%3B%0A%20%20const%20formData%20%3D%20new%20FormData()%3B%0A%20%20%0A%20%20formData.append(%22file%22%2C%20blob)%3B%0A%20%20%0A%20%20const%20downloadLink%20%3D%20(await%20(await%20fetch(%22https%3A%2F%2Fcors-anywhere.herokuapp.com%2Fhttps%3A%2F%2Ftmpfile.link%2Fapi%2Fupload%22%2C%20%7B%0A%20%20%20%20method%3A%20%22POST%22%2C%0A%20%20%20%20body%3A%20formData%2C%0A%20%20%7D)).json()).downloadLink%3B%0A%0A%20%20window.location%20%3D%20%60https%3A%2F%2Fbentonchurch.github.io%2Fyouth-lyrics%2Fimport.html%3Furl%3D%24%7BdownloadLink%7D%60%3B%0A%7D())%3B%7D)()%3B
```
