function iFrameHeight() {

    var ifm = document.getElementById("content");

    var subWeb = document.frames ? document.frames["content"].document :

        ifm.contentDocument;

    if (ifm != null && subWeb != null) {

        ifm.height = subWeb.body.scrollHeight;

    }

}
