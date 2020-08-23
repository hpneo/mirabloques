export default function useDOMState(id) {
  const scriptTag = document.getElementById(`${id}-data`);

  if (scriptTag) {
    try {
      return JSON.parse(scriptTag.textContent);
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
