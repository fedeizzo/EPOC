// document.getElementById("fixed-header-drawer-exp")!.onkeydown = function(e) {
//   if (e.code === "Enter") {
//     // search();
//     const element = <HTMLInputElement>document.getElementById("fixed-header-drawer-exp");
//     const query = element.value;
//     window.location.href = `/search?searchString=${query}`;
//   }
// };

const isCookieSet =
  getCookie("JWT") === undefined || getCookie("JWT") === "" ? false : true;
if (isCookieSet) {
  document!.getElementById("auth-access")!.hidden = true;
  document!.getElementById("auth-off")!.hidden = false;
} else {
  document!.getElementById("auth-access")!.hidden = false;
  document!.getElementById("auth-off")!.hidden = true;
}
