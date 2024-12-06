// Proxy server url
const proxyUrl = "https://thingproxy.freeboard.io/fetch/";

// Asynchronous loading function
function loadFile(path) {
  const request = new XMLHttpRequest(); // Create an XMLHttpRequest
  request.open("GET", path, true); // Create a new asynchronous GET request to the specified path
  request.send(null); // Send the request without a body

  // If the request turned out okay, return the response text
  if (request.status === 200) {
    return request.responseText;
  }

  // If it returned any sort of error, return null
  return null;
}

// Synchronous loading function
function loadFileSync(path) {
  const request = new XMLHttpRequest(); // Create an XMLHttpRequest
  request.open("GET", path, false); // Create a new synchronous GET request to the specified path
  request.send(null); // Send the request without a body

  // If the request turned out okay, return the response text
  if (request.status === 200) {
    return request.responseText;
  }

  // If it returned any sort of error, return null
  return null;
}

// Asynchronous loading function
function loadFileProxy(path) {
  const request = new XMLHttpRequest(); // Create an XMLHttpRequest
  request.open("GET", proxyUrl + path, true); // Create a new asynchronous GET request to the specified url via a proxy server

  // Set proper request headers
  request.setRequestHeader("Access-Control-Allow-Headers", "*");
  request.setRequestHeader("Access-Control-Allow-Origin", "*");

  request.send(null); // Send the request without a body

  // If the request turned out okay, return the response text
  if (request.status === 200) {
    return request.responseText;
  }

  // If it returned any sort of error, return null
  return null;
}

// Synchronous loading function
function loadFileProxySync(path) {
  const request = new XMLHttpRequest(); // Create an XMLHttpRequest
  request.open("GET", proxyUrl + path, false); // Create a new synchronous GET request to the specified url via a proxy server

  // Set proper request headers
  request.setRequestHeader("Access-Control-Allow-Headers", "*");
  request.setRequestHeader("Access-Control-Allow-Origin", "*");

  request.send(null); // Send the request without a body

  // If the request turned out okay, return the response text
  if (request.status === 200) {
    return request.responseText;
  }

  // If it returned any sort of error, return null
  return null;
}

// Return the input path as a full url
function rootPath(path) {
  return window.location.origin + "/" + path;
}
