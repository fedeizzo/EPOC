document.getElementById("fixed-header-drawer-exp")!.onkeydown = function(e) {
  if (e.code === "Enter") {
    // search();
    const element = <HTMLInputElement>document.getElementById("fixed-header-drawer-exp");
    const query = element.value;
    window.location.href = `/search?searchString=${query}`;
  }
};
