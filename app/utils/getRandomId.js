export default function getRandomId(prefix, separator = "_") {
  let id = "";
  do {
    id = `${prefix}${separator}${(`000000${Math.floor(Math.random() * 100000)}`).substr(-6, 6)}`;
  } while (document.getElementById(id) !== null);
  return id;
}
