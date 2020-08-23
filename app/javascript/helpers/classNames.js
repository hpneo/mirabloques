export default function classNames(...classNamesList) {
  return classNamesList.filter(className => className).join(" ");
}
