function postForm(/** @type {Element} */ main, /** @type {Element} */ section, isOdd) {
    //https://admin.hlx.page/form/{owner}/{repo}/{ref}/{path}
    //https://main--frankenstein--upsteve.hlx.page/page2
    const request = new Request("https://admin.hlx.page/form/upsteve/frankenstein/main/test-form.json", {
        method: "POST",
        body: '{"data":{"firstName":"test", "lastName": "user"}}',
        headers: {
            "Content-type": "application/json"
          }
      });

    fetch(request)
        .then((response) => {
            if (response.status === 200) {
            return response.json();
            } else {
            throw new Error("Something went wrong on API server!");
            }
        })
        .then((response) => {
            console.debug(response);
            // …
        })
        .catch((error) => {
            console.error(error);
        });
}

export default postForm
